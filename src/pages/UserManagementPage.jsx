import NavigationBar from "../components/NavigationBar";

export default function UserManagementPage() {
  return (
    <div className="flex min-h-screen">
      <NavigationBar 
        active="/user-management" 
        hidden={["/",'/clubs', '/events', '/posts', '/profile', '/my-clubs']}
      />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add New User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <input
              type="text"
              placeholder="Search by name or email"
              className="px-4 py-2 border rounded-lg w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 text-gray-600">NAME</th>
                  <th className="pb-3 text-gray-600">EMAIL</th>
                  <th className="pb-3 text-gray-600">ROLE</th>
                  <th className="pb-3 text-gray-600 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      SA
                    </div>
                    <div>
                      <div>Sara Al-Otaibi</div>
                      <div className="text-sm text-gray-500">Joined Jun 2022</div>
                    </div>
                  </td>
                  <td className="py-4">s.otaibi@kfupm.edu.sa</td>
                  <td className="py-4">Club President</td>
                  <td className="py-4">
                    <div className="flex gap-4 justify-end">
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      MA
                    </div>
                    <div>
                      <div>Mohammed Al-Qahtani</div>
                      <div className="text-sm text-gray-500">Joined Jan 2023</div>
                    </div>
                  </td>
                  <td className="py-4">m.qahtani@kfupm.edu.sa</td>
                  <td className="py-4">Student</td>
                  <td className="py-4">
                    <div className="flex gap-4 justify-end">
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      AA
                    </div>
                    <div>
                      <div>Abdullah Al-Harbi</div>
                      <div className="text-sm text-gray-500">Joined Sep 2021</div>
                    </div>
                  </td>
                  <td className="py-4">abdullah.harbi@kfupm.edu.sa</td>
                  <td className="py-4">Student</td>
                  <td className="py-4">
                    <div className="flex gap-4 justify-end">
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
