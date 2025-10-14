import Login from "./components/Login";
import MapView from "./pages/MapView";
import ResearchOverview from "./pages/ResearchOverview";
import ResearchProgress from "./pages/ResearchProgress";
import Data from "./pages/Data";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ResearchOverview" element={<ResearchOverview />} />
        <Route path="/ResearchProgress" element={<ResearchProgress />} />
        <Route path="/MapView" element={<MapView />} />
        <Route path="/Data" element={<Data />} />
        <Route path="/AnalyticsDashboard" element={<AnalyticsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
