import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const ResearchOverview = () => {
  const [showWRS, setShowWRS] = useState(false);
  const [showEFS, setShowEFS] = useState(false);

  const openDialog = (type) => {
    if (type === "WRS") setShowWRS(true);
    if (type === "EFS") setShowEFS(true);
  };

  const closeDialog = (type) => {
    if (type === "WRS") setShowWRS(false);
    if (type === "EFS") setShowEFS(false);
  };

  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[10vh_90vh] font-inter">
      <Header />
      <Sidebar />
      {/* Main Section */}
      <section className="grid grid-cols-1 grid-rows-[65%_35%] relative">
        {/* Top Four Cards */}
        <div className="row-start-1 row-end-2 col-start-1 col-end-[-1] grid grid-cols-[50%_50%] grid-rows-[50%_50%] gap-2 w-full h-full">
          {/* About the Project */}
          <div className="row-start-1 row-end-2 col-start-1 col-end-2 flex justify-end flex-wrap gap-x-4 gap-y-4">
            <div className="relative rounded-tl-lg rounded-br-lg rounded-tr-[6rem] rounded-bl-[6rem] h-full w-[60%] bg-[#009d9c]/30 flex items-center justify-start gap-2 flex-col text-center">
              <p className="w-[75%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                About the Project
              </p>
              <p className="w-[75%] h-[75%] text-[0.9rem]">
                Evaluation of Centrally Sponsored Schemes in Water Resources,
                Environment and Forest sector, assessing their effectiveness and
                deriving actionable insights for the Development Monitoring and
                Evaluation Office.
              </p>
              <div className="rounded-full absolute p-4 top-[-20%] left-[-10%] bg-[#233577] border-8 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="46"
                  height="46"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="#ffffff"
                    d="m213.66 66.34l-40-40A8 8 0 0 0 168 24H88a16 16 0 0 0-16 16v16H56a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-16h16a16 16 0 0 0 16-16V72a8 8 0 0 0-2.34-5.66M168 216H56V72h76.69L168 107.31zm32-32h-16v-80a8 8 0 0 0-2.34-5.66l-40-40A8 8 0 0 0 136 56H88V40h76.69L200 75.31Zm-56-32a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Organisation */}
          <div className="row-start-1 row-end-2 col-start-2 col-end-[-1] flex justify-start">
            <div className="relative rounded-tr-lg rounded-bl-lg rounded-tl-[6rem] rounded-br-[6rem] h-full w-[60%] bg-[#009d9c]/30 flex items-center justify-start gap-2 flex-col text-center">
              <p className="w-[75%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                Organisation
              </p>
              <p className="w-[75%] h-[75%] text-[0.9rem]">
                Ipsos, a global market research firm, is partnering with the
                Development Monitoring and Evaluation Office for project
                execution, handling survey implementation, data collection, and
                dashboard development.
              </p>
              <div className="rounded-full absolute p-4 top-[-20%] right-[-10%] bg-[#233577] border-8 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="46"
                  height="46"
                  viewBox="0 0 56 56"
                >
                  <path
                    fill="#ffffff"
                    d="M6.529 50.323q-1.636 0-2.583-1.052q-.873-.972-.94-2.55L3 46.454V8.87q0-1.786.946-2.827q.873-.962 2.335-1.036L6.53 5h26.807q1.615 0 2.562 1.042q.873.96.94 2.557l.005.27v6.59h12.65q1.49 0 2.411.897l.15.156q.874.97.94 2.549l.006.267v27.126q0 1.764-.946 2.817q-.873.97-2.317 1.046l-.245.006zm30.314-3.869q0 .23-.016.447h11.538q.617 0 .915-.298q.255-.256.291-.76l.007-.175V20.115q0-.638-.298-.936q-.255-.255-.745-.291l-.17-.006l-11.522-.001zM32.21 8.423H7.656q-.638 0-.936.297q-.255.256-.291.76l-.006.176v36.012q0 .637.297.935q.256.255.76.291l.176.007l4.867-.001v-6.27q0-1.257.52-1.907l.108-.124q.57-.59 1.694-.643l.23-.005h9.694q1.317 0 1.934.648q.561.59.612 1.785l.005.245l-.001 6.271h4.89q.617 0 .914-.297q.255-.256.292-.76l.006-.175V9.656q0-.638-.298-.936q-.297-.297-.914-.297m-8.354 32.313h-7.866q-.618 0-.675.562l-.005.118l-.001 5.484h9.226v-5.484q0-.618-.561-.675zm21.067-2.105q.662 0 .717.607l.005.116v3.316q0 .663-.607.718l-.115.005h-3.423q-.642 0-.697-.607l-.004-.116v-3.316q0-.663.59-.718l.111-.005zm0-8.12q.662 0 .717.607l.005.115v3.316q0 .663-.607.718l-.115.005h-3.423q-.642 0-.697-.607l-.004-.116v-3.316q0-.663.59-.718l.111-.005zm-27.913-1.723q.806 0 .867.743l.005.129v4.018q0 .804-.743.866l-.129.005h-4.145q-.765 0-.824-.742l-.005-.13V29.66q0-.804.706-.867l.123-.005zm9.95 0q.804 0 .866.743l.005.129v4.018q0 .804-.743.866l-.129.005h-4.124q-.785 0-.845-.742l-.005-.13V29.66q0-.804.724-.867l.126-.005zm17.963-6.399q.662 0 .717.608l.005.115v3.317q0 .662-.607.717l-.115.005h-3.423q-.642 0-.697-.607l-.004-.115v-3.317q0-.661.59-.718l.111-.005zm-27.913-2.02q.806 0 .867.744l.005.128v4.018q0 .806-.743.867l-.129.005h-4.145q-.765 0-.824-.743l-.005-.129v-4.018q0-.804.706-.866l.123-.005zm9.95 0q.804 0 .866.744l.005.128v4.018q0 .806-.743.867l-.129.005h-4.124q-.785 0-.845-.743l-.005-.129v-4.018q0-.804.724-.866l.126-.005zm-9.95-8.417q.806 0 .867.742l.005.13v4.017q0 .804-.743.866l-.129.006h-4.145q-.765 0-.824-.743l-.005-.129v-4.018q0-.804.706-.866l.123-.005zm9.95 0q.804 0 .866.742l.005.13v4.017q0 .804-.743.866l-.129.006h-4.124q-.785 0-.845-.743l-.005-.129v-4.018q0-.804.724-.866l.126-.005z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="row-start-2 row-end-[-1] col-start-1 col-end-2 flex justify-end">
            <div className="relative rounded-tr-lg rounded-bl-lg rounded-tl-[6rem] rounded-br-[6rem] h-full w-[60%] bg-[#009d9c]/30 flex items-center justify-start gap-2 flex-col text-center">
              <p className="w-[75%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                Objectives
              </p>
              <p className="w-[75%] h-[75%] text-[0.9rem]">
                To enable progress monitoring, data analysis, and efficient
                decision-making by developing tools and a web dashboard portal
                that ensures real-time updates and provides actionable insights
                for both qualitative and quantitative evaluations.
              </p>
              <div className="rounded-full absolute p-4 bottom-[-20%] left-[-10%] bg-[#233577] border-8 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="46"
                  height="46"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#ffffff"
                    d="M17.603 7.519a7.999 7.999 0 1 1-5.117-5.126L11.439 3.44q-.086.086-.158.185a6.5 6.5 0 1 0 5.088 5.098a1.5 1.5 0 0 0 .192-.162zM14.898 9q.1.486.1 1A5 5 0 1 1 11 5.1v1.546A3.5 3.5 0 1 0 13.353 9zm-4.9 2.5a1.5 1.5 0 0 0 1.45-1.887L13.03 8.03l.03-.03h2.44a.5.5 0 0 0 .354-.146l2-2A.5.5 0 0 0 17.5 5H15V2.5a.5.5 0 0 0-.853-.354l-2 2A.5.5 0 0 0 12 4.5v2.44l-.03.03l-1.582 1.581a1.5 1.5 0 0 0-1.89 1.45a1.5 1.5 0 0 0 1.5 1.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="row-start-2 row-end-[-1] col-start-2 col-end-[-1] flex justify-start">
            <div className="relative rounded-tl-lg rounded-br-lg rounded-tr-[6rem] rounded-bl-[6rem] h-full w-[60%] bg-[#009d9c]/30 flex items-center justify-start gap-2 flex-col text-center">
              <p className="w-[75%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                Methodology
              </p>
              <p className="w-[75%] h-[75%] text-[0.9rem]">
                This study will use a combination of meta-analysis and field
                research to gather insights including consult stakeholders,
                conduct surveys among farmers in rural villages.
              </p>
              <div className="rounded-full absolute p-4 bottom-[-20%] right-[-10%] bg-[#233577] border-8 border-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="46"
                  height="46"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="#ffffff"
                    d="M12 25c-.738 0-1.376.405-1.723 1h-5.63l2.648-5.092c.227.055.461.092.705.092c1.654 0 3-1.346 3-3s-1.346-3-3-3s-3 1.346-3 3c0 .679.235 1.298.616 1.801L2.113 26.54A1 1 0 0 0 3 28h7.277c.347.595.985 1 1.723 1a2 2 0 0 0 0-4m-4-8a1.001 1.001 0 0 1 0 2a1 1 0 0 1 0-2m21.887 9.539l-4.04-7.771A2 2 0 1 0 24 20c.075 0 .147-.014.22-.023L27.353 26h-4.537A2.995 2.995 0 0 0 20 24c-1.654 0-3 1.346-3 3s1.346 3 3 3a2.995 2.995 0 0 0 2.816-2H29a1 1 0 0 0 .887-1.462zM20 28a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2m1-20a3 3 0 0 0-.705.092L16.887 1.54C16.715 1.207 16.357 1 16 1s-.715.207-.887.539L11.22 9.023C11.148 9.014 11.076 9 11 9a2 2 0 1 0 1.846 1.232L16 4.168l2.616 5.03A2.97 2.97 0 0 0 18 11c0 1.654 1.346 3 3 3s3-1.346 3-3s-1.346-3-3-3m0 4a1.001 1.001 0 0 1 0-2a1.001 1.001 0 0 1 0 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Table */}
        <div className="row-start-2 row-end-[-1] col-start-1 col-end-[-1] gap-4 flex justify-center items-center flex-col">
          <p className="w-full text-center text-[1.625rem] font-bold text-[#767676]">
            Coverage
          </p>

          <table className="bg-[#d8a877]/30 w-[80%] rounded-md p-4">
            <thead className="border-b-[1px] border-[#2e469c]">
              <tr className="text-[#233577] text-[1.15rem]">
                <th></th>
                <th className="text-left px-4 py-2 font-bold">Sector</th>
                <th className="text-left px-4 py-2 font-bold">
                  No. of Schemes
                </th>
                <th className="text-left px-4 py-2 font-bold">No. of States</th>
                <th className="text-left px-4 py-2 font-bold">HH Surveys</th>
                <th className="text-left px-4 py-2 font-bold">KIIs</th>
                <th className="text-left px-4 py-2 font-bold">FGDs</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[1.15rem] text-[#2e469c] font-semibold">
                <td className="px-4 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#2E469C"
                      d="M12 22q-3.425 0-5.712-2.35T4 13.8q0-1.55.7-3.1t1.75-2.975T8.725 5.05T11 2.875q.2-.2.463-.287T12 2.5t.538.088t.462.287q1.05.925 2.275 2.175t2.275 2.675T19.3 10.7t.7 3.1q0 3.5-2.287 5.85T12 22m.275-3q.3-.025.513-.238T13 18.25q0-.35-.225-.562T12.2 17.5q-1.025.075-2.175-.562t-1.45-2.313q-.05-.275-.262-.45T7.825 14q-.35 0-.575.263t-.15.612q.425 2.275 2 3.25t3.175.875"
                    />
                  </svg>
                </td>
                <td className="px-4 py-2">Water Resources</td>
                <td
                  className="px-4 py-2 text-center cursor-pointer underline"
                  onClick={() => openDialog("WRS")}
                >
                  8
                </td>
                <td className="px-4 py-2 text-center">12</td>
                <td className="px-4 py-2 text-center">1500</td>
                <td className="px-4 py-2 text-center">126</td>
                <td className="px-4 py-2 text-center">240</td>
              </tr>

              <tr className="text-[1.15rem] text-[#009d9c] font-semibold">
                <td className="px-4 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 100 100"
                  >
                    <path
                      fill="#009D9C"
                      d="m91.963 80.982l.023-.013l-7.285-12.617h2.867v-.013c.598 0 1.083-.484 1.083-1.082c0-.185-.059-.351-.14-.503l.019-.011l-6.737-11.669h1.639v-.009a.773.773 0 0 0 .773-.772a.76.76 0 0 0-.1-.359l.013-.008l-9.802-16.979l-.01.006a1.32 1.32 0 0 0-1.186-.754c-.524 0-.968.311-1.185.752l-.005-.003l-9.802 16.978l.002.001a.75.75 0 0 0-.105.366c0 .426.346.772.773.772v.009h1.661l-6.737 11.669l.003.001a1.06 1.06 0 0 0-.147.513c0 .598.485 1.082 1.083 1.082v.013h2.894l-2.1 3.638l-8.399-14.548h4.046v-.018c.844 0 1.528-.685 1.528-1.528c0-.26-.071-.502-.186-.717l.015-.009l-9.507-16.467h2.313v-.012a1.09 1.09 0 0 0 1.091-1.092c0-.186-.059-.353-.141-.506l.019-.011L36.4 13.125l-.005.003a1.87 1.87 0 0 0-1.683-1.06c-.758 0-1.408.452-1.704 1.1L19.201 37.082l.003.002a1.06 1.06 0 0 0-.148.516a1.09 1.09 0 0 0 1.09 1.092v.012h2.345l-9.395 16.272a1.5 1.5 0 0 0-.316.92c0 .844.685 1.528 1.528 1.528v.018h4.084L8.252 75.007c-.24.314-.387.702-.387 1.128c0 1.032.838 1.87 1.871 1.87v.021h19.779v8.43c0 .815.661 1.477 1.476 1.477h7.383c.815 0 1.477-.661 1.477-1.477v-8.43h16.12l-1.699 2.943l.003.002c-.104.189-.18.396-.18.628c0 .732.593 1.325 1.325 1.325v.015h14.016v3.941c0 .578.469 1.046 1.046 1.046h5.232c.578 0 1.046-.468 1.046-1.046v-3.941h14.05v-.015c.732 0 1.326-.593 1.326-1.325a1.3 1.3 0 0 0-.173-.617"
                    />
                  </svg>
                </td>
                <td className="px-4 py-2">Environment and Forest</td>
                <td
                  className="px-4 py-2 text-center cursor-pointer underline"
                  onClick={() => openDialog("EFS")}
                >
                  3
                </td>
                <td className="px-4 py-2 text-center">12</td>
                <td className="px-4 py-2 text-center">1080</td>
                <td className="px-4 py-2 text-center">126</td>
                <td className="px-4 py-2 text-center">88</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dialogs */}
      {showWRS && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center"
          onClick={() => closeDialog("WRS")}
        >
          <div
            className="relative w-[30vw] h-[15vh] bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-[2%] top-[4%]"
              onClick={() => closeDialog("WRS")}
            >
              ❌
            </button>
            <p className="text-center p-3 text-[1.25rem] text-[#243386] font-semibold">
              Water Resources Schemes
            </p>
            <p className="text-center p-3 text-[#535353] font-medium">
              AIBP, CADWM, SMI, RRR, GW, SPFM, WDC
            </p>
          </div>
        </div>
      )}

      {showEFS && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center"
          onClick={() => closeDialog("EFS")}
        >
          <div
            className="relative w-[30vw] h-[15vh] bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-[2%] top-[4%]"
              onClick={() => closeDialog("EFS")}
            >
              ❌
            </button>
            <p className="text-center p-3 text-[1.25rem] text-[#243386] font-semibold">
              Environment & Forest Schemes
            </p>
            <p className="text-center p-3 text-[#535353] font-medium">
              NMGI, CNRE, IDWH
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default ResearchOverview;
