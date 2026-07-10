import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

// UI-only newsletter signup (no backend endpoint in scope for this project).
function Newsletter() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Thanks for subscribing to TechKart India updates!', 'success');
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-br from-blue-700 to-indigo-700 py-16 text-white">
      <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">Stay Updated</h2>
        <p className="mt-2 text-blue-100">
          Subscribe for the latest deals and new arrivals from TechKart India.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row sm:gap-2">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 rounded-lg px-4 py-3 text-sm text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <button
            type="submit"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
