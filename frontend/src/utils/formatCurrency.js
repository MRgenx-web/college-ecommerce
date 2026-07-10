// Formats a number as Indian Rupees, e.g. 74999 -> "₹74,999"
export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Percentage discount between MRP and selling price, rounded down.
export function discountPercent(price, mrp) {
  if (!mrp || mrp <= price) return 0;
  return Math.floor(((mrp - price) / mrp) * 100);
}
