import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashboardComponent from "../components/DashboardComponent";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "dash");
  }, [location.search]);
  return (
    <>
      {/*profile*/}
      {tab === "profile" && <DashProfile />}
      {/*Users*/}
      {tab === "users" && <DashUsers />}
      {/*DashboardComponent*/}
      {tab === "dash" && <DashboardComponent />}
    </>
  );
}
