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
      <section className="grid grid-cols-1 grid-rows-[15%_70%_15%] relative">
        {/* Top Four Cards */}
        <div className="row-start-2 row-end-2 col-start-1 -col-end-1 grid grid-cols-[50%_50%] grid-rows-[50%_50%] gap-2 w-full h-full">
          {/* About the Project */}
          <div className="row-start-1 row-end-2 col-start-1 col-end-2 flex justify-end flex-wrap gap-x-4 gap-y-4">
            <div className="relative rounded-tl-lg rounded-br-lg rounded-tr-[6rem] rounded-bl-[6rem] h-full w-[90%] bg-gradient-to-br from-[#FFB3D9] to-[#FF6B9D] flex items-center justify-start gap-2 flex-col text-center shadow-lg">
              <p className="flex items-center justify-center w-[95%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                About the Project
              </p>
              <p className="w-[85%] text-xs text-black max-h-[60%] overflow-y-auto [&::-webkit-scrollbar]:w-2 dark:[&::-webkit-scrollbar-track]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-300">
                The study is to develop an evidence-based business case for
                LGBTI-inclusive banking practices, focusing on tailored
                products, services, and investment structures for the LGBTI
                community. It intends to bridge the gap in product development
                and service delivery by enhancing the understanding of the
                unique needs of diverse LGBTI individuals.
              </p>
              <div className="rounded-full absolute p-4 top-[-20%] left-[-10%] bg-gradient-to-br from-[#FF6B9D] to-[#C2185B] border-8 border-white">
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
          <div className="row-start-1 row-end-2 col-start-2 -col-end-1 flex justify-start">
            <div className="relative rounded-tr-lg rounded-bl-lg rounded-tl-[6rem] rounded-br-[6rem] h-full w-[90%] bg-gradient-to-br from-[#B3E5FC] to-[#4FC3F7] shadow-lg flex items-center justify-start gap-2 flex-col text-center">
              <p className="flex items-center justify-center w-[95%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                Organization
              </p>
              <p className="w-[85%] text-xs text-black max-h-[60%] overflow-y-auto [&::-webkit-scrollbar]:w-2 dark:[&::-webkit-scrollbar-track]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-300">
                International Finance Corporation (IFC), a member of the World
                Bank Group has commissioned Ipsos Research Private Limited to
                conduct an independent study on financial inclusion for
                gender-diverse populations.
              </p>
              <div className="rounded-full absolute p-4 top-[-20%] right-[-10%] bg-gradient-to-bl from-[#4FC3F7] to-[#067db5] border-8 border-white">
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
          <div className="row-start-2 -row-end-1 col-start-1 col-end-2 flex justify-end">
            <div className="relative rounded-tr-lg rounded-bl-lg rounded-tl-[6rem] rounded-br-[6rem] h-full w-[90%] bg-gradient-to-br from-[#FFE082] to-[#FFD54F] shadow-lg flex items-center justify-start gap-2 flex-col text-center">
              <p className="flex items-center justify-center w-[95%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                Objectives
              </p>
              <p className="w-[85%] text-xs text-black text-left list-disc pl-4 space-y-1 max-h-[60%] overflow-y-auto [&::-webkit-scrollbar]:w-2 dark:[&::-webkit-scrollbar-track]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-300">
                The study covers both supply and demand side perspective. It
                aims to identify advisory and investment opportunities that
                support financial institutions (FIs) in establishing inclusive
                and equitable value propositions to reduce discrimination
                against LGBTI community. By investigating the usages and
                challenges faced by LGBTI individuals with regard to financial
                services, the study seeks to enhance understanding of their
                unique needs in banking and financial aspects.
              </p>
              <div className="rounded-full absolute p-4 bottom-[-20%] left-[-10%] bg-gradient-to-tr from-[#FF9800] to-[#E65100] border-8 border-white">
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
          <div className="row-start-2 -row-end-1 col-start-2 -col-end-1 flex justify-start">
            <div className="relative rounded-tl-lg rounded-br-lg rounded-tr-[6rem] rounded-bl-[6rem] h-full w-[90%] bg-gradient-to-br from-[#A5D6A7] to-[#66BB6A] flex items-center justify-start gap-2 flex-col text-center shadow-lg">
              <p className="flex items-center justify-center w-[95%] h-[25%] text-[1.275rem] text-[#2e469c] font-semibold">
                Methodology
              </p>
              <p className="w-[85%] text-xs text-black text-left list-disc pl-4 space-y-2 max-h-[60%] overflow-y-auto [&::-webkit-scrollbar]:w-2 dark:[&::-webkit-scrollbar-track]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-300">
                The study adopts a mixed method design involving structured CAPI
                survey with LBGTI individuals and in depth interviews with
                financial institutions and community based organisation working
                with and for LGBTI communities.
              </p>
              <div className="rounded-full absolute p-4 bottom-[-20%] right-[-10%] bg-gradient-to-tl from-[#66BB6A] to-[#3e8f42] border-8 border-white">
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
