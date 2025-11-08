import NavigationBar from '../components/NavigationBar.jsx';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <NavigationBar active = "/admin" hidden = {["/",'/clubs', '/events', '/posts', '/profile', '/my-clubs']} />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      </div>
    </div>
  );
}
