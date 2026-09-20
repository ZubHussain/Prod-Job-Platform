import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import CandidateApplications from "./pages/CandidateApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import RecruiterApplications from "./pages/RecruiterApplications";
import Notifications from "./pages/Notifications";

function Protected({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/jobs" replace />;
  return children;
}

function RoutesView() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/applications" element={<Protected role="candidate"><CandidateApplications /></Protected>} />
        <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
        <Route path="/recruiter" element={<Protected role="recruiter"><RecruiterDashboard /></Protected>} />
        <Route path="/recruiter/jobs/new" element={<Protected role="recruiter"><PostJob /></Protected>} />
        <Route path="/recruiter/applications" element={<Protected role="recruiter"><RecruiterApplications /></Protected>} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default function App() {
  return <AuthProvider><RoutesView /></AuthProvider>;
}
