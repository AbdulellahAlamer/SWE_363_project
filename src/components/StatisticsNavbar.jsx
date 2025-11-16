export default function StatisticsNavbar({ stats }) {
  return (
    <div className="bg-[#c4cff7] m-8 rounded-lg shadow-md p-6">
      <div className="grid grid-cols-4 gap-6">
        {stats?.map(({ label, value }, index) => (
          <div
            key={`${label}-${index}`}
            className="bg-white p-4 rounded-lg shadow"
          >
            <p className="text-gray-600 text-sm">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
