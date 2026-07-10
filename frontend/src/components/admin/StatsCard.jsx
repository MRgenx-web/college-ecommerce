function StatsCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
