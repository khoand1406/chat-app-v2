import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useNavigate} from "react-router";
import { loginUser } from "../services/authServices";
// Validation functions
export const validateUsername = (username: string): string => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!username) return "Email hoặc số điện thoại không được để trống.";
  if (!emailRegex.test(username) && !phoneRegex.test(username))
    return "Email hoặc số điện thoại không hợp lệ.";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Mật khẩu không được để trống.";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
  return "";
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    const usernameError = validateUsername(formData.email);
    const passwordError = validatePassword(formData.passwordHash);

    if (usernameError || passwordError) {
      setErrors({ username: usernameError, password: passwordError });
      toast.error("Vui lòng kiểm tra lại thông tin đăng nhập.");
      return;
    }

    setIsLoading(true);
    try {   
      const response = await loginUser(formData);
      if (response.token) {
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("fullName", response.user.userName);
        localStorage.setItem("userId", response.user.id.toString());
        setShowLoadingModal(true); 
        setTimeout(() => {
          setShowLoadingModal(false);
          toast.success("Login Success"); 
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error("Đăng nhập thất bại: Không nhận được token.");
      }
    } catch (error: any) {
      toast.error(`${error.message}`);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3"
            alt="Login background"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 lg:p-12 animate-fadeIn">
          <div className="text-center mb-10">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 mb-2">
              WELCOME BACK!
            </h2>
            <p className="text-sm text-gray-600">
              PLEASE LOGIN INTO YOUR ACCOUNT
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                 Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập mật khẩu của bạn"
                  value={formData.passwordHash}
                  onChange={(e) =>
                    setFormData({ ...formData, passwordHash: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>

      {/* Modal loading */}
      {showLoadingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-gray-800">
              Please wait...
            </p>
          </div>
        </div>
      )}

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;