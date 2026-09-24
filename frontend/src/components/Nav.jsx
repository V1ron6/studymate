import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, CalendarDays,
  TrendingUp, Search, LogOut, GraduationCap,
} from 'lucide-react';
import { NAV_ITEMS } from '../data/navConfig';
import { useAuth } from '../context/AuthContext';

const ICONS = { LayoutDashboard, BookOpen, ClipboardList, CalendarDays, TrendingUp, Search };

export default function Nav() {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><GraduationCap size={18} /></span>
        Study Mate
      </div>
      <nav className="side-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button className="logout-btn" onClick={logout}>
        <LogOut size={18} /> Log out
      </button>
    </aside>
  );
}
