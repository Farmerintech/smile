import CountrySelectWithInput from "@/components/countries";
import { InputFields } from "@/components/form/formInput";
import { Link } from "expo-router";
import Joi from "joi";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import "../../global.css";
import { BaseURL } from "../lib/api";

/* ===================== TYPES ===================== */
interface FormData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/* ===================== JOI SCHEMA ===================== */
const signUpSchema = Joi.object<FormData>({
  phoneNumber: Joi.string()
    .pattern(/^\d+$/)
    .min(8)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must contain only digits",
    }),

  firstName: Joi.string().min(2).required().messages({
    "string.empty": "First name is required",
  }),

  lastName: Joi.string().min(2).required().messages({
    "string.empty": "Last name is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a valid email",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

/* ===================== COMPONENT ===================== */
const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<Partial<FormData & { confirmPassword: string }>>({});
  const [loading, setLoading] = useState(false);

  /* ===================== HANDLERS ===================== */
  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (error[key]) setError((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const { error } = signUpSchema.validate(formData, { abortEarly: false });

    const newErrors: any = {};

    if (error) {
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BaseURL}/auth/registeration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration failed:", data?.message);
      } else {
        console.log("Registration successful:", data);
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#093131" }}>
      <StatusBar barStyle="light-content" />

      {/* Top */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24 }}>
        <Text className="text-[48px] font-bold text-white text-center mb-2">
          Smile
        </Text>
      </View>

      {/* Bottom */}
      <View
        style={{
          flex: 3,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 24,
          paddingTop: 32,
        }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text className="text-[30px] font-bold text-center mb-2">
            Create Account
          </Text>
          <Text className="text-center text-[16px] mb-6">
            Let’s get you started 🚀
          </Text>

          {/* Phone */}
          <CountrySelectWithInput
            value={formData.phoneNumber}
            onChange={(text: string) =>
              handleFormChange("phoneNumber", text)
            }
            error={error.phoneNumber}
          />

          <View className="flex gap-4 mt-4">
            <InputFields
              placeHolder="Email"
              value={formData.email}
              action={(v: string) => handleFormChange("email", v)}
              icon="mail"
              error={error.email}
               name=""
            />

            <InputFields
              placeHolder="First name"
              value={formData.firstName}
              action={(v: string) => handleFormChange("firstName", v)}
              icon="person"
              error={error.firstName}
              name=""
            />

            <InputFields
              placeHolder="Last name"
              value={formData.lastName}
              action={(v: string) => handleFormChange("lastName", v)}
              icon="person"
              error={error.lastName}
               name=""
            />

            <InputFields
              placeHolder="Password"
              value={formData.password}
              action={(v: string) => handleFormChange("password", v)}
              icon="key"
              // secureTextEntry
              error={error.password}
               name=""
            />

            <InputFields
              placeHolder="Confirm password"
              value={confirmPassword}
              action={(v: string) => setConfirmPassword(v)}
              icon="key"
              // secureTextEntry
               name=""
              error={error.confirmPassword}
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-full mt-6 ${
              loading ? "bg-gray-400" : "bg-[#093131]"
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4 gap-2">
            <Text className="text-gray-500 text-sm">
              Already have an account?
            </Text>
            <Link href="/" className="underline text-[#1EBA8D] text-sm">
              Login
            </Link>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
