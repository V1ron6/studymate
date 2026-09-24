import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Nav from './components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Timetable from './pages/Timetable';
import Progress from './pages/Progress';
import Research from './pages/Research';

function PrivateLayout({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="empty" style={{ margin: 40 }}>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app-shell">
      <Nav />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
      <Route path="/courses" element={<PrivateLayout><Courses /></PrivateLayout>} />
      <Route path="/assignments" element={<PrivateLayout><Assignments /></PrivateLayout>} />
      <Route path="/timetable" element={<PrivateLayout><Timetable /></PrivateLayout>} />
      <Route path="/progress" element={<PrivateLayout><Progress /></PrivateLayout>} />
      <Route path="/research" element={<PrivateLayout><Research /></PrivateLayout>} />
    </Routes>
  );
}
