import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

const defaultSelect = [{ value: "All", label: "All" }];

// 🔄 Always fetch fresh data when dropdown opens
const fetchOptions = async (col, filters = {}) => {
  try {
    const res = await axios.get(`/api/options`, {
      params: { col, ...filters },
      headers: { "Cache-Control": "no-cache" },
    });

    // If your backend returns [{value, label}] already, just use res.data
    const arr = Array.isArray(res.data) && res.data.length ? res.data : [];
    // If backend returns plain values (["1","2"]), map them:
    const mapped = arr.map((v) =>
      typeof v === "object" ? v : { value: v, label: v }
    );

    // Add “All” at top
    return [{ value: "All", label: "All" }, ...mapped];
  } catch (e) {
    console.warn("fetchOptions error", col, e);
    return [defaultSelect];
  }
};

const fetchQuantData = async (params) => {
  try {
    const res = await axios.get("/api/surveys", {
      params: {
        region: params.region || "All",
        age: params.age || "All",
        gender: params.gender || "All",
        subgroup: params.subgroup || "All",
      },
    });

    // ✅ Map new backend structure
    const rows = (res.data.rows || []).map((r) => ({
      region: r.Region || "",
      state: r.State || "",
      district: r.District || "",
      target: r.Target || 0,
      completed: r.Completed || 0,
      percentage: `${r.Percentage ?? 0}%`,
    }));

    // ✅ Compute overview totals
    const totalTarget = rows.reduce((sum, row) => sum + (row.target || 0), 0);
    const totalCompleted = rows.reduce((sum, row) => sum + (row.completed || 0), 0);

    return {
      overview: { target: totalTarget, completed: totalCompleted },
      tableState: rows,
    };
  } catch (e) {
    console.warn("fetchQuantData error", e);
    return {
      overview: { target: 0, completed: 0 },
      tableState: [],
    };
  }
};


const downloadExcel = (rows, filename = "State_Data.xlsx") => {
  if (!rows || rows.length === 0) {
    alert("No data to download");
    return;
  }

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Save as Excel file
  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, filename);
};


