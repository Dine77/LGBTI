import { User, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorType("empty");
      return;
    }

    try {
      // Use POST and send credentials in the request body.
      // If your backend expects GET with query params, switch to axios.get and pass { params: { username, password } }
      const response = await axios.post("/api/login", { username, password });

      console.log("Login response:", response.data);

      const result = response.data;

      // If backend returns an object with a token (JWT), store it and redirect
      if (result && typeof result === "object" && result.token) {
        localStorage.setItem("token", result.token);
        // default redirect after successful login
        window.location.href = "/ResearchOverview";
        return;
      }

      // If backend returns a simple status string, handle legacy responses
      if (typeof result === "string") {
        const trimmed = result.trim();
        if (trimmed === "user") {
          // after successful login
          localStorage.setItem("token", result.token); // token from backend
          window.location.href = "/ResearchOverview";
          return;
        }
        if (trimmed === "Client") {
          localStorage.setItem("token", result.token); // token from backend
          window.location.href = "/ResearchOverviewC";
          return;
        }
        if (trimmed === "allow") {
          localStorage.setItem("token", result.token); // token from backend
          localStorage.setItem("statename", username);
          window.location.href = "/statewiseprogress";
          return;
        }
        if (trimmed === "notallow") {
          setErrorType("notallow");
          return;
        }
        if (trimmed === "invaild" || trimmed === "invalid") {
          setErrorType("invalid");
          return;
        }
      }

      // Fallback to server error
      setErrorType("server");
    } catch (err) {
      console.error("Login failed:", err);
      // If backend returned a 4xx with message, try to surface it
      if (err.response && err.response.data) {
        // optional: set different error types based on response
        const msg = err.response.data.message || err.response.data.error || "";
        if (msg.toLowerCase().includes("invalid")) setErrorType("invalid");
        else if (
          msg.toLowerCase().includes("not allow") ||
          msg.toLowerCase().includes("notallow")
        )
          setErrorType("notallow");
        else setErrorType("server");
      } else {
        setErrorType("server");
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Rainbow Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(./Images/rainbow-bg.png)` }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-yellow-500/10 animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B9D] via-[#00BFA5] to-[#FFD54F] rounded-3xl blur-lg opacity-75"></div>

        <div className="relative bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FFD54F]/20 to-[#FF9800]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00BFA5]/20 to-[#00897B]/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Logo Section */}
            <div className="text-center mb-6">
              <div className="inline-block rounded-2xl p-2 mb-4 shadow-xl transform hover:scale-105 transition-transform">
                <img
                  src="./Images/LGBTI.png"
                  alt="Pride Flag"
                  className="w-32 h-auto rounded-xl"
                />
              </div>
              <h2 className="bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#673AB7] bg-clip-text text-transparent px-4 leading-tight">
                LGBTI India
                <br />
                Financial Inclusion Opportunities
              </h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-purple-700 text-sm block"
                >
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] rounded-lg opacity-30 group-focus-within:opacity-60 blur transition-opacity"></div>
                  <div className="relative">
                    <div className="absolute z-20 left-3 top-1/2 -translate-y-1/2 text-purple-500">
                      <User className="w-4 h-4 text-purple-500" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E91E63] transition-all placeholder:text-purple-300"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-purple-700 text-sm block"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9C27B0] to-[#673AB7] rounded-lg opacity-30 group-focus-within:opacity-60 blur transition-opacity"></div>
                  <div className="relative">
                    <div className="absolute z-20 left-3 top-1/2 -translate-y-1/2 text-purple-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#9C27B0] transition-all placeholder:text-purple-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {errorType === "invalid" && (
                <div className="text-[#d60e2f] font-semibold text-[16px] py-2">
                  Username or Password is incorrect
                </div>
              )}
              {errorType === "notallow" && (
                <div className="text-[#d60e2f] font-semibold text-[16px] py-2">
                  There is no data for this ID
                </div>
              )}
              {errorType === "empty" && (
                <div className="text-[#d60e2f] font-semibold text-[16px] py-2">
                  Please enter both fields
                </div>
              )}
              {errorType === "server" && (
                <div className="text-[#d60e2f] font-semibold text-[16px] py-2">
                  Username or Password is incorrect
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="relative w-full mt-6 group overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#673AB7] rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B9D] via-[#B388FF] to-[#7C4DFF] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2 py-3 text-white text-sm shadow-lg transform group-hover:scale-[1.02] transition-transform">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </div>
              </button>
            </form>

            {/* Decorative Rainbow Line */}
            <div className="mt-6 pt-4 relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <div className="h-1.5 bg-gradient-to-r from-[#FF6B9D] via-[#00BFA5] to-[#FFD54F] rounded-full shadow-lg"></div>
              <div className="flex justify-center gap-1.5 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B9D] animate-pulse"></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#9C27B0] animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#00BFA5] animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-[#FFD54F] animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                ></div>
              </div>
            </div>

            {/* Ipsos Logo */}
            <div className="mt-4 flex justify-center">
              <img
                src="./Images/Ipsos logo.png"
                alt="Ipsos"
                className="h-8 hover:opacity-80 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Color Orbs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#FF6B9D] to-[#E91E63] rounded-full opacity-20 blur-xl animate-bounce"></div>
      <div
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#00BFA5] to-[#00897B] rounded-full opacity-20 blur-xl animate-bounce"
        style={{ animationDelay: "1s", animationDuration: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 right-20 w-24 h-24 bg-gradient-to-br from-[#FFD54F] to-[#FF9800] rounded-full opacity-20 blur-xl animate-bounce"
        style={{ animationDelay: "2s", animationDuration: "4s" }}
      ></div>
    </div>
  );
}
