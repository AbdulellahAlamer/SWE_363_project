import NavigationBar from '../components/NavigationBar.jsx';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <NavigationBar active="/admin" hidden={["/",'/clubs', '/events', '/posts', '/profile', '/my-clubs']} />
      <div className="flex-1 ml-64">
        <div className="bg-[#c4cff7] m-8 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Active Clubs Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Clubs</p>
              <p className="text-2xl font-bold mt-2">24</p>
            </div>
            
            {/* Total Events Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Upcoming Events</p>
              <p className="text-2xl font-bold mt-2">156</p>
            </div>
            
            {/* Active Members Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Event Attendance</p>
              <p className="text-2xl font-bold mt-2">1,234</p>
            </div>
            
            {/* New Requests Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">New Registrations</p>
              <p className="text-2xl font-bold mt-2">18</p>
            </div>
          </div>
        </div>
        <div className="mx-8 mb-4">
          <h2 className="text-xl font-semibold">Club Catalog</h2>
        </div>

        <div className="mx-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search clubs"
                className="px-4 py-2 border rounded-lg w-64"
              />
              <div className="flex gap-4">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">All</button>
                <button className="px-4 py-2 hover:bg-blue-50 rounded-lg">Awaiting Approval</button>
                <button className="px-4 py-2 hover:bg-blue-50 rounded-lg">Inactive</button>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">Refresh</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 text-gray-600">CLUB</th>
                  <th className="pb-3 text-gray-600">PRESIDENT</th>
                  <th className="pb-3 text-gray-600">MEMBERS</th>
                  <th className="pb-3 text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">CS</div>
                    <div>
                      <div>Computer Club</div>
                      <div className="text-sm text-gray-500">Updated 2d ago</div>
                    </div>
                  </td>
                  <td className="py-4">Saeed Al-Qahtani</td>
                  <td className="py-4">860</td>
                  <td className="py-4">
                    <div className="flex gap-4">
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">IE</div>
                    <div>
                      <div>Industrial Engineering Society</div>
                      <div className="text-sm text-gray-500">Updated 1w ago</div>
                    </div>
                  </td>
                  <td className="py-4">Vacant</td>
                  <td className="py-4">320</td>
                  <td className="py-4">
                    <div className="flex gap-4">
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">ME</div>
                    <div>
                      <div>Mechanical Engineers</div>
                      <div className="text-sm text-gray-500">Updated 3d ago</div>
                    </div>
                  </td>
                  <td className="py-4">Sara Al-Otaibi</td>
                  <td className="py-4">540</td>
                  <td className="py-4">
                    <div className="flex gap-4">
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Create New Club Section */}
        <div className="mx-8 mb-4 mt-8">
          <h2 className="text-xl font-semibold">Create New Club</h2>
          <span className="text-blue-600 text-sm ml-4">Step 1 of 3</span>
        </div>

        <div className="mx-8 bg-white rounded-lg shadow-md p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
            Draft the club profile, assign the leadership team, and publish when you are ready for students to subscribe.
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Club Name</label>
              <input type="text" placeholder="Enter club name" className="px-4 py-2 border rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Category</label>
              <input type="text" value="Technology & Innovation" className="px-4 py-2 border rounded-lg w-full bg-gray-50" readOnly />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Description</label>
            <textarea 
              placeholder="Describe the club focus, target members, and planned activities."
              className="px-4 py-2 border rounded-lg w-full h-24"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Contact Email</label>
              <input type="email" placeholder="club@kfupm.edu.sa" className="px-4 py-2 border rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Assign President</label>
              <input type="text" placeholder="Search user or email" className="px-4 py-2 border rounded-lg w-full" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Logo Upload</label>
            <input type="text" placeholder="Upload club logo" className="px-4 py-2 border rounded-lg w-full" />
          </div>

          <div className="flex justify-end gap-4">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Reset</button>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Save Draft</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Publish Club</button>
          </div>
        </div>

        {/* Create President Account Section */}
        <div className="mx-8 mb-4 mt-8">
          <h2 className="text-xl font-semibold">Create President Account</h2>
          <span className="text-blue-600 text-sm ml-4">Provision secure leadership access</span>
        </div>

        <div className="mx-8 bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
            Invite a new club leader by creating their account, assigning them to a club, and triggering an onboarding email with temporary credentials.
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Full Name</label>
              <input type="text" placeholder="e.g., Latifah Al-Dossary" className="px-4 py-2 border rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">KFUPM ID</label>
              <input type="text" placeholder="Student/Staff ID" className="px-4 py-2 border rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">University Email</label>
              <input type="email" placeholder="username@kfupm.edu.sa" className="px-4 py-2 border rounded-lg w-full" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Phone Number</label>
              <input type="text" placeholder="05X-XXX-XXXX" className="px-4 py-2 border rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Role Start Date</label>
              <input type="text" className="px-4 py-2 border rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Assign Club</label>
              <input type="text" placeholder="Select existing club" className="px-4 py-2 border rounded-lg w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-600 mb-2">Temporary Password</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Generate secure code" className="px-4 py-2 border rounded-lg w-full" readOnly />
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Generate</button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            Share only through official KFUPM channels. The leader will be prompted to reset on first login.
          </div>

          <div className="flex justify-end gap-4">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Clear</button>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Save Draft</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send Invite</button>
          </div>
        </div>
      </div>
    </div>
  );
}
