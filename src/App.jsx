import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  return (
    <ProtectedRoute fallback={<Login />}>
      <Dashboard />
    </ProtectedRoute>
  );
}
