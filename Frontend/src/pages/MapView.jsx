import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const containerStyle = {
  width: "100%",
  height: "82vh",
};

const centerIndia = { lat: 22.5937, lng: 78.9629 };
const defaultSelect = [{ value: "All", label: "All" }];

const fetchOptions = async (col, filters = {}) => {
  try {
    const res = await axios.get(`/api/options`, {
      params: { col, ...filters },
      headers: { "Cache-Control": "no-cache" },
    });

    const arr = Array.isArray(res.data) && res.data.length ? res.data : [];
    const mapped = arr.map((v) =>
      typeof v === "object" ? v : { value: v, label: v }
    );

    return [{ value: "All", label: "All" }, ...mapped];
  } catch (e) {
    console.warn("fetchOptions error", col, e);
    return [defaultSelect];
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
  const [cityOptions, setCityOptions] = useState(defaultSelect);
  const [areaOptions, setAreaOptions] = useState(defaultSelect);

  const [city, setCity] = useState(defaultSelect[0]);
  const [area, setArea] = useState(defaultSelect[0]);

  const [markers, setMarkers] = useState([]);
  const [count, setCount] = useState(0);
  const [mapType, setMapType] = useState("roadmap");

  // ✅ new states for dynamic map movement
  const [mapCenter, setMapCenter] = useState(centerIndia);
  const [zoom, setZoom] = useState(5);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBuKxn7MCv1ziO3X820Op8LQkDVauM0fUs",
  });

  // 🔹 Load dropdown options initially
  useEffect(() => {
    (async () => {
      const cityOpts = await fetchOptions("District");
      const areaOpts = await fetchOptions("T_Area");
      setCityOptions(cityOpts);
      setAreaOptions(areaOpts);
    })();
  }, []);

  // 🔹 When City changes → refresh Area options
  useEffect(() => {
    (async () => {
      const filters = { District: city?.value || "All" };
      const areaOpts = await fetchOptions("T_Area", filters);
      setAreaOptions(areaOpts);
    })();
  }, [city]);

  // 🔹 When Area changes → refresh City options
  useEffect(() => {
    (async () => {
      const filters = { T_Area: area?.value || "All" };
      const cityOpts = await fetchOptions("District", filters);
      setCityOptions(cityOpts);
    })();
  }, [area]);

  // 🔹 Fetch and update map markers
  const getMapData = useCallback(async () => {
    const params = {
      District: city.value,
      T_Area: area.value,
    };

    const data = await fetchMapData(params);
    const fetchedMarkers = data.markers || [];
    setMarkers(fetchedMarkers);
    setCount(fetchedMarkers.length);

    // ✅ Auto-move map to selected city/area if markers exist
    if (fetchedMarkers.length > 0) {
      const avgLat =
        fetchedMarkers.reduce((sum, m) => sum + m.lat, 0) /
        fetchedMarkers.length;
      const avgLng =
        fetchedMarkers.reduce((sum, m) => sum + m.lng, 0) /
        fetchedMarkers.length;

      setMapCenter({ lat: avgLat, lng: avgLng });

      // ✅ Zoom in when City OR Area is filtered
      if (city.value !== "All" || area.value !== "All") {
        setZoom(10);
      } else {
        setZoom(6);
      }
    } else {
      setMapCenter(centerIndia);
      setZoom(5);
    }
  }, [city, area]);

  // 🔹 Refresh map when filters change
  useEffect(() => {
    getMapData();
  }, [getMapData]);

  return (
    <main className="grid grid-cols-[9vw_90vw] grid-rows-[7vh_93vh] font-inter">
      <Header />
      <Sidebar />

      {/* Main Section */}
      <section className="grid grid-rows-[8%_84%] col-start-2 col-end-[-1] gap-8">
        {/* Filters */}
        <div className="flex justify-center items-center gap-4">
          {/* City */}
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">City</label>
            <Select
              options={cityOptions}
              value={city}
              onChange={setCity}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>

          {/* Area */}
          <div className="w-[15%] text-center">
            <label className="text-lg font-medium text-[#2e469c]">
              Type of Area
            </label>
            <Select
              options={areaOptions}
              value={area}
              onChange={setArea}
              styles={{ menu: (s) => ({ ...s, zIndex: 9999 }) }}
            />
          </div>

          {/* Count */}
          <div className="text-[#2e469c] font-semibold text-lg">
            (n={count})
          </div>
        </div>

        {/* Map */}
        <div className="relative w-full flex justify-center items-center">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={zoom}
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
          ) : (
            <div className="text-center text-[#767676]">Loading Map...</div>
          )}
        </div>
      </section>
    </main>
  );
}
