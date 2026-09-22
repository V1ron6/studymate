import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../data/navConfig';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { logout } = useAuth();
  return (
    <nav className="nav">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
        >
          {item.label}
        </NavLink>
      ))}
      <button onClick={logout} style={{ marginLeft: 'auto' }}>Log out</button>
    </nav>
  );
}
