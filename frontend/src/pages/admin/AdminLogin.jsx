// Separate admin login screen. Uses the same auth endpoint as customer
// login, but rejects the session if the account is not role "admin".
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';

function AdminLogin() {
  const { login, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const loggedInUser = await login(form);
      if (loggedInUser.role !== 'admin') {
        await logout();
        showToast('This account does not have admin access', 'error');
        return;
      }
      showToast('Welcome back, Admin!', 'success');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-soft-lg">
        <div className="mb-2 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/15 text-2xl">🔐</span>
        </div>
        <h1 className="text-center text-2xl font-bold tracking-tight text-white">TechKart Admin</h1>
        <p className="mt-1 text-center text-sm text-gray-400">Sign in to manage the store.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-xs font-medium text-gray-400">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white transition-colors focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-xs font-medium text-gray-400">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white transition-colors focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
