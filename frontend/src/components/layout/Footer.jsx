import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">TechKart India</h3>
          <p className="text-sm text-gray-400">
            Your trusted destination for the latest electronics — mobiles, laptops, audio,
            gaming gear, and more, delivered across India.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link to={`/products?category=${encodeURIComponent(category)}`} className="hover:text-white">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Email: support@techkart.in</li>
            <li>Phone: 1800-123-4567</li>
            <li>Bengaluru, Karnataka, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} TechKart India. Built as a college project. All prices in INR (₹).
      </div>
    </footer>
  );
}

export default Footer;
