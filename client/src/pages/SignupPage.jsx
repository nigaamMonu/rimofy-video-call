import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderPinwheel, Eye, EyeClosed } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/Axios";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {mutate, isPending, error}= useMutation({
    mutationFn:async()=>{
      
      const response = await axiosInstance.post("/auth/signup",signupData);
      return response.data;
    },
    onSuccess:()=>queryClient.invalidateQueries({queryKey:['authUser']}),
  })
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup =  (e) => {
    e.preventDefault();
    mutate();
  };


  return (
    <div
      className="h-screen w-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      data-theme="synthwave"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden h-[90vh]">
        
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 flex flex-col justify-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <LoaderPinwheel className="size-8 sm:size-9 text-primary" />
            <span className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Rimofy
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Create an Account</h2>
              <p className="text-xs sm:text-sm opacity-70">
                Join Rimofy and start your language learning adventure
              </p>
            </div>

            {/* Full Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="input input-bordered w-full text-sm"
                placeholder="Monu Nigaam"
                value={signupData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full text-sm"
                placeholder="example@gmail.com"
                value={signupData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input input-bordered w-full text-sm pr-10"
                placeholder="Password"
                value={signupData.password}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-primary hover:text-secondary transition-colors"
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </span>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            </div>

            {/* Terms */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" required />
                <span className="text-xs leading-tight">
                  I agree to the{" "}
                  <span
                    onClick={() => navigate("/terms-of-service")}
                    className="text-primary hover:underline"
                  >
                    terms of service
                  </span>{" "}
                  and{" "}
                  <span
                    onClick={() => navigate("/privacy-policy")}
                    className="text-primary hover:underline"
                  >
                    privacy policy
                  </span>
                </span>
              </label>
            </div>

            {/* Button */}
            <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
              {isPending ? "Sigining up..." : "Create Account"}
            </button>

            {/* Already have account */}
            <div className="text-center">
              <p className="text-xs sm:text-sm">
                Already have an account?{" "}
                <Link to={"/login"} className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-primary/10 items-center justify-center p-6">
          <div className="max-w-md text-center">
            <img
              src="/Video call-amico.png"
              alt="Language connection illustration"
              className="w-full h-auto object-contain"
            />
            <h2 className="text-lg font-semibold mt-4">
              Connect with language partners worldwide
            </h2>
            <p className="opacity-70 text-sm">
              Practice conversations, make friends, and improve your language skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
