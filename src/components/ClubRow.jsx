// ClubRow component for displaying and editing a club row in the table
export default function ClubRow({ club, editingId, editForm, setEditForm, onEdit, onDelete, onSaveEdit, onCancelEdit }) {
  return (
    <tr className="border-b border-gray-200">
      <td className="py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          {club.initials}
        </div>
        <div className="flex-1">
          {editingId === club.id ? (
            <input
              value={editForm.name}
              onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
              className="px-3 py-2 border rounded-lg w-full"
            />
          ) : (
            <>
              <div>{club.name}</div>
              <div className="text-sm text-gray-500">{club.updated}</div>
            </>
          )}
        </div>
      </td>
      <td className="py-4 w-1/4">
        {editingId === club.id ? (
          <input
            value={editForm.president}
            onChange={(e) => setEditForm((s) => ({ ...s, president: e.target.value }))}
            className="px-3 py-2 border rounded-lg w-full"
          />
        ) : (
          club.president
        )}
      </td>
      <td className="py-4 w-24">{club.members}</td>
      <td className="py-4">
        <div className="flex gap-4">
          {editingId === club.id ? (
            <>
              <button onClick={() => onSaveEdit(club.id)} className="text-blue-600 hover:text-blue-700">Save</button>
              <button onClick={onCancelEdit} className="text-gray-600 hover:text-gray-700">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => onEdit(club)} className="text-blue-600 hover:text-blue-700">Edit</button>
              <button onClick={() => onDelete(club.id)} className="text-red-600 hover:text-red-700">Delete</button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