export default function ResearchProgress() {
  const [regionOptions, setRegionOptions] = useState(defaultSelect);
  const [ageOptions, setAgeOptions] = useState(defaultSelect);
  const [genderOptions, setGenderOptions] = useState(defaultSelect);
  const [subGroupOptions, setSubGroupOptions] = useState(defaultSelect);

  const [region, setRegion] = useState(defaultSelect[0]);
  const [age, setAge] = useState(defaultSelect[0]);
  const [gender, setGender] = useState(defaultSelect[0]);
  const [subgroup, setSubgroup] = useState(defaultSelect[0]);

  const [mode, setMode] = useState("quant");

  const [stateTable, setStateTable] = useState([]);

  // 🔄 Fetch dropdown data each time user opens it
  const onRegionOpen = async () => {
    const filters = {
      B1_PostCode: age?.value || "All",
      B4: gender?.value || "All",
      B3: subgroup?.value || "All",
    };
    setRegionOptions(await fetchOptions("zone", filters));
  };

  const onAgeOpen = async () => {
    const filters = {
      zone: region?.value || "All",
      B4: gender?.value || "All",
      B3: subgroup?.value || "All",
    };
    setAgeOptions(await fetchOptions("B1_PostCode", filters));
  };

  const onGenderOpen = async () => {
    const filters = {
      zone: region?.value || "All",
      B1_PostCode: age?.value || "All",
      B3: subgroup?.value || "All",
    };
    setGenderOptions(await fetchOptions("B4", filters));
  };

  const onSubgroupOpen = async () => {
    const filters = {
      zone: region?.value || "All",
      B1_PostCode: age?.value || "All",
      B4: gender?.value || "All",
    };
    setSubGroupOptions(await fetchOptions("B3", filters));
  };



  useEffect(() => {
    const params = {
      region: region?.value || "All",
      age: age?.value || "All",
      gender: gender?.value || "All",
      subgroup: subgroup?.value || "All",
    };

    fetchQuantData(params).then((data) => {
      setStateTable(data.tableState || []);
    });
  }, [region, age, gender, subgroup]);



  const renderStateRows = () => {
    if (!stateTable.length) {
      return (
        <tr>
          <td className="px-3 py-2 text-center" colSpan={6}>
            No data
          </td>
        </tr>
      );
    }

    return stateTable.map((r, i) => (
      <tr key={i} className="state-row">
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9]">
          {r.region}
        </td>
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9]">
          {r.state}
        </td>
        <td className="px-3 py-2 font-semibold border-2 border-[#a9bad9]">
          {r.district}
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

  const onDownloadState = () => downloadExcel(stateTable, "State_Data.xlsx");

  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      <section className="grid grid-cols-1 grid-rows-[12%_88%]">
        <div className="row-start-1 row-end-2 col-start-1 col-end-[-1] flex justify-center items-center flex-row gap-3">
          <div className="w-1/6 text-center p-2">
            <label className="text-lg font-medium text-[#2e469c]">Region</label>
            <Select
              options={regionOptions}
              value={region}
              onChange={setRegion}
              onMenuOpen={onRegionOpen} // 🔄 triggers API
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>

          <div className="w-1/6 text-center">
            <label className="text-lg font-medium text-[#2e469c]">Age</label>
            <Select
              options={ageOptions}
              value={age}
              onChange={setAge}
              onMenuOpen={onAgeOpen} // 🔄 triggers API
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>

          <div className="w-1/6 text-center">
            <label className="text-lg font-medium text-[#2e469c]">Gender</label>
            <Select
              options={genderOptions}
              value={gender}
              onChange={setGender}
              onMenuOpen={onGenderOpen} // 🔄 triggers API
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>

          <div className="w-1/6 text-center">
            <label className="text-lg font-medium text-[#2e469c]">
              Sub Groups
            </label>
            <Select
              options={subGroupOptions}
              value={subgroup}
              onChange={setSubgroup}
              onMenuOpen={onSubgroupOpen} // 🔄 triggers API
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
        </div>

        <div className="row-start-2 row-end-[-1] col-start-1 col-end-[-1]">
          <div className="w-full h-full grid grid-cols-[5%_90%] grid-rows-[15%_70%]">
            <div className="row-start-1 row-end-[-1] col-start-2 col-end-[-1] flex justify-evenly items-center flex-col">
              <div className="w-full text-[#767676] flex justify-between items-center text-lg text-center font-semibold h-[10%]">
                <div>State - wise completion count</div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-between rounded-lg bg-neutral-200 shadow-md">
                    <div className="px-4" onClick={onDownloadState}>
                      <FontAwesomeIcon icon={faDownload} className="cursor-pointer" />
                    </div>
                    <div
                      className="py-1 m-1 px-3 bg-[#2E469C] text-white rounded-lg cursor-pointer text-sm"
                      onClick={onDownloadState}
                    >
                      State
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col justify-start items-center w-[97%] h-[82%] overflow-y-scroll scrollbar-width-thin shadow-md rounded-lg">
                <div className="w-full">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs w-full text-gray-700 bg-[#009d9c] sticky top-0">
                      <tr className="bg-white">
                        <th className="w-[16.6%]">
                          <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9] rounded-tl-lg rounded-tr-[2rem]">
                            Region
                          </div>
                        </th>
                        <th className="w-[16.6%]">
                          <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9] rounded-tl-lg rounded-tr-[2rem]">
                            State
                          </div>
                        </th>
                        <th className="w-[16.6%]">
                          <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9] rounded-tl-lg rounded-tr-[2rem]">
                            District
                          </div>
                        </th>
                        <th className="w-[16.6%]">
                          <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9] rounded-tl-lg rounded-tr-[2rem]">
                            Target
                          </div>
                        </th>
                        <th className="w-[16.6%]">
                          <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9] rounded-tl-lg rounded-tr-[2rem]">
                            Completed
                          </div>
                        </th>
                        <th className="w-[16.6%]">
                          <div className="px-3 py-4 text-white border-2 bg-[#009d9c] border-[#a9bad9] rounded-tl-lg rounded-tr-[2rem]">
                            % of Completion
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderStateRows()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
