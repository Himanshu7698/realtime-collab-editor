const Joi = require("joi");

const RegisterSchema = Joi.object({
    username: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
            "string.empty": "UserName is required",
            "any.required": "UserName is required"
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .trim()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .messages({
            "string.pattern.base":
                "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one number.",
        })
        .required()
        .label("Password"),
    confirm_password: Joi.string()
        .trim()
        .valid(Joi.ref("password"))
        .messages({
            "any.only":
                "The confirmed password does not match the original password.",
        })
        .required()
        .label("Confirm Password"),
});

const LoginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),
    password: Joi.string().trim().required("Password"),
});

const createAndUpdateDocumentSchema = Joi.object({
    title: Joi.string().max(255).trim().required("Title"),
    content: Joi.string().trim().required("Content"),
});

module.exports = {
    LoginSchema,
    RegisterSchema,
    createAndUpdateDocumentSchema,
}