// Generic "nothing here" placeholder used across products, cart, orders, etc.
function EmptyState({ title = 'Nothing here yet', message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
        📦
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-gray-800">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
