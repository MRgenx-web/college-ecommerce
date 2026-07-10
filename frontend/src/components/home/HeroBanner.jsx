import { Link } from 'react-router-dom';

function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 lg:flex-row lg:px-8 lg:py-28">
        <div className="flex-1 text-center lg:text-left">
          <p className="mb-4 inline-block rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-sm">
            India's Trusted Electronics Store
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Latest Tech, <br className="hidden lg:block" /> Best Prices in India
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-blue-100 lg:mx-0">
            Shop mobiles, laptops, audio, gaming gear and more from top brands — with fast
            delivery across India.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-blue-700 shadow-soft-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
          >
            Shop Now
          </Link>
        </div>
        <div className="flex flex-1 justify-center">
          <img
            src="https://placehold.co/500x360/ffffff/2563eb?text=TechKart+India"
            alt="TechKart India"
            className="w-full max-w-md rounded-2xl shadow-soft-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
