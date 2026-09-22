import db from './db';

const shapeProduct = (product, images, pricing) => {
  product.images = images.map((img) => img.image_url);
  product.bulkPricing = pricing.map((t) => ({ minQty: t.minQty, price: Number(t.price) }));
  product.category = product.category_id;
  product.condition = product.condition_status;
  product.price = Number(product.price);
  product.stock = Number(product.stock);
  product.customizable = Boolean(product.customizable);
  delete product.category_id;
  delete product.condition_status;
  return product;
};

async function loadProductExtras(product) {
  const [images] = await db.query('SELECT image_url FROM product_images WHERE product_id = ?', [product.id]);
  const [pricing] = await db.query(
    'SELECT min_qty as minQty, price FROM bulk_pricing WHERE product_id = ? ORDER BY min_qty ASC',
    [product.id]
  );
  return shapeProduct(product, images, pricing);
}

function parseProductBody(body) {
  const { id, name, category, price, dimensions, ply, material, condition, stock, description } = body;
  const customizable = body.customizable === 'true' || body.customizable === true;
  let bulkPricing = body.bulkPricing || [];
  if (typeof bulkPricing === 'string') {
    try { bulkPricing = JSON.parse(bulkPricing); } catch { bulkPricing = []; }
  }
  let images = body.images || [];
  if (!Array.isArray(images)) images = [images];
  return { id, name, category, price, dimensions, ply, material, condition, stock, description, customizable, bulkPricing, images };
}

export async function listProducts() {
  const [products] = await db.query(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);
  for (let i = 0; i < products.length; i++) {
    products[i] = await loadProductExtras(products[i]);
  }
  return products;
}

export async function getProduct(id) {
  const [rows] = await db.query(`
    SELECT p.*, c.name as category_name 
    FROM products p 
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [id]);
  if (!rows.length) return null;
  return loadProductExtras(rows[0]);
}

export async function createProduct(body) {
  const { id, name, category, price, dimensions, ply, material, condition, stock, description, customizable, bulkPricing, images } = parseProductBody(body);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO products (id, category_id, name, price, dimensions, ply, material, condition_status, stock, description, customizable) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category, name, price, dimensions, ply, material, condition, stock, description, customizable]
    );
    for (const img of images) {
      await connection.query('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [id, img]);
    }
    for (const tier of bulkPricing) {
      await connection.query('INSERT INTO bulk_pricing (product_id, min_qty, price) VALUES (?, ?, ?)', [id, tier.minQty, tier.price]);
    }
    await connection.commit();
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function updateProduct(id, body) {
  const { name, category, price, dimensions, ply, material, condition, stock, description, customizable, bulkPricing, images } = parseProductBody(body);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `UPDATE products SET category_id=?, name=?, price=?, dimensions=?, ply=?, material=?, condition_status=?, stock=?, description=?, customizable=? WHERE id=?`,
      [category, name, price, dimensions, ply, material, condition, stock, description, customizable, id]
    );
    await connection.query('DELETE FROM product_images WHERE product_id = ?', [id]);
    await connection.query('DELETE FROM bulk_pricing WHERE product_id = ?', [id]);
    for (const img of images) {
      await connection.query('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)', [id, img]);
    }
    for (const tier of bulkPricing) {
      await connection.query('INSERT INTO bulk_pricing (product_id, min_qty, price) VALUES (?, ?, ?)', [id, tier.minQty, tier.price]);
    }
    await connection.commit();
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function removeProduct(id) {
  const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
