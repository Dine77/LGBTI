import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Static configuration (per-column targets for each city)
const TABLE_CONFIG = [
  {
    zone: "East",
    cities: [
      {
        city: "Bhubaneshwar",
        targets: {
          Lesbian: 44,
          Gay: 44,
          Bisexual: 44,
          Transgender: 44,
          Intersex: 2,
          "Rural/Semi-urban": 53,
          Urban: 125,
        },
      },
      {
        city: "Kolkata",
        targets: {
          Lesbian: 44,
          Gay: 44,
          Bisexual: 44,
          Transgender: 44,
          Intersex: 2,
          "Rural/Semi-urban": 53,
          Urban: 125,
        },
      },
      {
        city: "Patna",
        targets: {
          Lesbian: 43,
          Gay: 43,
          Bisexual: 43,
          Transgender: 43,
          Intersex: 2,
          "Rural/Semi-urban": 52,
          Urban: 122,
        },
      },
      {
        city: "Raipur",
        targets: {
          Lesbian: 44,
          Gay: 44,
          Bisexual: 44,
          Transgender: 44,
          Intersex: 2,
          "Rural/Semi-urban": 53,
          Urban: 125,
        },
      },
    ],
  },
  {
    zone: "North",
    cities: [
      {
        city: "Bhopal",
        targets: {
          Lesbian: 35,
          Gay: 35,
          Bisexual: 35,
          Transgender: 35,
          Intersex: 3,
          "Rural/Semi-urban": 43,
          Urban: 100,
        },
      },
      {
        city: "Chandigarh",
        targets: {
          Lesbian: 35,
          Gay: 35,
          Bisexual: 35,
          Transgender: 35,
          Intersex: 3,
          "Rural/Semi-urban": 43,
          Urban: 100,
        },
      },
      {
        city: "Varanashi",
        targets: {
          Lesbian: 35,
          Gay: 35,
          Bisexual: 35,
          Transgender: 35,
          Intersex: 1,
          "Rural/Semi-urban": 42,
          Urban: 99,
        },
      },
      {
        city: "Lucknow",
        targets: {
          Lesbian: 35,
          Gay: 35,
          Bisexual: 35,
          Transgender: 35,
          Intersex: 1,
          "Rural/Semi-urban": 42,
          Urban: 99,
        },
      },
      {
        city: "Delhi",
        targets: {
          Lesbian: 35,
          Gay: 35,
          Bisexual: 35,
          Transgender: 35,
          Intersex: 3,
          "Rural/Semi-urban": 43,
          Urban: 100,
        },
      },
    ],
  },
  {
    zone: "North-East",
    cities: [
      {
        city: "Imphal",
        targets: {
          Lesbian: 30,
          Gay: 30,
          Bisexual: 30,
          Transgender: 30,
          Intersex: 1,
          "Rural/Semi-urban": 36,
          Urban: 85,
        },
      },
      {
        city: "Guwahati",
        targets: {
          Lesbian: 30,
          Gay: 30,
          Bisexual: 30,
          Transgender: 30,
          Intersex: 1,
          "Rural/Semi-urban": 36,
          Urban: 85,
        },
      },
    ],
  },
  {
    zone: "South",
    cities: [
      {
        city: "Bangalore",
        targets: {
          Lesbian: 58,
          Gay: 58,
          Bisexual: 58,
          Transgender: 58,
          Intersex: 3,
          "Rural/Semi-urban": 71,
          Urban: 165,
        },
      },
      {
        city: "Chennai",
        targets: {
          Lesbian: 58,
          Gay: 58,
          Bisexual: 58,
          Transgender: 58,
          Intersex: 3,
          "Rural/Semi-urban": 71,
          Urban: 165,
        },
      },
      {
        city: "Hyderabad",
        targets: {
          Lesbian: 58,
          Gay: 58,
          Bisexual: 58,
          Transgender: 58,
          Intersex: 3,
          "Rural/Semi-urban": 71,
          Urban: 165,
        },
      },
    ],
  },
  {
    zone: "West",
    cities: [
      {
        city: "Ahmedabad",
        targets: {
          Lesbian: 42,
          Gay: 42,
          Bisexual: 42,
          Transgender: 42,
          Intersex: 3,
          "Rural/Semi-urban": 51,
          Urban: 120,
        },
      },
      {
        city: "Mumbai",
        targets: {
          Lesbian: 45,
          Gay: 45,
          Bisexual: 45,
          Transgender: 45,
          Intersex: 3,
          "Rural/Semi-urban": 55,
          Urban: 128,
        },
      },
      {
        city: "Goa",
        targets: {
          Lesbian: 42,
          Gay: 42,
          Bisexual: 42,
          Transgender: 42,
          Intersex: 1,
          "Rural/Semi-urban": 51,
          Urban: 118,
        },
      },
      {
        city: "Pune",
        targets: {
          Lesbian: 45,
          Gay: 45,
          Bisexual: 45,
          Transgender: 45,
          Intersex: 3,
          "Rural/Semi-urban": 55,
          Urban: 128,
        },
      },
    ],
  },
];

