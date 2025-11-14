import Button from "./Button";

function ClubCard({ club, onJoin, onView }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-600 transition flex flex-col">
      {/* Logo */}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4">
        {club.initials}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{club.category}</p>

      {/* Meta */}
      <div className="flex gap-3 mb-4 text-sm flex-wrap">
        <span className="font-medium text-blue-600">{club.members} members</span>
        <span
          className={`px-3 py-1 rounded font-medium ${
            club.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {club.status === "active" ? "Active" : "Awaiting President"}
        </span>
      </div>

      {/* President Info */}
      <p className="text-gray-600 text-sm mb-4">
        <span className="font-medium">President:</span> {club.president}
      </p>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="primary"
          className="flex-1"
          onClick={onJoin}
        >
          Join
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onView}
        >
          View
        </Button>
      </div>
    </div>
  );
}

export default ClubCard;