import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Select from "react-select";
import {
    BarChartVerti,
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

    const [questions, setQuestions] = useState([]);
    const [srChartData, setSRChartData] = useState({});
    const [mrChartData, setMRChartData] = useState({});
    const [overallBase, setOverallBase] = useState(0); // ✅ for section base
    const [loading, setLoading] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowTopBtn(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 📊 Section Tabs
    const sections = [
        "Demographics and Household Characteristics",
        "Economic Status",
        "Access to Financial Products",
        "Barriers in accessing financial services",
        "Financial Abuse",
        "Interaction with Fis",
        "Workplace discrimination",
        "Financial Inclusion program",
    ];
    const [activeSection, setActiveSection] = useState(sections[0]);

    const getFilters = () => ({
        District: city?.value || "All",
        T_Area: area?.value || "All",
        Category: category?.value || "All",
        B1_PostCode: ageGroup?.value || "All",
    });

    // 🔹 Load filter dropdowns once
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

    // 🔹 Load questions once, then section data
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get("/api/questions");
                setQuestions(res.data);
                await loadSectionCharts(activeSection);
            } catch (err) {
                console.error("Error loading questions:", err);
            }
        })();
    }, []);

    // ✅ Load SR + MR charts for active section (with filters)
    const loadSectionCharts = async (sectionName) => {
        setLoading(true);
        try {
            const filters = getFilters();
            const query = new URLSearchParams({ ...filters, section: sectionName }).toString();

            const [srRes, mrRes] = await Promise.allSettled([
                axios.get(`/api/chart-data/sr?${query}`),
                axios.get(`/api/chart-data/mr?${query}`),
            ]);

            // ✅ Backend now returns { overall_base, charts }
            const srData = srRes.value?.data || {};
            const mrData = mrRes.value?.data || {};

            setOverallBase(srData.overall_base || mrData.overall_base || 0);
            setSRChartData({ [sectionName]: srData.charts || [] });
            setMRChartData({ [sectionName]: mrData.charts || [] });
        } catch (err) {
            console.error(`Error loading section ${sectionName}:`, err);
        }
        setLoading(false);
    };

    // 🔁 React to filter changes dynamically
    useEffect(() => {
        if (questions.length > 0) {
            loadSectionCharts(activeSection);
        }
    }, [city, area, ageGroup, category, activeSection]);

    // Merge SR + MR
    const sectionData = [
        ...(srChartData[activeSection] || []),
        ...(mrChartData[activeSection] || []),
    ];

    return (
        <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
            <Header />
            <Sidebar />

            <section className="flex flex-col h-full w-full gap-2 items-center relative">
                {/* 🔹 Filters */}
                <div className="flex justify-center w-full items-center gap-4 mt-2">
                    {[
                        { label: "Category", value: category, setter: setCategory, options: categoryOptions },
                        { label: "City", value: city, setter: setCity, options: cityOptions },
                        { label: "Type of Area", value: area, setter: setArea, options: areaOptions },
                        { label: "Age Group", value: ageGroup, setter: setAgeGroup, options: ageGroupOptions },
                    ].map((item) => (
                        <div key={item.label} className="w-[15%] text-center">
                            <label className="text-lg font-medium text-[#2e469c]">{item.label}</label>
                            <Select
                                options={item.options}
                                value={item.value}
                                onChange={(val) => item.setter(val)}
                                styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
                            />
                        </div>
                    ))}

                    {/* ✅ Show Base */}
                    <div className="text-right text-lg text-gray-500 mb-3 pr-2 font-semibold absolute right-[10px] top-[35px]">
                        <span className="font-semibold text-[#2e469c]"></span>{'(n='}{overallBase}{')'}
                    </div>
                </div>

                {/* 🔹 Chart Display */}
                <div className="h-[75vh] w-[99%] overflow-y-auto p-6 relative">
                    {loading && <div className="text-center text-gray-500 mt-10">Loading charts...</div>}

                    {!loading && sectionData.length === 0 && (
                        <div className="text-center text-gray-400 mt-10">No charts found for this section.</div>
                    )}

                    {!loading && sectionData.length > 0 && (
                        <>

                            {showTopBtn && (
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                    className="fixed bottom-20 right-6 bg-[#2e469c] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#1d347a] transition-all duration-300"
                                >
                                    ↑ Top
                                </button>
                            )}

                            <div className="grid grid-cols-3 gap-2">
                                {sectionData.map((q) => (
                                    <div
                                        key={q.group_name + q.question_text}
                                        className="bg-white shadow rounded-lg p-4 h-[40vh]"
                                    >
                                        <div className="text-sm text-[#2e469c] pb-4">{q.question_text}</div>
                                        {q.charttype?.toLowerCase().includes("pie") && <PieChart data={q.data} />}
                                        {q.charttype?.toLowerCase().includes("donut") && <DonutChart data={q.data} />}
                                        {q.charttype?.toLowerCase().includes("bar") && <BarChartVerti data={q.data} />}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* 🔹 Gradient Footer Tabs — Sidebar Style */}
                <div className="fixed bottom-0 left-[9vw] w-[91vw] bg-gradient-to-r from-[#7B1FA2] via-[#E91E63] to-[#FF4081] shadow-[0_-3px_10px_rgba(0,0,0,0.3)] z-50">
                    <div className="flex items-center justify-center gap-5 overflow-x-auto px-5 py-2 scrollbar-hide">
                        {sections.map((sec, i) => (
                            <React.Fragment key={sec}>
                                <button
                                    onClick={() => setActiveSection(sec)}
                                    className={`relative text-[13px] font-semibold tracking-wide transition-all duration-300 ease-in-out transform
                                        ${activeSection === sec
                                            ? "text-white bg-[#2E469C] px-5 py-1.5 rounded-full border border-white -translate-y-[6px] shadow-[0_3px_10px_rgba(0,188,212,0.6)]"
                                            : "text-white hover:text-[#00E5FF] hover:-translate-y-[3px]"}`
                                    }
                                >
                                    {sec}
                                </button>

                                {i < sections.length - 1 && (
                                    <div className="h-4 w-[1px] bg-white/50"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
