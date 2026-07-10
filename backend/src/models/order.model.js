// Data access layer for orders + order_items. Order creation runs inside a
// transaction so the order row and its line items are written atomically.
const db = require('../database/db');
const ApiError = require('../utils/ApiError');

const parseOrder = (row) => {
  if (!row) return row;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id);
  return { ...row, items };
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);
  return `TK${timestamp}${random}`;
};

const create = async ({ userId, shipping, paymentMethod, items, totalAmount }) => {
  const orderNumber = generateOrderNumber();

  const insertOrder = db.prepare(`
    INSERT INTO orders
      (order_number, user_id, full_name, mobile, email, house_no, area, city, state, pincode, payment_method, total_amount)
    VALUES (@order_number, @user_id, @full_name, @mobile, @email, @house_no, @area, @city, @state, @pincode, @payment_method, @total_amount)
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Atomic check-and-decrement: the WHERE clause only matches (and only then
  // decrements) if enough stock remains, closing the race window between the
  // controller's earlier stock check and this write.
  const decrementStock = db.prepare(
    'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?'
  );

  const runTransaction = db.transaction(() => {
    const result = insertOrder.run({
      order_number: orderNumber,
      user_id: userId,
      full_name: shipping.fullName,
      mobile: shipping.mobile,
      email: shipping.email,
      house_no: shipping.houseNo,
      area: shipping.area,
      city: shipping.city,
      state: shipping.state,
      pincode: shipping.pincode,
      payment_method: paymentMethod,
      total_amount: totalAmount,
    });

    const orderId = result.lastInsertRowid;

    for (const item of items) {
      const stockResult = decrementStock.run(item.quantity, item.productId, item.quantity);
      if (stockResult.changes === 0) {
        // Another order consumed the remaining stock between validation and
        // this write; throwing here rolls back the whole transaction.
        throw new ApiError(409, `"${item.name}" just sold out. Please update your cart.`);
      }
      insertItem.run(orderId, item.productId, item.name, item.image, item.price, item.quantity);
    }

    return orderId;
  });

  const orderId = runTransaction();
  return parseOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
};

const findById = async (id) => {
  return parseOrder(db.prepare('SELECT * FROM orders WHERE id = ?').get(id));
};

const findByUser = async (userId) => {
  const rows = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId);
  return rows.map(parseOrder);
};

const findAll = async () => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  return rows.map(parseOrder);
};

const updateStatus = async (id, status) => {
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  return findById(id);
};

const count = async () => {
  return db.prepare('SELECT COUNT(*) AS total FROM orders').get().total;
};

const totalRevenue = async () => {
  return db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status != 'Cancelled'").get().total;
};

module.exports = { create, findById, findByUser, findAll, updateStatus, count, totalRevenue };
