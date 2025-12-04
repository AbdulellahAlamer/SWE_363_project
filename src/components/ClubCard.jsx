import Button from "./Button";

function ClubCard({ club, onToggle, onView, isJoined = false }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-600 transition flex flex-col">
      <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4">
        {club.initials}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{club.category}</p>

      <div className="flex gap-3 mb-4 text-sm flex-wrap">
        <span className="font-medium text-blue-600">{club.members} members</span>
        <span
          className={`px-3 py-1 rounded font-medium ${
            club.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {club.status === "active" ? "Active" : "Awaiting President"}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        <span className="font-medium">President:</span> {club.president}
      </p>

      <div className="flex gap-2 mt-auto">
        <Button
          variant={isJoined ? "ghost" : "primary"}
          className="flex-1"
          onClick={() => onToggle?.(club)}
          aria-pressed={isJoined}
          aria-label={
            isJoined ? `Unsubscribe from ${club.name}` : `Subscribe to ${club.name}`
          }
        >
          {isJoined ? "Unsubscribe" : "Subscribe"}
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onView?.(club.id)} // ensure id is provided
        >
          View
        </Button>
      </div>
    </div>
  );
}

export default ClubCard;
