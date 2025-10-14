import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

/*
  ResearchProgress.jsx
  - Converted from ResearchProgress.html
  - Uses echarts-for-react for gauge charts (same visual as original)
  - react-select for dropdowns
  - Quant / Qual toggle implemented as pill buttons (no checkbox)
  - Place static images into /public/Images/ (same names as original)
  - Replace API endpoints below with your Express backend routes
*/

const defaultSelect = [{ value: "All", label: "All" }];

const fetchOptions = async (col) => {
  // replace with: /api/options?col=sector etc.
  try {
    const res = await axios.get(`/api/options?col=${col}`);
    const arr = Array.isArray(res.data) && res.data.length ? res.data : ["All"];
    return [
      ...arr.map((v) => ({ value: v, label: v })),
    ];
  } catch (e) {
    console.warn("fetchOptions error", col, e);
    return defaultSelect;
  }
};

const fetchQuantData = async (params) => {
  // expected response shape (example):
  // { overview: {target, completed}, water: {...}, forest: {...}, tableState: [...] }
  try {
    const res = await axios.get("/api/research-progress", { params });
    return res.data;
  } catch (e) {
    console.warn("fetchQuantData error", e);
    // fallback to empty shape
    return {
      overview: { target: 0, completed: 0 },
      water: { target: 0, completed: 0 },
      forest: { target: 0, completed: 0 },
      tableState: [],
    };
  }
};

const fetchQualData = async (params) => {
  // expected: { kll: {target, completed, rows: [...]}, fgd: {target, completed, rows: [...]} }
  try {
    const res = await axios.get("/api/research-progress-qual", { params });
    return res.data;
  } catch (e) {
    console.warn("fetchQualData error", e);
    return {
      kll: { target: 0, completed: 0, rows: [] },
      fgd: { target: 0, completed: 0, rows: [] },
    };
  }
};

const gaugeOption = (
  value,
  color,
  radius = "140%",
  center = ["50%", "80%"],
  label = ""
) => ({
  title: { show: false },
  toolbox: {
    show: true,
    feature: { saveAsImage: {} },
    iconStyle: { borderWidth: 2.5 },
  },
  grid: { left: "1%", right: "4%", bottom: "3%", containLabel: true },
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      radius,
      center,
      pointer: { show: false },
      progress: { show: true, width: 30 },
      axisLine: { lineStyle: { width: 30, color: [[1, color]] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 16,
        formatter: "{value}%",
        color: "#000",
        offsetCenter: ["0%", "-5%"],
      },
      data: [
        { value: Math.max(0, Math.min(100, Number(value) || 0)), name: label },
      ],
    },
  ],
});

