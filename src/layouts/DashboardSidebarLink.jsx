import { NavLink } from "react-router";

const DashboardSidebarLink = ({ to, icon: Icon, children, end }) => {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
           ${
             isActive
               ? "bg-primary/40 text-secondary font-semibold border-l-4 border-primary"
               : "hover:bg-base-300"
           }`
        }
      >
        <Icon
          className={`text-lg transition-transform duration-200 ${
            location.pathname === to ? "scale-110" : ""
          }`}
        />
        {children}
      </NavLink>
    </li>
  );
};

export default DashboardSidebarLink;
