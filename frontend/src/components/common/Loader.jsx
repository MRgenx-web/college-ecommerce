// Reusable spinner shown while async data is loading.
function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="flex items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>;
  }
  return spinner;
}

export default Loader;
