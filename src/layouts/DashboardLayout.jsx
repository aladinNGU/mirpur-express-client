import { Outlet } from "react-router";
import MirpurExpressLogo from "../pages/shared/MirpurExpressLogo/MirpurExpressLogo";
import DashboardSidebarLink from "./DashboardSidebarLink";

import {
  HiHome,
  HiArchive,
  HiCreditCard,
  HiLocationMarker,
  HiUser,
  HiUserGroup,
  HiClock,
  HiShieldCheck,
  HiUserAdd,
} from "react-icons/hi";
import { FaCheckCircle, FaMotorcycle, FaTasks } from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  console.log(role);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 space-y-1">
          {/* Sidebar content here */}
          <MirpurExpressLogo></MirpurExpressLogo>
          <br />
          <DashboardSidebarLink to="" icon={HiHome} end>
            Home
          </DashboardSidebarLink>

          <DashboardSidebarLink to="MyParcel" icon={HiArchive}>
            My Parcels
          </DashboardSidebarLink>

          <DashboardSidebarLink to="paymentHistory" icon={HiCreditCard}>
            Payment History
          </DashboardSidebarLink>
          {/* Rider links */}
          {!roleLoading && role === "rider" && (
            <>
              <DashboardSidebarLink to="pendingDeliveries" icon={FaTasks}>
                Pending Deliveries
              </DashboardSidebarLink>
              <DashboardSidebarLink
                to="completedDeliveries"
                icon={FaCheckCircle}
              >
                Completed Deliveries
              </DashboardSidebarLink>
            </>
          )}
          {/* Admin links */}
          {!roleLoading && role === "admin" && (
            <>
              <DashboardSidebarLink to="activeRiders" icon={HiUserGroup}>
                Active Riders
              </DashboardSidebarLink>

              <DashboardSidebarLink to="pendingRiders" icon={HiClock}>
                Pending Riders
              </DashboardSidebarLink>

              <DashboardSidebarLink to="manageAdmin" icon={HiShieldCheck}>
                Manage Admin
              </DashboardSidebarLink>
              <DashboardSidebarLink to="assignRider" icon={FaMotorcycle}>
                Assign Rider
              </DashboardSidebarLink>
            </>
          )}

          <DashboardSidebarLink to="track" icon={HiLocationMarker}>
            Track a Parcel
          </DashboardSidebarLink>

          <DashboardSidebarLink to="profile" icon={HiUser}>
            Update Profile
          </DashboardSidebarLink>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
