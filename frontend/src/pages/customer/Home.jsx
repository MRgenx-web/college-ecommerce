import { useEffect, useState } from 'react';
import * as productService from '../../services/productService';
import HeroBanner from '../../components/home/HeroBanner';
import CategoryGrid from '../../components/home/CategoryGrid';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import Testimonials from '../../components/home/Testimonials';
import Newsletter from '../../components/home/Newsletter';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories(),
        ]);
        setFeatured(featuredRes.products);
        setCategories(categoriesRes.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      <HeroBanner />

      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState title="Couldn't load products" message={error} />
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <CategoryGrid categories={categories} />
        </>
      )}

      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

export default Home;
