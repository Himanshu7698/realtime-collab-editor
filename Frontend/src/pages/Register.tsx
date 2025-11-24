import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RegisterSchema } from "../validations";
import { useMutation } from "@tanstack/react-query";
import { SignupAPI } from "../api";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type { SignupError, SignupFormValues, SignupResponse } from "../types";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mutate } = useMutation<
    AxiosResponse<SignupResponse>,
    AxiosError<SignupError>,
    SignupFormValues
  >({
    mutationFn: SignupAPI,
    onSuccess: ({ data }: AxiosResponse) => {
      toast.success(data?.message || "Signup successfully");
      navigate("/login");
      setIsLoading(false);
    },
    onError: ({ response }: AxiosError<{ message: string }>) => {
      toast.error(response?.data?.message || "Something went wrong.");
      setIsLoading(false);
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
            DocMaster Sign Up
          </h2>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirm_password: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={(values) => mutate(values)}
          >
            {({ errors, touched }) => (
              <Form>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Enter your name"
                    className={`form-control ${errors.username && touched.username ? "border border-danger" : ""}`}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className={`form-control ${errors.email && touched.email ? "border border-danger" : ""
                      }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>

                  <div className="input-group">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      className={`form-control ${errors.password && touched.password
                        ? "border border-danger"
                        : ""
                        }`}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>

                  <div className="input-group">
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      placeholder="Enter confirm password"
                      className={`form-control ${errors.confirm_password && touched.confirm_password
                        ? "border border-danger"
                        : ""
                        }`}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>

                  <ErrorMessage
                    name="confirm_password"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>

                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <Link to={"/login"} className="text-decoration-none">
                    Log In
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