// Columns in order
const COLUMNS = [
  "Total",
  "Lesbian",
  "Gay",
  "Bisexual",
  "Transgender",
  "Intersex",
  "Rural/Semi-urban",
  "Urban",
];

export default function ResearchCrosstab() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // helper: sum values of an object
  const sumTargets = (targetsObj) =>
    Object.values(targetsObj || {}).reduce((s, v) => s + Number(v || 0), 0);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/surveys");
        const rows = res.data?.rows || [];

        // ✅ Build nested lookup from backend data:
        // completedLookup[Zone][City][Variable] = Count
        const completedLookup = {};
        rows.forEach((r) => {
          const zone = String(r.Zone || "").trim();
          const city = String(r.City || "").trim();
          const variable = String(r.Variable || "").trim();
          const count = Number(r.Count || 0);
          if (!completedLookup[zone]) completedLookup[zone] = {};
          if (!completedLookup[zone][city]) completedLookup[zone][city] = {};
          completedLookup[zone][city][variable] = count;
        });

        // ✅ Merge config + backend data
        const merged = TABLE_CONFIG.map((zoneConfig) => {
          const cities = zoneConfig.cities.map((c) => {
            const targets = c.targets || {};
            const totalTarget = Math.floor(sumTargets(targets) / 2);

            // totalCompleted = sum of all category counts (from backend)
            const cityData = completedLookup[zoneConfig.zone]?.[c.city] || {};
            const totalCompleted = Object.values(cityData).reduce((s, v) => s + (Number(v) || 0), 0);

            // ✅ Build each cell
            const cells = {};
            COLUMNS.forEach((col) => {
              if (col === "Total") {
                cells[col] = `${totalCompleted}/${totalTarget}`;
              } else {
                const t = targets[col] ?? 0;
                const completed = completedLookup[zoneConfig.zone]?.[c.city]?.[col] || 0;
                cells[col] = `${completed}/${t}`;
              }
            });

            return {
              city: c.city,
              targets,
              totalTarget,
              totalCompleted,
              cells,
            };
          });

          // ✅ Compute Subtotals per zone
          const subtotals = {};
          COLUMNS.forEach((col) => {
            if (col === "Total") {
              const completedSum = cities.reduce((s, it) => s + (Number(it.totalCompleted) || 0), 0);
              const targetSum = cities.reduce((s, it) => s + (Number(it.totalTarget) || 0), 0);
              subtotals[col] = `${completedSum}/${targetSum}`;
            } else {
              const completedSum = cities.reduce(
                (s, it) => s + (completedLookup[zoneConfig.zone]?.[it.city]?.[col] || 0),
                0
              );
              const targetSum = cities.reduce((s, it) => s + (Number(it.targets[col] || 0)), 0);
              subtotals[col] = `${completedSum}/${targetSum}`;
            }
          });

          return { zone: zoneConfig.zone, cities, subtotals };
        });

        setTableData(merged);
      } catch (err) {
        console.error("Error fetching surveys:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);


  // Download Excel matching displayed layout (no Zone Total column)
  const downloadExcel = () => {
    const excelRows = [];
    tableData.forEach((z) => {
      z.cities.forEach((c) => {
        const row = { Zone: z.zone, City: c.city };
        COLUMNS.forEach((col) => (row[col] = c.cells[col]));
        excelRows.push(row);
      });
      const subtotalRow = { Zone: `${z.zone} Sub-total`, City: "" };
      COLUMNS.forEach((col) => (subtotalRow[col] = z.subtotals[col]));
      excelRows.push(subtotalRow);
    });

    // Grand total row
    const grand = { Zone: "Grand Total", City: "" };
    COLUMNS.forEach((col) => {
      const totalCompleted = tableData.reduce(
        (s, z) => s + (parseInt(z.subtotals[col]?.split("/")[0]) || 0),
        0
      );
      const totalTarget = tableData.reduce(
        (s, z) => s + (parseInt(z.subtotals[col]?.split("/")[1]) || 0),
        0
      );
      grand[col] = `${totalCompleted}/${totalTarget}`;
    });
    excelRows.push(grand);

    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Crosstab");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Crosstab.xlsx"
    );
  };

  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />
      <section className="col-start-2 col-end-[-1] row-start-2 row-end-[-1] p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Research Progress – Crosstab Table</h2>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-[#2E469C] text-white rounded-lg"
            onClick={downloadExcel}
          >
            <FontAwesomeIcon icon={faDownload} /> Download Excel
          </button>
        </div>

        <div className="overflow-auto shadow-md rounded-lg border border-gray-300">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[#163a85] text-white sticky top-0">
              <tr>
                <th className="p-2 border">Zone</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border">Total</th> {/* 👈 added manually before other columns */}
                {COLUMNS.filter((c) => c !== "Total").map((col) => (
                  <th key={col} className="p-2 border">{col}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr><td colSpan={COLUMNS.length + 2} className="text-center py-6">Loading...</td></tr>
              ) : (
                <>
                  {tableData.map((z, zi) => {
                    const rowSpan = z.cities.length + 1;
                    return (
                      <React.Fragment key={zi}>
                        {z.cities.map((c, ci) => (
                          <tr key={`${zi}-${ci}`} className="bg-white">
                            {ci === 0 && (
                              <td rowSpan={rowSpan} className="align-top px-3 py-2 font-semibold text-[#163a85] bg-blue-50 border">
                                {z.zone}
                              </td>
                            )}
                            <td className="px-3 py-2 border">{c.city}</td>
                            <td className="px-3 py-2 border text-center">{c.cells["Total"]}</td>
                            {COLUMNS.filter((c) => c !== "Total").map((col) => (
                              <td key={col} className="px-3 py-2 border text-center">{c.cells[col]}</td>
                            ))}

                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold text-[#163a85]">
                          <td className="px-3 py-2 border text-right">Sub-total</td>
                          <td className="px-3 py-2 border text-center">{z.subtotals["Total"]}</td>
                          {COLUMNS.filter((c) => c !== "Total").map((col) => (
                            <td key={col} className="px-3 py-2 border text-center">{z.subtotals[col]}</td>
                          ))}

                        </tr>
                      </React.Fragment>
                    );
                  })}

                  {/* Grand Total */}
                  <tr className="bg-[#0b4f73] text-white font-bold">
                    <td colSpan={2} className="px-3 py-2 border">Grand Total</td><td className="px-3 py-2 border text-center">
                      {(() => {
                        const val = tableData.reduce(
                          (s, z) => s + (parseInt(z.subtotals["Total"]?.split("/")[0]) || 0),
                          0
                        );
                        const targ = tableData.reduce(
                          (s, z) => s + (parseInt(z.subtotals["Total"]?.split("/")[1]) || 0),
                          0
                        );
                        return `${val}/${targ}`;
                      })()}
                    </td>
                    {COLUMNS.filter((c) => c !== "Total").map((col) => {
                      const totalCompleted = tableData.reduce(
                        (s, z) => s + (parseInt(z.subtotals[col]?.split("/")[0]) || 0),
                        0
                      );
                      const totalTarget = tableData.reduce(
                        (s, z) => s + (parseInt(z.subtotals[col]?.split("/")[1]) || 0),
                        0
                      );
                      return (
                        <td key={col} className="px-3 py-2 border text-center">
                          {`${totalCompleted}/${totalTarget}`}
                        </td>
                      );
                    })}

                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
