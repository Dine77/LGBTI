import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorType, setErrorType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorType("empty");
      return;
    }

    try {
      // Example: Adjust this URL to your backend (Express API)
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.text();

      if (result.trim() === "user") {
        window.location.href = "/ResearchOverview";
      } else if (result.trim() === "Client") {
        window.location.href = "/ResearchOverviewC";
      } else if (result.trim() === "allow") {
        localStorage.setItem("statename", username);
        window.location.href = "/statewiseprogress";
      } else if (result.trim() === "notallow") {
        setErrorType("notallow");
      } else if (result.trim() === "invaild") {
        setErrorType("invalid");
      } else {
        setErrorType("server");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setErrorType("server");
    }
  };

  return (
    <main className="w-[100vw] h-[100vh] relative flex justify-center items-center overflow-hidden font-inter">
      {/* Background Images */}
      <img
        className="absolute -top-5 w-full"
        src="./Images/Group 44.png"
        alt=""
      />
      <img
        className="absolute -bottom-20 w-full"
        src="./Images/Group 45.png"
        alt=""
      />

      {/* Login Container */}
      <div className="w-[50%] h-[55%] flex flex-row justify-center items-center">
        {/* Left Logo Box */}
        <div className="bg-white z-10 shadow-md w-[35%] h-[80%] relative flex justify-center items-center rounded-md translate-x-3">
          <img
            className="w-[60%]"
            src="./Images/NITI_Aayog_logo.png"
            alt="NITI AAYOG"
          />
          <div className="w-2 h-2 rounded-full bg-[#2e469c] absolute top-2 left-2"></div>
          <div className="w-2 h-2 rounded-full bg-[#2e469c] absolute top-2 right-2"></div>
          <div className="w-2 h-2 rounded-full bg-[#2e469c] absolute bottom-2 left-2"></div>
          <div className="w-2 h-2 rounded-full bg-[#2e469c] absolute bottom-2 right-2"></div>
        </div>

        {/* Right Form */}
        <div className="w-[40%] relative rounded-lg overflow-hidden">
          <img className="w-full" src="./Images/Untitled design.png" alt="" />
          <img
            className="absolute bottom-[7%] right-[7%]"
            src="./Images/Ipsos logo.png"
            alt=""
          />

          {/* Overlay Form */}
          <div className="w-full h-full absolute top-0 left-0 z-[100]">
            <form
              className="w-full h-full flex justify-center items-center flex-col gap-[5rem]"
              onSubmit={handleLogin}
            >
              <div className="w-full flex flex-col justify-center items-center gap-[2rem]">
                {/* Username */}
                <div className="w-[90%]">
                  <div className="w-full flex items-center justify-center">
                    <div className="w-[80%] relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full text-base border-b-2 border-gray-300 py-1 focus:border-white transition-colors focus:outline-none peer bg-inherit text-white"
                        placeholder=" "
                      />
                      <label
                        htmlFor="username"
                        className="text-lg text-white font-medium absolute -top-5 left-0 cursor-text peer-focus:text-sm peer-focus:-top-4 transition-all peer-focus:text-white peer-placeholder-shown:top-1 peer-placeholder-shown:text-lg"
                      >
                        Username
                      </label>
                      <span className="absolute right-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#FFFFFF"
                        >
                          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="w-[90%]">
                  <div className="w-full flex items-center justify-center">
                    <div className="w-[80%] relative">
                      <input
                        id="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-base border-b-2 border-gray-300 py-1 focus:border-white transition-colors focus:outline-none peer bg-inherit text-white"
                        placeholder=" "
                      />
                      <label
                        htmlFor="Password"
                        className="text-white font-medium absolute -top-5 text-lg left-0 cursor-text peer-focus:text-sm peer-focus:-top-4 transition-all peer-focus:text-white peer-placeholder-shown:top-1 peer-placeholder-shown:text-lg"
                      >
                        Password
                      </label>
                      <span className="absolute right-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#FFFFFF"
                        >
                          <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
                        </svg>
                      </span>

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
                          Server error. Please try again.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="rounded-md flex flex-row justify-center items-center gap-5 bg-white px-3 py-2 cursor-pointer"
                >
                  <label className="font-medium text-[#2e469c] text-lg cursor-pointer">
                    Login
                  </label>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
