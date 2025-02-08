import { useState } from "react";
import LoginCard from "../Components/LoginCard";
import SignupCard from "../Components/SignupCard";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
   
        <div className="flex border-b">
          <div
            className={`w-1/2 py-3 text-center font-semibold cursor-pointer ${
              isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </div>
          <div
            className={`w-1/2 py-3 text-center font-semibold cursor-pointer ${
              !isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </div>
        </div>

        {/* Login or Signup Card */}
        <div className="mt-4">{isLogin ? <LoginCard /> : <SignupCard setIsLogin={setIsLogin} />}</div>
      </div>
    </div>
  );
};

export default Login;
