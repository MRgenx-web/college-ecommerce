function StockBadge({ stock }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
        Out of Stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
        Only {stock} left
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      In Stock
    </span>
  );
}

export default StockBadge;
