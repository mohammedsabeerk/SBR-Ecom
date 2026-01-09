import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login", { replace: true });
  };

  const linkClasses = ({ isActive }) =>
    `
    flex items-center gap-4 p-2 rounded-md text-sm
    transition-colors duration-200
    ${
      isActive
        ? "bg-[#2f2926] text-white"
        : "text-black hover:bg-[#2f2926] hover:text-white"
    }
  `;

  return (
    <aside
      className="
        peer group
        fixed top-0 left-0 h-screen
        
        bg-[#F5F5DC]
        w-16 hover:w-64
        transition-all duration-300
        overflow-hidden
        z-50
      "
    >
      <nav className="flex flex-col pt-20 px-3 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClasses}>
          <FaTachometerAlt className="text-lg min-w-[20px]" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Dashboard
          </span>
        </NavLink>

        <NavLink to="/admin/orders" className={linkClasses}>
          <FaShoppingCart className="text-lg min-w-[20px]" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Order Management
          </span>
        </NavLink>

        <NavLink to="/admin/product" className={linkClasses}>
          <FaBoxOpen className="text-lg min-w-[20px]" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Product Management
          </span>
        </NavLink>

        <NavLink to="/admin/user" className={linkClasses}>
          <FaUsers className="text-lg min-w-[20px]" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            User Management
          </span>
        </NavLink>
      </nav>

      <div className="absolute bottom-6 w-full px-3">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-4 p-2 rounded-md text-sm
            text-black hover:bg-black hover:text-white
            transition-colors duration-200
          "
        >
          <FaSignOutAlt className="text-lg min-w-[20px]" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
