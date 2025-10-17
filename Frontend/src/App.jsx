import Login from "./pages/Login";
import MapView from "./pages/MapView";
import ResearchOverview from "./pages/ResearchOverview";
import ResearchProgress from "./pages/ResearchProgress";
import Data from "./pages/Data";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/ResearchOverview" element={<ProtectedRoute><ResearchOverview /></ProtectedRoute>} />
        <Route path="/ResearchProgress" element={<ProtectedRoute><ResearchProgress /></ProtectedRoute>} />
        <Route path="/MapView" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
        <Route path="/Data" element={<ProtectedRoute><Data /></ProtectedRoute>} />
        <Route path="/AnalyticsDashboard" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
