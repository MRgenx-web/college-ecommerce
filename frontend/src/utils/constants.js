export const CATEGORIES = ['Mobiles', 'Laptops', 'Audio', 'Accessories', 'Gaming', 'Wearables'];

export const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'COD', label: 'Cash on Delivery' },
];

export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const ORDER_STATUS_STYLES = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

// Shown wherever a product has no image URLs (e.g. an admin-created product
// that hasn't had images added yet).
export const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600/e5e7eb/6b7280?text=No+Image';
