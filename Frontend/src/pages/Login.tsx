import { useState } from "react";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema } from "../validations";
import { LoginAPI } from "../api";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import type { LoginError, LoginFormValues, LoginResponse } from "../types";

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mutate } = useMutation<
    AxiosResponse<LoginResponse>,
    AxiosError<LoginError>,
    LoginFormValues
  >({
    mutationFn: LoginAPI,
    onSuccess: ({ data }) => {
      console.log(data)
      toast.success(data?.message || "Logged in successfully");
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data?.user?._id);
      }
      navigate("/");
      setIsLoading(false);
    },
    onError: ({ response }) => {
      toast.error(response?.data?.message || "Something went wrong.");
      setIsLoading(false);
    },
  });

  const form = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      mutate(values);
    },
  });

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="col-lg-5 col-md-7">
        <div className="card custom-card p-4">
          <h2 className="card-title text-center text-primary mb-4">
            DocMaster Login
          </h2>

          {/* === Form === */}
          <form onSubmit={form.handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className={`form-control ${form.errors.email && form.touched.email ? "border-danger" : ""
                  }`}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                value={form.values.email}
              />
              {form.errors.email && form.touched.email && (
                <div className="text-danger mt-1">{form.errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`form-control ${form.errors.password && form.touched.password
                    ? "border-danger"
                    : ""
                    }`}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  value={form.values.password}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              {form.errors.password && form.touched.password && (
                <div className="text-danger mt-1">{form.errors.password}</div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link to={"/register"} className="text-decoration-none">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
