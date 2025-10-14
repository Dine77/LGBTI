import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

/*
  MapView.jsx — React + Tailwind + Google Maps + react-select
  Matches original PHP layout pixel-perfectly with Map/Satellite toggle.
*/

const containerStyle = {
  width: "100%",
  height: "82vh",
};

const centerIndia = { lat: 22.5937, lng: 78.9629 };
const defaultSelect = [{ value: "All", label: "All" }];

const fetchOptions = async (col) => {
  try {
    const res = await axios.get(`/api/options?col=${col}`);
    const arr = Array.isArray(res.data) && res.data.length ? res.data : ["All"];
    return [
      { value: "All", label: "All" },
      ...arr.map((v) => ({ value: v, label: v })),
    ];
  } catch (e) {
    console.warn("fetchOptions error", col, e);
    return defaultSelect;
  }
};

const fetchMapData = async (params) => {
  try {
    const res = await axios.get("/api/map-data", { params });
    return res.data || [];
  } catch (e) {
    console.warn("fetchMapData error", e);
    return [];
  }
};

export default function MapView() {
  const [sectorOptions, setSectorOptions] = useState(defaultSelect);
  const [schemeOptions, setSchemeOptions] = useState(defaultSelect);
  const [stateOptions, setStateOptions] = useState(defaultSelect);

  const [sector, setSector] = useState(defaultSelect[0]);
  const [scheme, setScheme] = useState(defaultSelect[0]);
  const [stateSel, setStateSel] = useState(defaultSelect[0]);

  const [markers, setMarkers] = useState([]);
  const [count, setCount] = useState(0);
  const [mapType, setMapType] = useState("roadmap"); // toggle: roadmap / satellite

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBuKxn7MCv1ziO3X820Op8LQkDVauM0fUs",
  });

  useEffect(() => {
    (async () => {
      setSectorOptions(await fetchOptions("sector"));
      setSchemeOptions(await fetchOptions("scheme"));
      setStateOptions(await fetchOptions("state"));
    })();
  }, []);

  const getMapData = useCallback(async () => {
    const params = {
      sector: sector.value,
      scheme: scheme.value,
      state: stateSel.value,
    };
    const data = await fetchMapData(params);
    const dummyMarkers = [
      { lat: 28.6139, lng: 77.209, title: "Delhi" },
      { lat: 19.076, lng: 72.8777, title: "Mumbai" },
      { lat: 13.0827, lng: 80.2707, title: "Chennai" },
      { lat: 22.5726, lng: 88.3639, title: "Kolkata" },
      { lat: 12.9716, lng: 77.5946, title: "Bengaluru" },
      { lat: 26.9124, lng: 75.7873, title: "Jaipur" },
      { lat: 23.0225, lng: 72.5714, title: "Ahmedabad" },
      { lat: 17.385, lng: 78.4867, title: "Hyderabad" },
      { lat: 25.5941, lng: 85.1376, title: "Patna" },
      { lat: 11.0168, lng: 76.9558, title: "Coimbatore" },
      { lat: 15.2993, lng: 74.124, title: "Goa" },
      { lat: 31.1048, lng: 77.1734, title: "Shimla" },
      { lat: 26.8467, lng: 80.9462, title: "Lucknow" },
      { lat: 27.1767, lng: 78.0081, title: "Agra" },
      { lat: 21.1458, lng: 79.0882, title: "Nagpur" },
      { lat: 30.7333, lng: 76.7794, title: "Chandigarh" },
      { lat: 22.7196, lng: 75.8577, title: "Indore" },
      { lat: 23.2599, lng: 77.4126, title: "Bhopal" },
      { lat: 26.1445, lng: 91.7362, title: "Guwahati" },
      { lat: 10.8505, lng: 76.2711, title: "Kerala" },
    ];
    setMarkers(dummyMarkers);
    setCount(dummyMarkers.length);
  }, [sector, scheme, stateSel]);

  useEffect(() => {
    getMapData();
  }, [getMapData]);

  const toggleMapType = (type) => setMapType(type);

  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      {/* Main */}
      <section className="grid grid-rows-[8%_84%] col-start-2 col-end-[-1] gap-8">
        {/* Filters */}
        <div className="flex justify-center items-center gap-4">
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">Sector</label>
            <Select
              options={sectorOptions}
              value={sector}
              onChange={setSector}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">
              Schemes
            </label>
            <Select
              options={schemeOptions}
              value={scheme}
              onChange={setScheme}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">States</label>
            <Select
              options={stateOptions}
              value={stateSel}
              onChange={setStateSel}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>
          <div className="text-[#2e469c] font-semibold text-lg">
            (n={count})
          </div>
        </div>

        {/* Map Section */}
        <div className="relative w-full flex justify-center items-center">
          {isLoaded ? (
            <>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={centerIndia}
                zoom={5}
                mapTypeId={mapType}
              >
                {markers.map((m, i) => (
                  <Marker
                    key={i}
                    position={{ lat: m.lat, lng: m.lng }}
                    title={m.title || ""}
                  />
                ))}
              </GoogleMap>
            </>
          ) : (
            <div className="text-center text-[#767676]">Loading Map...</div>
          )}
        </div>
      </section>
    </main>
  );
}
