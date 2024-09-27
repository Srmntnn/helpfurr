import React from "react";
import { Outlet, Link } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { ImUsers } from "react-icons/im";

function dashboardLayout() {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <div>
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              <RiDashboardFill />
            </label>
            <button className="btn rounded-full, px-6 sm:hidden">Logout</button>
          </div>
          <Outlet />
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <Link to="/dashboard">
                <RiDashboardFill />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/users">
                <ImUsers />
                All Users
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default dashboardLayout;
