import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate(); // ✅ must be inside component

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    {
      name: "Research Overview",
      to: "/ResearchOverview",
      icon: "/Images/NITI Aayog/inspection (1) 1.svg",
    },
    {
      name: "Research Progress",
      to: "/ResearchProgress",
      icon: "/Images/NITI Aayog/donut-chart 1.svg",
    },
    {
      name: "Map View",
      to: "/MapView",
      icon: "/Images/NITI Aayog/gis_world-map.svg",
    },
    { name: "Data", to: "/Data", icon: "/Images/NITI Aayog/table 1.svg" },
    {
      name: "Analytics Dashboard",
      to: "/AnalyticsDashboard",
      icon: "/Images/NITI Aayog/data-analysis 1.svg",
    },
  ];

  return (
    <nav className="relative row-start-1 row-end-[-1] col-start-1 col-end-2 bg-[#2e469c] rounded-tr-lg rounded-br-lg flex flex-col justify-end items-center gap-4">
      {/* Logo */}
      <div className="h-[15%] w-[210%] flex justify-center items-end gap-4">
        <div className="h-[80%] w-full flex flex-row gap-[0.625rem]">
          <div className="w-[100%] flex justify-center items-center flex-col bg-[#009d9c] rounded-md">
            <p className="font-bold text-white text-[1.15rem] text-center w-full pl-12">
              LGBTI
            </p>
            <p className="text-white text-[0.85rem] text-center w-full pl-12">
              Dashboard
            </p>
          </div>
          <div className="w-[20%] bg-[#009d9c] rounded-tl-lg rounded-bl-lg rounded-tr-[4rem] rounded-br-[4rem]" />
        </div>
      </div>

      {/* Navigation */}
      <div className="h-[75%] pt-2 flex justify-center items-center flex-col gap-[0.65rem]">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            className={({ isActive }) =>
              `w-[75%] flex justify-center items-center flex-col rounded-lg ${isActive ? "bg-[#009d9c]" : "bg-black/25 hover:bg-[#009d9c]"
              }`
            }
          >
            <span className="w-[100%] p-1 flex justify-center items-center">
              <img className="w-[45%]" src={item.icon} alt={item.name} />
            </span>
            <label className="w-[70%] text-[0.625rem] text-center p-1 text-white">
              {item.name}
            </label>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="relative h-[8%] flex justify-center items-center w-[70%] rounded-t-full">
        <div className="bg-black/25 w-full h-full rounded-tl-full rounded-tr-full blur-lg" />
        <a
          onClick={handleLogout}
          className="absolute bottom-0 flex justify-center items-center pb-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-84 31.5-156.5T197-763l56 56q-44 44-68.5 102T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-67-24.5-125T707-707l56-56q54 54 85.5 126.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-360v-440h80v440h-80Z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
