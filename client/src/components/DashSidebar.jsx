import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiChartPie,
  HiChevronDown,
  HiUser,
} from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { FiLogOut, FiSidebar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

function SidebarLink({ active, children, collapsed, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className={`flex items-center rounded-lg text-sm font-medium duration-150 ${
        collapsed ? "h-11 justify-center p-0" : "gap-3 p-2"
      } ${
        active
          ? "bg-cyan-50 text-[#159ab3]"
          : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
      }`}
      title={collapsed ? children : undefined}
    >
      <Icon
        className={`h-5 w-5 shrink-0 ${
          active ? "text-[#159ab3]" : "text-gray-500"
        }`}
      />
      {!collapsed && children}
    </Link>
  );
}

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const profileMenuRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuActive, setIsProfileMenuActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "dash");
  }, [location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    setSearchTerm(searchTermFromUrl || "");
  }, [location.search]);

  useEffect(() => {
    const handleProfileMenu = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuActive(false);
      }
    };

    document.addEventListener("click", handleProfileMenu);
    return () => document.removeEventListener("click", handleProfileMenu);
  }, []);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      navigate("/search");
      return;
    }

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", trimmedSearchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <aside
      className={`h-full w-full border-r border-gray-200 bg-white transition-all duration-200 md:min-h-screen ${
        isCollapsed ? "md:w-20" : "md:w-80"
      }`}
    >
      <div className={`flex h-full flex-col ${isCollapsed ? "px-3" : "px-4"}`}>
        <div className="flex h-20 items-center">
          <div
            className={`flex w-full items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <img
              src={currentUser?.profilePicture}
              className={`rounded-full object-cover ${
                isCollapsed ? "hidden" : "h-10 w-10"
              }`}
              alt="User avatar"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-800">
                  {currentUser?.username}
                </span>
                <span className="block truncate text-xs text-gray-500">
                  {currentUser?.isAdmin ? "Admin" : "User"} Account
                </span>
              </div>
            )}

            {!isCollapsed && (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => setIsProfileMenuActive((value) => !value)}
                  aria-expanded={isProfileMenuActive}
                  aria-haspopup="menu"
                >
                  <HiChevronDown
                    className={`h-5 w-5 duration-150 ${
                      isProfileMenuActive ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileMenuActive && (
                  <div
                    className="absolute right-0 top-11 z-10 w-64 rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-600 shadow-lg"
                    role="menu"
                  >
                    <span className="block truncate p-2 text-gray-500">
                      {currentUser?.email}
                    </span>
                    <Link
                      to="/dashboard?tab=profile"
                      className="block rounded-md p-2 hover:bg-gray-50 active:bg-gray-100"
                      onClick={() => setIsProfileMenuActive(false)}
                      role="menuitem"
                    >
                      View profile
                    </Link>
                    <button
                      type="button"
                      className="block w-full rounded-md p-2 text-left hover:bg-gray-50 active:bg-gray-100"
                      onClick={handleSignout}
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 duration-150 hover:bg-gray-50 active:bg-gray-100"
              onClick={() => setIsCollapsed((value) => !value)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <FiSidebar className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <form className="mb-4" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="sidebar-search">
              Search
            </label>
            <div className="relative">
              <AiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="sidebar-search"
                type="text"
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-[#2cb8d4] focus:ring-2 focus:ring-cyan-100"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </form>
        )}

        <nav className="flex-1 overflow-auto pb-4">
          <ul className="space-y-1">
            {currentUser?.isAdmin && (
              <li>
                <SidebarLink
                  active={tab === "dash"}
                  collapsed={isCollapsed}
                  icon={HiChartPie}
                  to="/dashboard?tab=dash"
                >
                  Dashboard
                </SidebarLink>
              </li>
            )}

            <li>
              <SidebarLink
                active={tab === "profile"}
                collapsed={isCollapsed}
                icon={HiUser}
                to="/dashboard?tab=profile"
              >
                Profile
              </SidebarLink>
            </li>
          </ul>

        </nav>

        <div className="border-t border-gray-200 py-4">
          <button
            type="button"
            className={`flex w-full items-center justify-center rounded-lg p-2 text-sm font-semibold duration-150 ${
              isCollapsed
                ? "h-11 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200"
                : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
            }`}
            onClick={handleSignout}
            aria-label="Logout"
          >
            {isCollapsed ? <FiLogOut className="h-5 w-5" /> : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}
