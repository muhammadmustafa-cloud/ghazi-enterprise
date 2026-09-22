import db from './db';

export async function listCategories() {
  const [categories] = await db.query('SELECT * FROM categories');
  return categories;
}

export async function createCategory({ id, name, image }) {
  await db.query('INSERT INTO categories (id, name, image) VALUES (?, ?, ?)', [id, name, image]);
}

export async function removeCategory(id) {
  const [products] = await db.query('SELECT id FROM products WHERE category_id = ? LIMIT 1', [id]);
  if (products.length > 0) {
    throw new Error('Cannot delete category with existing products');
  }
  const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
