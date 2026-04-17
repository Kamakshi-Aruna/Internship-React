// =======================================================
//  NAVBAR — uses NavLink from React Router v6
// =======================================================
//
//  NavLink is like <a> but it knows if its route is active.
//  The `end` prop on "/" prevents it matching every route.
// =======================================================

import { NavLink } from "react-router-dom";

const links = [
  { to: "/",           label: "Dashboard",  end: true },
  { to: "/candidates", label: "Candidates"            },
  { to: "/jobs",       label: "Jobs"                  },
];

function Navbar() {
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Recruitly Demo</span>

      <div style={styles.links}>
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? "#6C3CE1" : "transparent",
              color:      isActive ? "#fff"    : "#333",
            })}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 24px",
    borderBottom: "1px solid #eee",
    background: "#fff",
  },
  brand: { fontWeight: 700, fontSize: 18, marginRight: "auto" },
  links: { display: "flex", gap: 8 },
  link:  { padding: "6px 14px", borderRadius: 6, textDecoration: "none", fontSize: 14 },
};

export default Navbar;