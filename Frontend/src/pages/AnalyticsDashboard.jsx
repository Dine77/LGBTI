import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Select from "react-select";
import {
  BarChartVerti,
  BarChartHori,
  DonutChart,
  PieChart,
} from "../components/Charts";
import React, { useEffect, useState } from "react";
import axios from "axios";

const defaultSelect = { value: "All", label: "All" };


const fetchOptions = async (col, filters = {}) => {
  try {
    const params = new URLSearchParams({ col, ...filters }).toString();
    const url = `/api/dash-options?${params}`;
    const res = await axios.get(url, { headers: { "Cache-Control": "no-cache" } });
    const arr = Array.isArray(res.data) ? res.data : [];
    const mapped = arr.map((v) =>
      typeof v === "object" ? v : { value: v, label: v }
    );
    return [defaultSelect, ...mapped];
  } catch (e) {
    console.warn("fetchOptions error", col, e);
    return [defaultSelect];
  }
};

export default function AnalyticsDashboard() {
  const [cityOptions, setCityOptions] = useState([defaultSelect]);
  const [areaOptions, setAreaOptions] = useState([defaultSelect]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([defaultSelect]);
  const [categoryOptions, setCategoryOptions] = useState([defaultSelect]);

  const [city, setCity] = useState(defaultSelect);
  const [area, setArea] = useState(defaultSelect);
  const [ageGroup, setAgeGroup] = useState(defaultSelect);
  const [category, setCategory] = useState(defaultSelect);
  const [section, setSection] = useState(defaultSelect);

  // ✅ Chart-related states
  const [questions, setQuestions] = useState([]);
  const [srChartData, setSRChartData] = useState({});
  const [mrChartData, setMRChartData] = useState({});
  const [loading, setLoading] = useState(false);

  // 👇 Scroll-to-top visibility
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Section dropdown (static)
  const sectionOptions = [
    { value: "All", label: "All" },
    { value: "Demographics and Household Characteristics", label: "Demographics and Household Characteristics" },
    { value: "Economic Status", label: "Economic Status" },
    { value: "Access to Financial Products", label: "Access to Financial Products" },
    { value: "Barriers in accessing financial services", label: "Barriers in accessing financial services" },
    { value: "Financial Abuse", label: "Financial Abuse" },
    { value: "Interaction with Fis", label: "Interaction with Fis" },
    { value: "Workplace discrimination", label: "Workplace discrimination" },
    { value: "Financial Inclusion program", label: "Financial Inclusion program" },
  ];

  const getFilters = () => ({
    District: city?.value || "All",
    T_Area: area?.value || "All",
    Category: category?.value || "All",
    B1_PostCode: ageGroup?.value || "All",
  });

  // 🔹 Load filter dropdowns on mount
  useEffect(() => {
    (async () => {
      const filters = getFilters();
      const [cityOpts, areaOpts, ageOpts, catOpts] = await Promise.all([
        fetchOptions("District", filters),
        fetchOptions("T_Area", filters),
        fetchOptions("B1_PostCode", filters),
        fetchOptions("Category", filters),
      ]);
      setCityOptions(cityOpts);
      setAreaOptions(areaOpts);
      setAgeGroupOptions(ageOpts);
      setCategoryOptions(catOpts);
    })();
  }, []);

  // 🔹 Handle dependent dropdowns dynamically
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const filters = getFilters();
      const [cityOpts, areaOpts, ageOpts, catOpts] = await Promise.all([
        fetchOptions("District", filters),
        fetchOptions("T_Area", filters),
        fetchOptions("B1_PostCode", filters),
        fetchOptions("Category", filters),
      ]);
      setCityOptions(cityOpts);
      setAreaOptions(areaOpts);
      setAgeGroupOptions(ageOpts);
      setCategoryOptions(catOpts);
    }, 500);
    return () => clearTimeout(timeout);
  }, [city, area, category, ageGroup]);

  // 🔹 Load all questions once
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/questions");
        setQuestions(res.data);
        await loadAllSectionsSequentially(res.data);
      } catch (err) {
        console.error("Error loading questions:", err);
      }
    })();
  }, []);

  // ✅ Sequential loader for both SR & MR
  const loadAllSectionsSequentially = async (allQuestions) => {
    setLoading(true);
    const sections = [...new Set(allQuestions.map((q) => q.section))];
    const srCollected = {};
    const mrCollected = {};

    for (const sec of sections) {
      try {
        console.log(`⏳ Fetching data for section: ${sec}`);
        const [srRes, mrRes] = await Promise.allSettled([
          axios.get(`/api/chart-data/sr?section=${encodeURIComponent(sec)}`),
          axios.get(`/api/chart-data/mr?section=${encodeURIComponent(sec)}`),
        ]);

        srCollected[sec] = srRes.value?.data || [];
        mrCollected[sec] = mrRes.value?.data || [];
      } catch (err) {
        console.error(`Error loading section ${sec}:`, err);
      }
    }

    setSRChartData(srCollected);
    setMRChartData(mrCollected);
    setLoading(false);
  };

  // 🔹 Load section data (SR + MR)
  const loadSectionCharts = async (sectionName) => {
    setLoading(true);
    try {
      if (sectionName === "All") {
        await loadAllSectionsSequentially(questions);
        return;
      }

      const [srRes, mrRes] = await Promise.allSettled([
        axios.get(`/api/chart-data/sr?section=${encodeURIComponent(sectionName)}`),
        axios.get(`/api/chart-data/mr?section=${encodeURIComponent(sectionName)}`),
      ]);

      setSRChartData({ [sectionName]: srRes.value?.data || [] });
      setMRChartData({ [sectionName]: mrRes.value?.data || [] });
    } catch (err) {
      console.error(`Error loading section ${sectionName}:`, err);
    }
    setLoading(false);
  };

  // 🔹 Merge SR + MR data
  const sectionData = section.value === "All"
    ? [...Object.values(srChartData).flat(), ...Object.values(mrChartData).flat()]
    : [
      ...(srChartData[section.value] || []),
      ...(mrChartData[section.value] || []),
    ];

  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      <section className="flex flex-col h-full w-full gap-2 items-center">
        {/* 🔹 Filters Row */}
        <div className="flex justify-center w-full items-center gap-4">
          {[
            { label: "Category", value: category, setter: setCategory, options: categoryOptions },
            { label: "City", value: city, setter: setCity, options: cityOptions },
            { label: "Type of Area", value: area, setter: setArea, options: areaOptions },
            { label: "Age Group", value: ageGroup, setter: setAgeGroup, options: ageGroupOptions },
            { label: "Section", value: section, setter: setSection, options: sectionOptions },
          ].map((item) => (
            <div key={item.label} className="w-[15%] text-center">
              <label className="text-lg font-medium text-[#2e469c]">{item.label}</label>
              <Select
                options={item.options}
                value={item.value}
                onChange={(val) => {
                  item.setter(val);
                  if (item.label === "Section") loadSectionCharts(val.value);
                }}
                styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
              />
            </div>
          ))}
        </div>

        {/* 🔹 Charts Grid */}
        {/* 🔹 Charts Grid */}
        <div className="h-[80vh] w-[99%] overflow-y-auto p-6 relative">
          {loading && (
            <div className="text-center text-gray-500 mt-10">Loading charts...</div>
          )}

          {!loading && sectionData.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              Select a section to view charts.
            </div>
          )}

          {!loading && sectionData.length > 0 && (
            <>
              {/* 🔹 Scroll-to-Top Button (Appears After Scroll) */}
              {showTopBtn && (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="fixed bottom-6 right-6 bg-[#2e469c] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#1d347a] transition-all duration-300"
                >
                  ↑ Top
                </button>
              )}

              {/* 🔹 Section-wise Chart Rendering */}
              <div className="flex flex-col gap-12">
                {[...new Set(sectionData.map((q) => q.section))]
                  .sort((a, b) => {
                    const secA = sectionData.find((q) => q.section === a)?.section_sort ?? 0;
                    const secB = sectionData.find((q) => q.section === b)?.section_sort ?? 0;
                    return secA - secB;
                  })
                  .map((sec) => {
                    const secQs = sectionData.filter((q) => q.section === sec);
                    return (
                      <div key={sec}>
                        <h2 className="text-2xl font-semibold text-[#2e469c] mb-4">
                          {sec}
                        </h2>
                        <div className="grid grid-cols-2 gap-10">
                          {secQs.map((q) => (
                            <div
                              key={q.group_name + q.question_text}
                              className="bg-white shadow rounded-lg p-4 h-[50vh]"
                            >
                              <div className="text-sm text-[#2e469c] pb-4">
                                {q.question_text}
                              </div>

                              {/* ✅ Auto choose chart type */}
                              {q.charttype?.toLowerCase().includes("pie") && (
                                <PieChart data={q.data} />
                              )}
                              {q.charttype?.toLowerCase().includes("donut") && (
                                <DonutChart data={q.data} />
                              )}
                              {q.charttype?.toLowerCase().includes("bar") && (
                                <BarChartVerti data={q.data} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
} 