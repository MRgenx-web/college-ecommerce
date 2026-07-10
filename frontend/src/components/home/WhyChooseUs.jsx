const FEATURES = [
  { icon: '🚚', title: 'Fast Delivery', desc: 'Quick shipping to every corner of India.' },
  { icon: '✅', title: 'Genuine Products', desc: '100% authentic products from trusted brands.' },
  { icon: '💳', title: 'Secure Payments', desc: 'UPI, Cards, and Cash on Delivery supported.' },
  { icon: '↩️', title: 'Easy Returns', desc: 'Hassle-free 7-day replacement policy.' },
];

function WhyChooseUs() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-gray-900">Why Choose TechKart India</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-2 rounded-2xl p-6 text-center transition-colors duration-300 hover:bg-blue-50/60"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
                {feature.icon}
              </span>
              <h3 className="mt-1 font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
