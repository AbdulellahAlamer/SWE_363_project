export default function StatisticsNavbar({ stats }) {
  return (
    <div className="bg-[#c4cff7] rounded-2xl shadow-md p-4 sm:p-5 lg:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {stats?.map(({ label, value }, index) => (
          <div
            key={`${label}-${index}`}
            className="bg-white p-4 rounded-xl shadow text-center sm:text-left"
          >
            <p className="text-gray-600 text-xs sm:text-sm">{label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
