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
  "Urban",
  "Rural/Semi-urban",
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
          const subgroup = String(r.Subgroup || "").trim();
          const area = String(r.AreaType || "").trim();
          const count = Number(r.Count || 0);

          if (!completedLookup[zone]) completedLookup[zone] = {};
          if (!completedLookup[zone][city]) completedLookup[zone][city] = {};

          // ✅ Add subgroup count
          if (subgroup) {
            completedLookup[zone][city][subgroup] =
              (completedLookup[zone][city][subgroup] || 0) + count;
          }

          // ✅ Add area count
          if (area) {
            completedLookup[zone][city][area] =
              (completedLookup[zone][city][area] || 0) + count;
          }

          // ✅ Total = sum of all AreaType counts (not subgroups)
          const areaKeys = ["Urban", "Rural/Semi-urban"];
          const totalFromAreas = areaKeys.reduce((sum, a) => {
            return sum + (completedLookup[zone][city][a] || 0);
          }, 0);
          console.log(completedLookup);

          completedLookup[zone][city]["Total"] = totalFromAreas;
        });
        // ✅ Merge config + backend data
        const merged = TABLE_CONFIG.map((zoneConfig) => {
          const cities = zoneConfig.cities.map((c) => {
            const targets = c.targets || {};
            const totalTarget = Math.floor(sumTargets(targets) / 2);

            // totalCompleted = sum of all category counts (from backend)
            const cityData = completedLookup[zoneConfig.zone]?.[c.city] || {};
            const totalCompleted = Object.values(cityData).reduce(
              (s, v) => s + (Number(v) || 0),
              0
            );
            // ✅ Build each cell
            const cells = {};
            COLUMNS.forEach((col) => {
              const completedValue =
                completedLookup[zoneConfig.zone]?.[c.city]?.[col] || 0;
              const t = targets[col] ?? 0;

              if (col === "Total") {
                // ✅ Use backend-provided total directly (no manual recalculation)
                cells[col] = `${completedValue}/${totalTarget}`;
              } else {
                cells[col] = `${completedValue}/${t}`;
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
            let completedSum = 0;
            let targetSum = 0;

            if (col === "Total") {
              // ✅ Total comes from sum of area-type targets (Urban + Rural/Semi-urban)
              completedSum = cities.reduce((s, it) => {
                const val = completedLookup[zoneConfig.zone]?.[it.city]?.["Total"] || 0;
                return s + val;
              }, 0);

              targetSum = cities.reduce((s, it) => {
                const areaTargets = ["Urban", "Rural/Semi-urban"];
                const totalTarget = areaTargets.reduce(
                  (sum, a) => sum + (Number(it.targets[a]) || 0),
                  0
                );
                return s + totalTarget;
              }, 0);
            } else {
              // ✅ Normal columns (subgroups + areas)
              completedSum = cities.reduce(
                (s, it) => s + (completedLookup[zoneConfig.zone]?.[it.city]?.[col] || 0),
                0
              );

              targetSum = cities.reduce(
                (s, it) => s + Number(it.targets[col] || 0),
                0
              );
            }

            subtotals[col] = `${completedSum}/${targetSum}`;
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
        <div className="flex justify-end items-center mt-4 mb-3">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] hover:from-[#C2185B] hover:to-[#7B1FA2] text-white rounded-lg cursor-pointer"
            onClick={downloadExcel}
          >
            <FontAwesomeIcon icon={faDownload} /> Download Excel
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border-3 border-[#6538b0] shadow-md">
          <div className="relative overflow-auto max-h-[78vh]">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-[#6538b0] text-white z-20 shadow-sm">
                <tr>
                  <th
                    className="p-3 border border-white text-center"
                    rowSpan={2}
                  >
                    Zone
                  </th>
                  <th
                    className="p-3 border border-white text-center w-[200px]"
                    rowSpan="2"
                  >
                    City
                  </th>
                  <th
                    className="p-3 border border-white text-center"
                    rowSpan={2}
                  >
                    Total
                  </th>

                  <th
                    className="p-3 border border-white text-center"
                    colSpan={5}
                  >
                    Sub-group
                  </th>
                  <th
                    className="p-3 border border-white text-center"
                    colSpan={2}
                  >
                    Area
                  </th>
                </tr>
                <tr>
                  {COLUMNS.filter((c) => c !== "Total").map((col) => (
                    <th
                      key={col}
                      className="p-3 border border-white text-center"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length + 2}
                      className="text-center py-6"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  <>
                    {tableData.map((z, zi) => {
                      const rowSpan = z.cities.length + 1;
                      return (
                        <React.Fragment key={zi}>
                          {z.cities.map((c, ci) => (
                            <tr
                              key={`${zi}-${ci}`}
                              className="bg-white hover:bg-blue-50 transition-colors"
                            >
                              {ci === 0 && (
                                <td
                                  rowSpan={rowSpan}
                                  className="align-middle text-center text-base px-3 py-2 font-semibold text-[#163a85] bg-[#ffcaf0] border-r border-gray-200"
                                >
                                  {z.zone}
                                </td>
                              )}
                              <td className="px-3 py-2 border-r border-gray-200">
                                {c.city}
                              </td>
                              <td className="px-3 py-2 text-center border-r border-gray-200">
                                {c.cells["Total"]}
                              </td>
                              {COLUMNS.filter((col) => col !== "Total").map(
                                (col) => (
                                  <td
                                    key={col}
                                    className="px-3 py-2 text-center border-r border-gray-200"
                                  >
                                    {c.cells[col]}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                          <tr className="bg-[#ffcaf0] font-semibold text-[#163a85]">
                            <td className="px-3 py-2 text-left text-base border-r border-gray-200">
                              Sub-total
                            </td>
                            <td className="px-3 py-2 text-center border-r border-gray-200">
                              {z.subtotals["Total"]}
                            </td>
                            {COLUMNS.filter((col) => col !== "Total").map(
                              (col) => (
                                <td
                                  key={col}
                                  className="px-3 py-2 text-center border-r border-gray-200"
                                >
                                  {z.subtotals[col]}
                                </td>
                              )
                            )}
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </tbody>

              <tfoot className="sticky bottom-0 bg-[#6538b0] text-white z-20">
                <tr className="font-bold">
                  <td
                    colSpan={2}
                    className="px-3 py-2 border-r border-gray-200"
                  >
                    Grand Total
                  </td>
                  <td className="px-3 py-2 text-center border-r border-gray-200">
                    {(() => {
                      const val = tableData.reduce(
                        (s, z) =>
                          s +
                          (parseInt(z.subtotals["Total"]?.split("/")[0]) || 0),
                        0
                      );
                      const targ = tableData.reduce(
                        (s, z) =>
                          s +
                          (parseInt(z.subtotals["Total"]?.split("/")[1]) || 0),
                        0
                      );
                      return `${val}/${targ}`;
                    })()}
                  </td>
                  {COLUMNS.filter((col) => col !== "Total").map((col) => {
                    const totalCompleted = tableData.reduce(
                      (s, z) =>
                        s + (parseInt(z.subtotals[col]?.split("/")[0]) || 0),
                      0
                    );
                    const totalTarget = tableData.reduce(
                      (s, z) =>
                        s + (parseInt(z.subtotals[col]?.split("/")[1]) || 0),
                      0
                    );
                    return (
                      <td
                        key={col}
                        className="px-3 py-2 text-center border-r border-gray-200"
                      >
                        {`${totalCompleted}/${totalTarget}`}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
