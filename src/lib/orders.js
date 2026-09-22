import db from './db';

const shapeOrder = (order, items) => ({
  id: order.id,
  createdAt: order.created_at,
  status: order.status,
  customer: {
    firstName: order.customer_first_name,
    lastName: order.customer_last_name,
    phone: order.customer_phone,
    address: order.customer_address,
    city: order.customer_city,
  },
  delivery: order.delivery_type,
  payment: order.payment_method,
  subtotal: Number(order.subtotal),
  deliveryFee: Number(order.delivery_fee),
  total: Number(order.total),
  items: items.map((item) => ({
    cartItemId: String(item.id),
    id: item.product_id,
    name: item.product_name,
    price: Number(item.unit_price),
    quantity: item.quantity,
    isCustom: Boolean(item.is_custom),
    customDetails: item.custom_details
      ? (typeof item.custom_details === 'string' ? JSON.parse(item.custom_details) : item.custom_details)
      : undefined,
  })),
});

export async function createOrder(body) {
  const { customer, delivery, payment, items, subtotal, deliveryFee, total } = body;
  if (!customer?.firstName || !customer?.phone || !items?.length) {
    throw new Error('Missing required order fields');
  }

  const orderId = `GZ-${Date.now().toString().slice(-6)}`;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO orders (id, status, customer_first_name, customer_last_name, customer_phone, customer_address, customer_city, delivery_type, payment_method, subtotal, delivery_fee, total)
       VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        customer.firstName,
        customer.lastName || '',
        customer.phone,
        customer.address || '',
        customer.city || 'Karachi',
        delivery || 'standard',
        payment || 'cod',
        subtotal || 0,
        deliveryFee || 0,
        total || 0,
      ]
    );

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, is_custom, custom_details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id || null,
          item.name,
          item.quantity,
          item.isCustom ? 0 : (item.price || 0),
          item.isCustom ? 1 : 0,
          item.customDetails ? JSON.stringify(item.customDetails) : null,
        ]
      );
      if (!item.isCustom && item.id) {
        await connection.query('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [item.quantity, item.id]);
      }
    }

    await connection.commit();
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [orderItems] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return shapeOrder(orders[0], orderItems);
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
}

export async function listOrders() {
  const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
  const result = [];
  for (const order of orders) {
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    result.push(shapeOrder(order, items));
  }
  return result;
}

export async function updateOrderStatus(id, status) {
  const valid = ['pending', 'confirmed', 'delivered', 'cancelled'];
  if (!valid.includes(status)) throw new Error('Invalid status');

  const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  if (result.affectedRows === 0) return null;

  const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
  const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
  return shapeOrder(orders[0], items);
}

export async function removeOrder(id) {
  const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
