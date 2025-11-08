import NavigationBar from "../components/NavigationBar.jsx";

export default function PresidentPage() {
  return <><NavigationBar active="/" hidden={["/admin",'/clubs', '/events', '/posts', '/profile', '/my-clubs', "/user-management"]} /></>;
}
