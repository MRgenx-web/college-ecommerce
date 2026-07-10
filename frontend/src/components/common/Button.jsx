// Reusable button with a few style variants, used throughout the app so
// button styling stays consistent without repeating Tailwind classes.
const VARIANTS = {
  primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md disabled:bg-blue-300 disabled:shadow-none',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:text-gray-400',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md disabled:bg-red-300 disabled:shadow-none',
  outline: 'border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:text-gray-400',
};

function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
