import { useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  const titleMap = {
    "/ResearchOverview": "Research Overview",
    "/ResearchProgress": "Research Progress",
    "/MapView": "Map View",
    "/Data": "Data",
    "/AnalyticsDashboard": "Analytics Dashboard",
  };

  return (
    <header className="relative row-start-1 row-end-1 col-start-2 col-end-[-1] flex justify-center items-center">
      <p className="text-[#2e469c] font-bold text-[1.875rem]">
        {titleMap[pathname] || "Dashboard"}
      </p>
      <img
        className="absolute right-3 top-3"
        src="/Images/Ipsos logo.png"
        alt="Ipsos Logo"
      />
    </header>
  );
}
