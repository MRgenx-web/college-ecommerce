import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  Mobiles: '📱',
  Laptops: '💻',
  Audio: '🎧',
  Accessories: '🔌',
  Gaming: '🎮',
  Wearables: '⌚',
};

function CategoryGrid({ categories }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ category, count }) => (
          <Link
            key={category}
            to={`/products?category=${encodeURIComponent(category)}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft-lg"
          >
            <span className="text-3xl transition-transform duration-300 group-hover:scale-110">{CATEGORY_ICONS[category] || '🛍️'}</span>
            <span className="text-sm font-semibold text-gray-800">{category}</span>
            <span className="text-xs text-gray-400">{count} items</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
