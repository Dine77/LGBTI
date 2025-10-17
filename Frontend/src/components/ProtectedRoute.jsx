import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        // 🚫 If no token, redirect to login
        return <Navigate to="/login" replace />;
    }

    // ✅ Otherwise, show the requested page
    return children;
};

export default ProtectedRoute;
