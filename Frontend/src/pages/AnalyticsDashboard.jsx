import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Select from "react-select";
import {
  BarChartVerti,
  BarChartHori,
  DonutChart,
  PieChart,
} from "../components/Charts";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";


const defaultSelect = [{ value: "All", label: "All" }];

const fetchOptions = async (col, filters = {}) => {
  try {
    const res = await axios.get(`/api/dash-options`, {
      params: { col, ...filters },
      headers: { "Cache-Control": "no-cache" },
    });

    const arr = Array.isArray(res.data) && res.data.length ? res.data : [];
    const mapped = arr.map((v) =>
      typeof v === "object" ? v : { value: v, label: v }
    );

    return [{ value: "All", label: "All" }, ...mapped];
  } catch (e) {
    console.warn("fetchOptions error", col, e);
    return [defaultSelect];
  }
};

export default function AnalyticsDashboard() {
  const [cityOptions, setCityOptions] = useState(defaultSelect);
  const [areaOptions, setAreaOptions] = useState(defaultSelect);
  const [ageGroupOptions, setAgeGroupOptions] = useState(defaultSelect);
  const [categoryOptions, setCategoryOptions] = useState(defaultSelect);

  const [city, setCity] = useState(defaultSelect[0]);
  const [area, setArea] = useState(defaultSelect[0]);
  const [ageGroup, setAgeGroup] = useState(defaultSelect[0]);
  const [category, setCategory] = useState(defaultSelect[0]);

  useEffect(() => {
    (async () => {
      const filters = { District: city?.value || "All" };
      const areaOpts = await fetchOptions("T_Area", filters);
      setAreaOptions(areaOpts);
    })();
  }, [city]);

  // 🔹 When Area changes → refresh City options
  useEffect(() => {
    (async () => {
      const filters = { T_Area: area?.value || "All" };
      const cityOpts = await fetchOptions("District", filters);
      setCityOptions(cityOpts);
    })();
  }, [area]);

  useEffect(() => {
    (async () => {
      const filters = { category: category?.value || "All" };
      const cityOpts = await fetchOptions("District", filters);
      setCityOptions(cityOpts);
    })();
  }, [category]);

  useEffect(() => {
    (async () => {
      const filters = { ageGroup: ageGroup?.value || "All" };
      const cityOpts = await fetchOptions("District", filters);
      setCityOptions(cityOpts);
    })();
  }, [ageGroup]);



  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      <section className="flex flex-col h-full w-full gap-2 items-center">
        <div className="flex justify-center w-full items-center gap-4">
          {/* City */}
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">City</label>
            <Select
              options={cityOptions}
              value={city}
              onChange={setCity}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>

          {/* Area */}
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">
              Type of Area
            </label>
            <Select
              options={areaOptions}
              value={area}
              onChange={setArea}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
          {/* City */}
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">Age Group</label>
            <Select
              options={ageGroupOptions}
              value={ageGroup}
              onChange={setAgeGroup}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>

          {/* Area */}
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
        </div>
        <div className="h-[80vh] w-[99%] overflow-y-auto grid grid-cols-2 gap-30 pt-10">
          <div className="h-[45vh]">
            <div className="text-sm text-[#2e469c] px-6 pb-4">How frequently do you use digital platforms for financial transactions?</div>
            <BarChartVerti />
          </div>
          <div className="h-[45vh]">
            <div className="text-sm text-[#2e469c] px-6 pb-4">Do you have access to any of the following?</div>
            <BarChartHori />
          </div>
          <div className="h-[45vh]">
            <div className="text-sm text-[#2e469c] px-6 pb-4">Which of the following best describes the sex you were assigned at birth?</div>
            <DonutChart />
          </div>
          <div className="h-[45vh]">
            <div className="text-sm text-[#2e469c] px-6 pb-4">Which of the following best describes your sexual orientation?</div>
            <PieChart />
          </div>
        </div>
      </section>
    </main>
  );
}
