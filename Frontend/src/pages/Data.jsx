import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Data() {
  const [columns, setColumns] = useState([]); // variable names
  const [headers, setHeaders] = useState({}); // variable → label map
  const [data, setData] = useState([]); // response data
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch completed survey data + headers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch combined data (Completed only)
        const res = await axios.get("/api/survey-data", {
          params: { status: "Completed" },
        });

        const surveyData = res.data?.data || [];
        const variableLabels = res.data?.headers || {};

        setData(surveyData);
        setHeaders(variableLabels);
        setColumns(Object.keys(variableLabels));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Excel download (codes or labels)
  const downloadExcel = async (withLabels = false) => {
    try {
      // 1️⃣ Fetch main data (with or without labels)
      const url = `/api/survey-data${withLabels ? "?labels=true" : ""}`;
      const res = await axios.get(url, { params: { status: "Completed" } });

      const surveyData = res.data?.data || [];
      const variableLabels = res.data?.headers || {};

      // 2️⃣ Fetch value and variable label sheets
      const valLabelRes = await axios.get("/api/val_labels");
      const varLabelRes = await axios.get("/api/var_labels");

      const valueLabels = valLabelRes.data || [];
      const variableLabelsList = varLabelRes.data || [];

      // 🟦 Sheet 1 — Survey Data
      const wsSurvey = XLSX.utils.json_to_sheet(surveyData, {
        header: Object.keys(variableLabels),
      });

      // Replace header cells with human-readable labels
      Object.keys(variableLabels).forEach((key, i) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: i });
        if (wsSurvey[cell]) wsSurvey[cell].v = variableLabels[key];
      });

      // 🟩 Sheet 2 — Value Labels (Variable → Value → Label)
      const wsValues = XLSX.utils.json_to_sheet(
        valueLabels.map((v) => ({
          Variable: v.Variable,
          Value: v.Value,
          Label: v.Label,
        }))
      );

      // 🟨 Sheet 3 — Variable Labels (Variable → Label)
      const wsVars = XLSX.utils.json_to_sheet(
        variableLabelsList.map((v) => ({
          Variable: v.Variable,
          Label: v.Label,
        }))
      );

      // 🧾 Combine workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsSurvey, "Survey Data");
      XLSX.utils.book_append_sheet(wb, wsValues, "Value Labels");
      XLSX.utils.book_append_sheet(wb, wsVars, "Variable Labels");

      // 💾 Save file
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const fileName = withLabels
        ? "SurveyData_WithLabels.xlsx"
        : "SurveyData_Codes.xlsx";

      saveAs(
        new Blob([wbout], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
      );
    } catch (err) {
      console.error("Error exporting Excel:", err);
    }
  };

  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      {/* Main */}
      <section className="col-start-2 col-end-[-1] row-start-2 row-end-[-1] p-4">
        <div className="flex justify-end items-center mt-4 mb-3">
          <div className="flex gap-3">
            <button
              onClick={() => downloadExcel(false)}
              className="bg-gradient-to-r from-[#E91E63] to-[#9C27B0] hover:from-[#C2185B] hover:to-[#7B1FA2] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faDownload} />
              Download Codes
            </button>

            <button
              onClick={() => downloadExcel(true)}
              className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:from-[#7B1FA2] hover:to-[#C2185B] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faDownload} />
              Download Labels
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-xl border-3 border-[#6538b0] shadow-lg">
          <div className="overflow-auto max-h-[78vh] backdrop-blur-sm">
            <table className="w-full border-collapse text-sm text-gray-700">
              {/* ===== Header ===== */}
              <thead className="sticky top-0 z-10 bg-[#6538b0] text-white shadow-md">
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 border-b border-blue-100 text-center font-semibold text-[0.9rem] max-w-[150px] truncate tracking-wide"
                      title={headers[col] || col}
                    >
                      {headers[col] || col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ===== Body ===== */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Loading data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No completed data found.
                    </td>
                  </tr>
                ) : (
                  data.map((row, i) => (
                    <tr
                      key={i}
                      className={`transition-colors ${i % 2 === 0
                          ? "bg-white hover:bg-blue-50/80"
                          : "bg-gray-100 hover:bg-blue-50/80"
                        }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-2 border-b border-gray-200 text-center whitespace-nowrap max-w-[150px] truncate"
                          title={row[col] ?? ""}
                        >
                          {row[col] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