const downloadCsv = (rows, filename = "table.csv") => {
  if (!rows || rows.length === 0) {
    alert("No data to download");
    return;
  }
  // rows: array of arrays or objects
  let csv = "";
  const first = rows[0];
  if (Array.isArray(first)) {
    // assume first row contains headers already
    rows.forEach((r) => {
      csv +=
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",") + "\n";
    });
  } else {
    // objects: build header from keys
    const keys = Object.keys(first);
    csv += keys.join(",") + "\n";
    rows.forEach((r) => {
      csv +=
        keys
          .map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`)
          .join(",") + "\n";
    });
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export default function ResearchProgress() {
  // select options
  const [sectorOptions, setSectorOptions] = useState(defaultSelect);
  const [stateOptions, setStateOptions] = useState(defaultSelect);
  const [schemeOptions, setSchemeOptions] = useState(defaultSelect);

  // selections
  const [sector, setSector] = useState(defaultSelect[0]);
  const [stateSel, setStateSel] = useState(defaultSelect[0]);
  const [scheme, setScheme] = useState(defaultSelect[0]);

  // mode: "quant" | "qual"
  const [mode, setMode] = useState("quant");

  // quant data
  const [overview, setOverview] = useState({ target: 0, completed: 0 });
  const [water, setWater] = useState({ target: 0, completed: 0 });
  const [forest, setForest] = useState({ target: 0, completed: 0 });
  const [stateTable, setStateTable] = useState([]);

  // qual data
  const [qualKll, setQualKll] = useState({ target: 0, completed: 0, rows: [] });
  const [qualFgd, setQualFgd] = useState({ target: 0, completed: 0, rows: [] });

  // fetch select options once
  useEffect(() => {
    (async () => {
      setSectorOptions(await fetchOptions("sector"));
      setStateOptions(await fetchOptions("state"));
      setSchemeOptions(await fetchOptions("scheme"));
    })();
  }, []);

  // fetch data whenever filters or mode change
  useEffect(() => {
    const params = {
      sector: sector.value,
      state: stateSel.value,
      scheme: scheme.value,
    };

    const load = async () => {
      if (mode === "quant") {
        const data = await fetchQuantData(params);
        // map fields defensively
        setOverview(data.overview || { target: 0, completed: 0 });
        setWater(data.water || { target: 0, completed: 0 });
        setForest(data.forest || { target: 0, completed: 0 });
        setStateTable(Array.isArray(data.tableState) ? data.tableState : []);
      } else {
        const data = await fetchQualData(params);
        setQualKll(data.kll || { target: 0, completed: 0, rows: [] });
        setQualFgd(data.fgd || { target: 0, completed: 0, rows: [] });
      }
    };

    load();
  }, [sector, stateSel, scheme, mode]);

  // Table render helpers (state table)
  const renderStateRows = () => {
    if (!stateTable.length) {
      return (
        <tr>
          <td className="px-3 py-2 text-center" colSpan={5}>
            No data
          </td>
        </tr>
      );
    }
    return stateTable.map((r, i) => {
      // r expected: { scheme, state, target, completed, percentage }
      return (
        <tr key={i} className="state-row">
          <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9]">
            {r.scheme}
          </td>
          <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9]">
            {r.state}
          </td>
          <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9] text-center">
            {r.target ?? 0}
          </td>
          <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9] text-center">
            {r.completed ?? 0}
          </td>
          <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9] text-center">
            {r.percentage ??
              `${Math.round(((r.completed || 0) / (r.target || 1)) * 100)}%`}
          </td>
        </tr>
      );
    });
  };

  // Qual table renderers
  const renderQualRows = (rows) => {
    if (!rows || rows.length === 0) {
      return (
        <tr>
          <td className="px-3 py-2 text-center" colSpan={5}>
            No data
          </td>
        </tr>
      );
    }
    return rows.map((r, i) => (
      <tr key={i}>
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9]">
          {r.scheme}
        </td>
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9]">
          {r.state}
        </td>
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9] text-center">
          {r.target ?? 0}
        </td>
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9] text-center">
          {r.completed ?? 0}
        </td>
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9] text-center">
          {r.percentage ??
            `${Math.round(((r.completed || 0) / (r.target || 1)) * 100)}%`}
        </td>
      </tr>
    ));
  };

  // download handlers
  const onDownloadState = () => {
    // convert stateTable to objects array for CSV
    downloadCsv(stateTable, "State.csv");
  };
  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      {/* Main content */}
      <section className="grid grid-cols-1 grid-rows-[12%_88%]">
        {/* Filters row */}
        <div className="row-start-1 row-end-2 col-start-1 col-end-[-1] flex justify-center items-center flex-row gap-3">
          <div className="w-1/6 text-center p-2">
            <label className="text-lg font-medium text-[#2e469c]">Region</label>
            <Select
              options={sectorOptions}
              value={sector}
              onChange={setSector}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
          <div className="w-1/6 text-center">
            <label className="text-lg font-medium text-[#2e469c]">Age</label>
            <Select
              options={stateOptions}
              value={stateSel}
              onChange={setStateSel}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
          <div className="w-1/6 text-center">
            <label className="text-lg font-medium text-[#2e469c]">
              Gender
            </label>
            <Select
              options={schemeOptions}
              value={scheme}
              onChange={setScheme}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
          <div className="w-1/6 text-center">
            <label className="text-lg font-medium text-[#2e469c]">
              Sub Groups
            </label>
            <Select
              options={schemeOptions}
              value={scheme}
              onChange={setScheme}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="row-start-2 row-end-[-1] col-start-1 col-end-[-1]">
          {/* Quant layout */}
          {mode === "quant" ? (
            <div className="w-full h-full grid grid-cols-[5%_90%] grid-rows-[15%_70%]">
              {/* State table on right */}
              <div className="row-start-1 row-end-[-1] col-start-2 col-end-[-1] flex justify-evenly items-center flex-col">
                <div className="w-[100%] text-[#767676] flex justify-between gap-2 items-center text-lg text-center font-semibold h-[10%]">
                  <div>State - wise completion count</div>
                  <div className="flex gap-4">
                    <div className="flex items-center justify-between rounded-lg bg-neutral-200 shadow-[0_5px_10px_rgba(0,0,0,0.1)]">
                      <div className="px-4" onClick={() => onDownloadState()}>
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="cursor-pointer"
                        />
                      </div>
                      <div
                        className="py-1 m-1 px-3 bg-[#2E469C] text-white rounded-lg cursor-pointer text-sm"
                        onClick={() => onDownloadState()}
                      >
                        State
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col justify-start items-center w-[97%] h-[82%] overflow-y-scroll scrollbar-width-thin shadow-md rounded-lg">
                  <div className="w-full" id="wrapper">
                    <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs w-full text-gray-700 bg-[#009d9c] sticky top-0">
                        <tr className="bg-white">
                          <th scope="col" className="w-[16.6%]">
                            <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9] rounded-tl-lg rounded-tr-[2rem]">
                              Region
                            </div>
                          </th>
                          <th scope="col" className="w-[16.6%]">
                            <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9]  rounded-tl-lg rounded-tr-[2rem]">
                              State
                            </div>
                          </th>
                          <th scope="col" className="w-[16.6%]">
                            <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9]  rounded-tl-lg rounded-tr-[2rem]">
                              District
                            </div>
                          </th>
                          <th scope="col" className="w-[16.6%]">
                            <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9]  rounded-tl-lg rounded-tr-[2rem]">
                              Target
                            </div>
                          </th>
                          <th scope="col" className="w-[16.6%]">
                            <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9]  rounded-tl-lg rounded-tr-[2rem]">
                              Completed
                            </div>
                          </th>
                          <th scope="col" className="w-[16.6%]">
                            <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9]  rounded-tl-lg rounded-tr-[2rem]">
                              % of Completion
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody id="tableBody">{renderStateRows()}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Qual layout
            <div className="w-full h-full grid grid-cols-[50%_50%] grid-rows-1 mt-2">
              {/* KII */}
              <div className="row-start-1 row-end-3 col-start-1 col-end-2 flex flex-col justify-evenly items-center">
                <div className="w-full text-center mt-2">Qualitative-KII</div>

                <div className="flex items-center rounded-lg p-2 mt-1">
                  <div className="p-1">Overall</div>
                  <div className="p-1">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[#009D9C]"
                    />
                    {/* <i className="fas fa-arrow-right text-[#009D9C]"></i> */}
                  </div>
                  <div className="m-2 p-2 text-center bg-[#2E469C] text-white rounded-lg w-[8rem]">
                    <div>Target</div>
                    <div>
                      <span id="target_kll_cnt">{qualKll.target}</span>
                    </div>
                  </div>
                  <div className="m-2 p-2 text-center bg-[#009D9C] text-white rounded-lg w-[8rem]">
                    <div>Completed</div>
                    <div>
                      <span id="completed_kll_cnt">{qualKll.completed}</span> (
                      <span id="completed_kll_per">
                        {qualKll.target
                          ? `${Math.round(
                            (qualKll.completed / qualKll.target) * 100
                          )}%`
                          : "0%"}
                      </span>
                      )
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-end">
                  {/* <button
                    className="download-btn cursor-pointer mr-10 mb-2"
                    onClick={onDownloadKll}
                  >
                    Download
                  </button> */}
                  <FontAwesomeIcon
                    icon={faDownload}
                    className="download-btn cursor-pointer mr-10 mb-2 text-[#2E469C]"
                    onClick={onDownloadKll}
                  />
                </div>

                <div className="relative flex flex-col justify-start items-center w-[90%] h-[90%] overflow-y-scroll scrollbar-width-thin shadow-md rounded-lg">
                  <div className="w-full">
                    <table
                      className="w-full text-sm text-left text-gray-500"
                      id="Qual_KII_Table_Outer"
                    >
                      <thead className="text-xs w-full bg-transparent text-gray-700 sticky top-0">
                        <tr className="bg-white">
                          <th className="w-[30%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Scheme Name
                            </div>
                          </th>
                          <th className="w-[30%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              State Name
                            </div>
                          </th>
                          <th className="w-[13.3%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Target
                            </div>
                          </th>
                          <th className="w-[13.3%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Completed
                            </div>
                          </th>
                          <th className="w-[13.3%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Percentage
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody id="qual_kll_tbl">
                        {renderQualRows(qualKll.rows)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* FGD */}
              <div className="row-start-1 row-end-3 col-start-2 col-end-3 flex flex-col justify-evenly items-center">
                <div className="w-full text-center mt-2">Qualitative-FGD</div>

                <div className="flex items-center rounded-lg p-2 mt-1">
                  <div className="p-1">Overall</div>
                  <div className="p-1">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[#009D9C]"
                    />
                    {/* <i className="fas fa-arrow-right text-[#009D9C]"></i> */}
                  </div>
                  <div className="m-2 p-2 text-center bg-[#2E469C] text-white rounded-lg w-[8rem]">
                    <div>Target</div>
                    <div id="qual_target">{qualFgd.target}</div>
                  </div>
                  <div className="m-2 p-2 text-center bg-[#009D9C] text-white rounded-lg w-[8rem]">
                    <div>Completed</div>
                    <div>
                      <span id="qual_completed">{qualFgd.completed}</span> (
                      <span id="completed_per">
                        {qualFgd.target
                          ? `${Math.round(
                            (qualFgd.completed / qualFgd.target) * 100
                          )}%`
                          : "0%"}
                      </span>
                      )
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-end">
                  {/* <button
                    className="download-btn cursor-pointer mr-10 mb-2"
                    onClick={onDownloadFgd}
                  >
                    Download
                  </button> */}
                  <FontAwesomeIcon
                    icon={faDownload}
                    className="download-btn cursor-pointer mr-10 mb-2  text-[#2E469C]"
                    onClick={onDownloadFgd}
                  />
                </div>

                <div className="relative flex flex-col justify-start items-center w-[90%] h-[90%] overflow-y-scroll scrollbar-width-thin shadow-md rounded-lg">
                  <div className="w-full">
                    <table
                      className="w-full text-sm text-left text-gray-500"
                      id="Qual_FGD_Table_Outer"
                    >
                      <thead className="text-xs w-full text-gray-700 bg-[#009D9C] sticky top-0">
                        <tr className="bg-white">
                          <th className="w-[30%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Scheme Name
                            </div>
                          </th>
                          <th className="w-[30%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              State Name
                            </div>
                          </th>
                          <th className="w-[13.3%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Target
                            </div>
                          </th>
                          <th className="w-[13.3%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Completed
                            </div>
                          </th>
                          <th className="w-[13.3%]">
                            <div className="px-2 py-4 text-white border-2 bg-[#009D9C] border-[#A9BAD9] rounded-tl-lg rounded-tr-[2rem]">
                              Percentage
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody id="qual_fgd_tbl">
                        {renderQualRows(qualFgd.rows)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
