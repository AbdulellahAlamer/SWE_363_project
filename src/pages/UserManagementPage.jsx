
import { useState } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import PopupForm from "../components/PopupForm.jsx";
import { userManagementUsers } from "../assets/data.js";

const addUserFields = [
  {
    name: "fullName",
    label: "Full name",
    dataType: "string",
    placeholder: "Student Name",
  },
  {
    name: "email",
    label: "KFUPM email",
    dataType: "email",
    placeholder: "name@kfupm.edu.sa",
  },
  {
    name: "role",
    label: "Role",
    dataType: "string",
    options: [
      { value: "student", label: "Student" },
      { value: "president", label: "Club President" },
      { value: "admin", label: "Administrator" },
    ],
  },
  {
    name: "club",
    label: "Club assignment",
    dataType: "string",
    placeholder: "Optional for students",
    required: false,
  },
  {
    name: "isActive",
    label: "Active account",
    dataType: "boolean",
    required: false,
  },
];

export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState(userManagementUsers);
  const [editIndex, setEditIndex] = useState(null);
  const [editUser, setEditUser] = useState({ name: '', email: '', role: '', joined: '', initials: '' });
  const [searchTerm, setSearchTerm] = useState("");

  // Add user handler
  function handleAddUser(formData) {
    // formData: { fullName, email, role, club, isActive }
    const initials = (formData.fullName || "?")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    setUsers([
      ...users,
      {
        name: formData.fullName,
        email: formData.email,
        role:
          formData.role === "student"
            ? "Student"
            : formData.role === "president"
            ? "Club President"
            : "Administrator",
        joined: new Date().toLocaleString("default", { month: "short", year: "numeric" }),
        initials,
      },
    ]);
    setShowForm(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NavigationBar active="/user-management" type="admin" />

      <main className="ml-64 flex-1 space-y-6 p-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Admin · Access control
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              User Management
            </h1>
          </div>
          <button
            className="rounded-full bg-linear-to-r from-blue-600 to-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:translate-y-0.5"
            onClick={() => setShowForm(true)}
          >
            + Add User
          </button>
        </header>

        <section className="rounded-2xl border border-white bg-white/80 shadow-md shadow-slate-200">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                All users
              </h2>
              <p className="text-sm text-slate-500">
                Monitor account access across KFUPM clubs.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="w-full text-sm text-slate-700">
            <thead className="text-left uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => {
                  if (!searchTerm) return true;
                  const first = searchTerm.trim()[0];
                  if (!first) return true;
                  // Check first char of name or email
                  return (
                    user.name.charAt(0).toLowerCase() === first.toLowerCase() ||
                    user.email.charAt(0).toLowerCase() === first.toLowerCase()
                  );
                })
                .map((user, idx) => (
                <tr
                  key={user.email}
                  className="border-t border-slate-100 bg-white/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                        {user.initials}
                      </div>
                      <div>
                        {editIndex === idx ? (
                          <>
                            <input
                              className="font-semibold text-slate-900 border rounded px-2 py-1 mb-1 w-full"
                              value={editUser.name}
                              onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                            />
                            <input
                              className="text-xs text-slate-400 border rounded px-2 py-1 w-full"
                              value={editUser.joined}
                              onChange={e => setEditUser({ ...editUser, joined: e.target.value })}
                            />
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-400">Joined {user.joined}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editIndex === idx ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={editUser.email}
                        onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                      />
                    ) : user.email}
                  </td>
                  <td className="px-6 py-4">
                    {editIndex === idx ? (
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={editUser.role}
                        onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                      >
                        <option value="Student">Student</option>
                        <option value="Club President">Club President</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    ) : user.role}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editIndex === idx ? (
                      <>
                        <button
                          className="text-green-600 hover:underline mr-2"
                          onClick={() => {
                            const updated = [...users];
                            updated[idx] = { ...editUser, initials: (editUser.name.split(' ').map(n => n[0]).join('').toUpperCase()).slice(0,2) };
                            setUsers(updated);
                            setEditIndex(null);
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-500 hover:underline"
                          onClick={() => setEditIndex(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setEditIndex(idx);
                            setEditUser(user);
                          }}
                        >
                          Edit
                        </button>
                        <span className="mx-2 text-slate-300">|</span>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => {
                            if (window.confirm(`Remove user ${user.name}?`)) {
                              setUsers(users.filter((_, i) => i !== idx));
                            }
                          }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {showForm && (
        <PopupForm
          method="POST"
          endpoint="/api/users"
          fields={addUserFields}
          submitLabel="Create user"
          onClose={() => setShowForm(false)}
          onSubmit={handleAddUser}
        />
      )}
    </div>
  );
}
