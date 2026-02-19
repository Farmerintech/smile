import { router } from "expo-router";
import Joi from "joi";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";

import { NotificationBar } from "@/components/NotificationBar";
import "../../global.css";
import { BaseURL } from "../lib/api";

/* ===================== TYPES ===================== */
interface FormData {
  phoneNumber: string;
  lastName: string;
  firstName:string;
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

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
});

/* ===================== COMPONENT ===================== */
const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    firstName: "",
    lastName:"",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<
    Partial<FormData & { confirmPassword: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);

  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value}));
    if (error[key]) setError((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const { error } = signUpSchema.validate(formData, {
      abortEarly: false,
    });

    if (!error) {
      setError({});
      return true;
    }

    const newErrors: Partial<FormData> = {};
    error.details.forEach((detail) => {
      const key = detail.path[0] as keyof FormData;
      newErrors[key] = detail.message;
    });

    setError(newErrors);
    setMessage(Object.values(newErrors)[0]); // show first error in notification
    setShowNotification(true);
    return false;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BaseURL}/auth/user/registeration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      const msg =
  Array.isArray(data?.message) ? data.message.join(", ") : String(data?.message);

      console.log(msg)
      setMessage(msg)
      setShowNotification(true);

      if (response.ok) {
        router.push("/(auth)/signin");
      }
    } catch (err) {
      // setMessage(msg);
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#093131" }}>
      <StatusBar barStyle="light-content" backgroundColor={"#093131"} />
{message !== "" && showNotification && (
        <NotificationBar
          trigger={showNotification}
          text={message}
          onHide={() => setShowNotification(false)}
        />
      )}
      {/* Top */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24 }}>
        <Text className="text-[48px] font-bold text-white text-center mb-2">
          Smile
        </Text>
      </View>

      {/* Bottom */}
      <View
        style={{
          flex: 4,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 24,
          paddingTop: 32,
        }}
      >
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={Platform.OS === "ios" ? 20 : 50}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text className="text-[30px] font-bold text-center mb-2">
            Create Account
          </Text>
          <Text className="text-center text-[16px] mb-6">
            Let’s get you started 🚀
          </Text>
          <Text>{message}</Text>

          {/* Phone */}
          <Input
            label="Phone number"
            icon="call"
            value={formData.phoneNumber}
            onChangeText={(v:any) => handleFormChange("phoneNumber", v)}
          />

          <View className="flex gap-4 mt-4">
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(v: string) => handleFormChange("email", v)}
              icon="mail"
              error={error.email}
              name="mail"
            />

            <Input
              label="First name"
              value={formData.firstName}
              onChangeText={(v: string) => handleFormChange("firstName", v)}
              icon="person"
              error={error.firstName}
              name="username"
            />
  <Input
              label="Last name"
              value={formData.lastName}
              onChangeText={(v: string) => handleFormChange("lastName", v)}
              icon="person"
              error={error.lastName}
              name="username"
            />
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(v: string) => handleFormChange("password", v)}
              icon="key"
              error={error.password}
              name="password"
            />

            <Input
              label="Confirm password"
              value={confirmPassword}
              onChangeText={(v: string) => setConfirmPassword(v)}
              icon="key"
              error={error.confirmPassword}
              name="cpsw"
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
            <TouchableOpacity onPress={()=>router.replace("/(auth)/signin")} >
                <Text className="underline text-green-600 text-sm">Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;



export const Input = (props:any) => (
  <TextInput
    mode="outlined"
    style={styles.input}
    activeOutlineColor="#2c5364"
    theme={{ roundness: 12 }}
    {...props}
  />
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    marginTop: 40,
    elevation: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#2c5364",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 25,
  },

  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  btn: {
    backgroundColor: "#2c5364",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  /* Modal */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },

  modalItem: {
    paddingVertical: 12,
    alignItems: "center",
  },

  modalText: {
    fontSize: 16,
  },

  modalCancel: {
    marginTop: 10,
    alignItems: "center",
  },
});


