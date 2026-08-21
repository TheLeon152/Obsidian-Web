import {
  NavLink,
} from "react-router-dom";

import "./Navigation.css";


export function Navigation() {

  return (
    <nav
      className="main-navigation"
      aria-label="Main navigation"
    >

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `navigation-item ${
            isActive
              ? "navigation-item-active"
              : ""
          }`
        }
      >
        <span className="navigation-icon">
          📅
        </span>

        <span>
          Daily
        </span>
      </NavLink>


      <NavLink
        to="/tasks"
        end
        className={({ isActive }) =>
          `navigation-item ${
            isActive
              ? "navigation-item-active"
              : ""
          }`
        }
      >
        <span className="navigation-icon">
          ☑
        </span>

        <span>
          Tasks
        </span>
      </NavLink>


      <NavLink
        to="/inbox"
        end
        className={({ isActive }) =>
          `navigation-item ${
            isActive
              ? "navigation-item-active"
              : ""
          }`
        }
      >
        <span className="navigation-icon">
          📥
        </span>

        <span>
          Inbox
        </span>
      </NavLink>

    </nav>
  );
}