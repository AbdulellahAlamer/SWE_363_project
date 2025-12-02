import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar.jsx";
import PopupForm from "../components/PopupForm.jsx";
import { request } from "../api/client.js";

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
  const [users, setUsers] = useState([]);
    useEffect(() => {
      async function fetchUsers() { 
        try {
          const res = await request("/users?status=active");
          setUsers(
            (res.data || [])
              .filter(user => user.status !== "Deleted")
              .map((user) => ({
                _id: user._id, // Ensure ID is present for backend requests
                name: user.name,
                email: user.email,
                role:
                  user.role === "student"
                    ? "Student"
                    : user.role === "president"
                    ? "Club President"
                    : "Administrator",
                joined: user.createdAt
                  ? new Date(user.createdAt).toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })
                  : "",
                initials: (user.name || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2),
              }))
          );
        } catch (err) {
          setUsers([]);
        }
      }
      fetchUsers();
    }, []);
  const [editIndex, setEditIndex] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "",
    joined: "",
    initials: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Add user handler (remains local for now)
  function handleAddUser(formData) {
    // ...existing code...
    setShowForm(false);
  }

  // Edit user handler (calls backend)
  async function handleEditUser(index) {
    const user = users[index];
    try {
      const res = await request(`/users/${user._id || user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          role:
            editUser.role === "Student"
              ? "student"
              : editUser.role === "Club President"
              ? "president"
              : "admin",
        }),
      });
      // Update local state with backend response
      const updated = [...users];
      updated[index] = {
        ...updated[index],
        ...editUser,
        role: editUser.role,
      };
      setUsers(updated);
      setEditIndex(null);
    } catch (err) {
      // Optionally show error
      setEditIndex(null);
    }
  }

  // Remove user handler (calls backend)
  async function handleRemoveUser(index) {
    const user = users[index];
    try {
      await request(`/users/${user._id || user.id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((_, i) => i !== index));
    } catch (err) {
      // Optionally show error
    }
  }

  const filteredUsers = users
    .map((user, originalIndex) => ({ user, originalIndex }))
    .filter(({ user }) => {
      if (!searchTerm) return true;
      const first = searchTerm.trim()[0];
      if (!first) return true;
      return (
        user.name.charAt(0).toLowerCase() === first.toLowerCase() ||
        user.email.charAt(0).toLowerCase() === first.toLowerCase()
      );
    });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NavigationBar active="/user-management" type="admin" />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 pt-16 md:pt-10 md:ml-64">
        <header className="rounded-2xl border border-white bg-white/90 shadow-md shadow-slate-200 px-4 sm:px-16 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-fit sm:w-full ">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Admin · Access control
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              User Management
            </h1>
          </div>
          <button
            className="w-full sm:w-auto rounded-full bg-linear-to-r from-blue-600 to-indigo-500 py-2 sm:px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:translate-y-0.5"
            onClick={() => setShowForm(true)}
          >
            + Add User
          </button>
        </header>

        <section className="rounded-2xl border border-white bg-white/80 shadow-md shadow-slate-200 overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-4 sm:px-6 py-5 md:flex-row md:items-center md:justify-between">
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
              className="w-full max-w-full sm:max-w-xs rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sm:hidden px-4 pt-4 space-y-3">
            {filteredUsers.map(({ user, originalIndex }) => (
              <div
                key={`mobile-${user.email}`}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-600">
                    {user.initials}
                  </div>
                  <div className="flex-1">
                    {editIndex === originalIndex ? (
                      <>
                        <input
                          className="font-semibold text-slate-900 border rounded px-2 py-1 mb-1 w-full"
                          value={editUser.name}
                          onChange={(e) =>
                            setEditUser({ ...editUser, name: e.target.value })
                          }
                        />
                        <input
                          className="text-xs text-slate-400 border rounded px-2 py-1 w-full"
                          value={editUser.joined}
                          onChange={(e) =>
                            setEditUser({ ...editUser, joined: e.target.value })
                          }
                        />
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Joined {user.joined}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase text-slate-400 mb-1">
                      Email
                    </p>
                    {editIndex === originalIndex ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={editUser.email}
                        onChange={(e) =>
                          setEditUser({ ...editUser, email: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-slate-600">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-400 mb-1">
                      Role
                    </p>
                    {editIndex === originalIndex ? (
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={editUser.role}
                        onChange={(e) =>
                          setEditUser({ ...editUser, role: e.target.value })
                        }
                      >
                        <option value="Student">Student</option>
                        <option value="Club President">Club President</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    ) : (
                      <p className="text-slate-600">{user.role}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-4 text-sm font-semibold">
                  {editIndex === originalIndex ? (
                    <>
                      <button
                        className="text-green-600"
                        onClick={() => handleEditUser(originalIndex)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-blue-600"
                        onClick={() => {
                          setEditIndex(originalIndex);
                          setEditUser({ ...user });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          if (window.confirm(`Remove user ${user.name}?`)) {
                            handleRemoveUser(originalIndex);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto w-full">
            <table className="w-full min-w-[720px] text-sm text-slate-700">
              <thead className="text-left uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(({ user, originalIndex }) => (
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
                    {editIndex === originalIndex ? (
                      <>
                        <input
                          className="font-semibold text-slate-900 border rounded px-2 py-1 mb-1 w-full"
                          value={editUser.name}
                          onChange={(e) =>
                                    setEditUser({
                                      ...editUser,
                                      name: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  className="text-xs text-slate-400 border rounded px-2 py-1 w-full"
                                  value={editUser.joined}
                                  onChange={(e) =>
                                    setEditUser({
                                      ...editUser,
                                      joined: e.target.value,
                                    })
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <p className="font-semibold text-slate-900">
                                  {user.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Joined {user.joined}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                    {editIndex === originalIndex ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={editUser.email}
                        onChange={(e) =>
                          setEditUser({
                                ...editUser,
                                email: e.target.value,
                              })
                            }
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="px-6 py-4">
                    {editIndex === originalIndex ? (
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={editUser.role}
                        onChange={(e) =>
                              setEditUser({ ...editUser, role: e.target.value })
                            }
                          >
                            <option value="Student">Student</option>
                            <option value="Club President">
                              Club President
                            </option>
                            <option value="Administrator">Administrator</option>
                          </select>
                        ) : (
                          user.role
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                    {editIndex === originalIndex ? (
                      <>
                        <button
                          className="text-green-600 hover:underline mr-2"
                          onClick={() => handleEditUser(originalIndex)}
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
                              setEditIndex(originalIndex);
                              setEditUser({ ...user });
                            }}
                          >
                            Edit
                          </button>
                          <span className="mx-2 text-slate-300">|</span>
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => {
                              if (window.confirm(`Remove user ${user.name}?`)) {
                                handleRemoveUser(originalIndex);
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
          </div>
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
