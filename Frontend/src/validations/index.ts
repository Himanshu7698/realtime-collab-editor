import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .trim("Password cannot contain spaces")
});

export const RegisterSchema = Yup.object({
  username: Yup.string().min(3).max(255).required("Full name is required").trim("Full name cannot contain spaces"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password is too long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required("Confirm password is required")
    .trim("Confirm password cannot contain spaces"),
});

export const ShareSchema = Yup.object({
  role: Yup.object().required("Please select a role"),
  userid: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one user")
    .required("Select at least one user")
});
