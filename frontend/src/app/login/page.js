"use client";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signin, signup } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await signin(formData.email, formData.password);
        router.push("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        const data = await signup(
          formData.name,
          formData.email,
          formData.password
        );
        // localStorage.setItem("token", data.token);
        router.push("/");
      }
      setError(""); // clear error if success
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", name: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-start max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HealthCare Pro
              </h1>
              <p className="text-sm text-gray-600">Your health, our priority</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Welcome to the
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  healthcare
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with top doctors, book appointments instantly, and
                manage your health journey with cutting-edge technology.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "🏥",
                  title: "500+ Doctors",
                  desc: "Verified professionals",
                },
                {
                  icon: "⚡",
                  title: "Instant Booking",
                  desc: "Book in seconds",
                },
                { icon: "🔒", title: "100% Secure", desc: "Your data is safe" },
                {
                  icon: "📱",
                  title: "24/7 Support",
                  desc: "Always here for you",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border-0 shadow-sm"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="font-semibold text-sm text-gray-900">
                    {feature.title}
                  </div>
                  <div className="text-xs text-gray-600">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md">
          <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome !" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Join thousands of users who trust us with their health"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-red-600 text-sm font-medium mb-2">
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 cursor-pointer">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 cursor-pointer">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <span className="text-gray-600 text-sm">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1 text-indigo-600 hover:text-indigo-800 font-semibold text-sm cursor-pointer"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>

              {!isLogin && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <button className="text-indigo-600 hover:underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button className="text-indigo-600 hover:underline">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Badge */}
          <div className="mt-6 text-center">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 px-4 py-2"
            >
              <Shield className="w-3 h-3 mr-1" />
              SSL Secured
            </Badge>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
