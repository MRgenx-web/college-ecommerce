// Static customer testimonials for the home page (no reviews API in scope).
const REVIEWS = [
  {
    name: 'Ananya Sharma',
    city: 'Mumbai',
    rating: 5,
    text: 'Ordered a OnePlus phone and it arrived in 2 days! Genuine product and great packaging.',
  },
  {
    name: 'Rahul Verma',
    city: 'Delhi',
    rating: 5,
    text: 'Best prices I found for laptops online. Customer support was quick to resolve my query.',
  },
  {
    name: 'Priya Nair',
    city: 'Bengaluru',
    rating: 4,
    text: 'Good collection of audio accessories. The boAt earphones I bought work perfectly.',
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-gray-900">What Our Customers Say</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {REVIEWS.map((review) => (
          <div
            key={review.name}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="mb-3 text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
            <p className="text-sm leading-relaxed text-gray-600">"{review.text}"</p>
            <p className="mt-4 text-sm font-semibold text-gray-800">
              {review.name} <span className="font-normal text-gray-400">· {review.city}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
