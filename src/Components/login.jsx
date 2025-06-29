import React, { createContext, useContext, useRef, useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
export const TokenContext = createContext();

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signUpInput, setSignUpInput] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [otp, setOTP] = useState({
    OTP: "",
    phoneNumber: "",
  });

  const [otpstatus, setOtpstatus] = useState(true);
  const { setToken } = useContext(TokenContext);

  const phoneRef = useRef();

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginInput((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignUpInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [loginError, setLoginError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  // Login API call
  const handleLogin = async () => {
    let hasError = false;

    if (loginInput.email.trim() === "") {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (loginInput.password.trim() === "") {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) return; // Stop execution if validation fails

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginInput
      );

      console.log("Login Successful:", response.data);
      await setToken(response.data.token);

      setLoginInput({ email: "", password: "" });
      setLoginError(""); // Clear previous errors if successful

      navigate("/task");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      console.log(error.response);

      if (error.response?.status === 401) {
        setLoginError("Please check your email or password.");
      } else {
        setLoginError("Invalid credentials!");
      }
    }
  };

  // Sign Up API call
  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        signUpInput
      );
      console.log("Sign Up Successful:", response.data);
      setSignUpInput({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
      });
      setIsLogin(true);
    } catch (error) {
      console.error("Sign Up Error:", error.response?.data || error.message);
    }
  };

  // Send OTP API call
  const sendOTP = async () => {
    const phone = phoneRef.current?.value; // Ensure phoneRef has a value
    console.log("Sending OTP to:", phone);

    setOTP((prevState) => ({
      ...prevState,
      phoneNumber: phoneRef.current?.value, // Update phone number
    }));

    if (!phone) {
      console.error("Error: Phone number is missing!");
      return;
    }

    setOtpstatus(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { phoneNumber: phone }
      );
      console.log("OTP Sent:", response.data);
    } catch (err) {
      console.error("OTP Error:", err);
    }
  };

  const [verified, setVerified] = useState(false);

  // verify the OTP
  const VerifyOTP = async () => {
    console.log("Sending OTP:", otp.OTP); // This is the OTP the user entered.
    console.log("Phone number:", otp.phoneNumber); // The phone number you have saved.

    // Ensure both phone and OTP are available
    if (!otp.phoneNumber) {
      console.error("Error: Phone number is missing!");
      return;
    }
    if (!otp.OTP) {
      console.error("Error: OTP is missing!");
      alert("Error: Phone number is missing!");
      return;
    }

    setOtpstatus(false); // Start the OTP verification process

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { phoneNumber: otp.phoneNumber, OTP: otp.OTP }
      );
      console.log("OTP verification response:", response.data);

      if (response.data.success) {
        setVerified(true);
      } else {
        alert("OTP is Worng!,please Enter your Currect OTP.");
      }
    } catch (err) {
      console.error("OTP Error:", err);
    }

    setOtpstatus(true); // End the OTP verification process
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {isLogin ? (
        <div className="flex flex-col items-center w-96 p-6 shadow-lg bg-gray-700 rounded-2xl">
          {/* Logo Section */}
          <header className="relative w-full h-16 flex justify-center items-center">
            <img src="react.svg" alt="Logo" className="w-12 h-12" />
          </header>

          {/* Login Input Fields */}
          <div className="flex flex-col w-full items-center gap-4 p-4 rounded-b-lg relative">
            <input
              type="email"
              placeholder="Email"
              className="input w-80 p-3 border rounded-lg outline-none"
              value={loginInput.email}
              name="email"
              onChange={handleInput}
            />
            {emailError && (
              <p className="text-[13px] text-red-400 absolute top-16 left-16">
                Enter your Email!
              </p>
            )}

            {/* Password Input with Eye Icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Password"
                className="input w-full p-3 border rounded-lg outline-none mt-2 pr-10"
                value={loginInput.password}
                name="password"
                onChange={handleInput}
              />
              {/* Eye Icon for Show/Hide */}
              <span
                className="absolute top-5.5 right-2.5 cursor-pointer text-gray-800"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
            {passwordError && (
              <p className="text-[13px] text-red-400 absolute top-34 left-16">
                Enter your Password
              </p>
            )}

            {/* Invalid Credentials Message */}
            {loginError && (
              <p className="text-[12px] text-red-400 absolute top-35">
                {loginError}
              </p>
            )}
          </div>

          {/* Login Button */}
          <div className="mt-4">
            <button
              className="bg-green-500 text-white px-10 py-2 rounded-2xl hover:bg-green-600 transition cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          {/* Switch to Sign Up */}
          <footer className="mt-2">
            <p className="text-gray-100 text-[15px]">
              Don't have an account?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-blue-300 underline pl-2 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </footer>
        </div>
      ) : (
        <div className="flex flex-col items-center w-96 p-6 shadow-lg bg-gray-700 rounded-2xl">
          {/* Logo Section */}
          <header className="relative w-full h-16 flex justify-center items-center">
            <img src="react.svg" alt="Logo" className="w-12 h-12" />
          </header>

          {/* Sign Up Input Fields */}
          <div className="flex flex-col w-full items-center gap-4 p-4 rounded-b-lg ">
            <input
              type="text"
              placeholder="Username"
              className="input w-80 p-3 rounded-lg outline-none"
              value={signUpInput.username}
              name="username"
              onChange={handleInput}
            />
            <input
              type="email"
              placeholder="Email"
              className="input w-80 p-3 border rounded-lg outline-none"
              value={signUpInput.email}
              name="email"
              onChange={handleInput}
            />
            
            {otpstatus ? (
              <div className=" relative">
                <input
                  type="number"
                  placeholder="Phone Number "
                  className="input w-80 p-3 border rounded-lg outline-none "
                  value={signUpInput.phoneNumber}
                  name="phoneNumber"
                  ref={phoneRef}
                  onChange={handleInput}
                />
                {!verified ? (
                  <button
                    className="absolute top-2.5 right-2.5 text-white bg-gray-700 p-0.5 rounded-lg shadow-md hover:bg-gray-200 hover:text-[black] "
                    onClick={sendOTP}
                  >
                    Send
                  </button>
                ) : (
                  <button className="absolute top-2.5 right-2.5 ">✅</button>
                )}
              </div>
            ) : (
              <div className=" flex flex-row gap-1">
                <input
                  type="number"
                  value={otp.OTP} // Ensure it's otp.OTP (uppercase)
                  name="OTP"
                  placeholder="Enter your OTP"
                  className="bg-gray-500 w-40 p-3 border rounded-[40px] outline-none pl-5"
                  onChange={(e) =>
                    setOTP((prevState) => ({
                      ...prevState,
                      OTP: e.target.value, // Ensure it's OTP (uppercase)
                    }))
                  }
                />
                <button
                  className="  w-20 rounded-lg shadow-md hover:bg-gray-400 text-[black] bg-gray-600"
                  onClick={VerifyOTP}
                >
                  verify
                </button>
              </div>
            )}

            <input
              type="password"
              placeholder="Password"
              className="input w-80 p-3 border rounded-lg outline-none"
              value={signUpInput.password}
              name="password"
              onChange={handleInput}
            />
          </div>

          {/* Sign Up Button */}
          <div className="mt-4">
            <button
              className="bg-green-500 text-white px-10 py-2 rounded-2xl hover:bg-green-600 transition cursor-pointer"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>

          {/* Switch to Login */}
          <footer>
            <p className="text-gray-100 text-[15px]">
              Already have an account?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="text-blue-300 underline pl-2 cursor-pointer"
              >
                Login
              </span>
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default Login;
