import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Data() {
  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      {/* Main */}
      <section className="flex h-full w-full justify-center items-center">
        Work in Progress!
      </section>
    </main>
  );
}
