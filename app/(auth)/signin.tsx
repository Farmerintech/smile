import CountrySelectWithInput from "@/components/countries";
import { Link } from "expo-router";
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

interface FormData {
  phoneNumber: string;
}

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ phoneNumber: "" });
  const [error, setError] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (error[key]) {
      setError((prev) => ({ ...prev, [key]: "" })); // Clear error on input change
    }
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors: Partial<FormData> = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
      valid = false;
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain only digits.";
      valid = false;
    }

    setError(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("your-api-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle non-200 responses here
        const errorData = await response.json();
        console.error("Login failed:", errorData.message || response.statusText);
        // Optionally show user feedback
      } else {
        // Handle success (navigate, show message, etc.)
      }
    } catch (error) {
      console.error("Network or server error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop:80  }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 200 }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text className="text-[32px] font-bold text-center mb-2">
            Let's get you started
          </Text>
          <Text className="text-center text-gray-600">
            Please enter your phone number to login
          </Text>
        </View>

        <View className="flex flex-col gap-[12px] w-full">
          <CountrySelectWithInput
              value={formData.phoneNumber}
              onChange={(text) => handleFormChange("phoneNumber", text)}
               error={error.phoneNumber}
            />
          {/* <InputFields
            label="Phone Number"
            placeHolder="Enter your phone number"
            value={formData.phoneNumber}
            action={(text) => handleFormChange("phoneNumber", text)}
            name="phoneNumber"
            error={error?.phoneNumber || ''}
            icon="phone"
          />
 */}
          <TouchableOpacity
            className={`w-full py-[12px] rounded-[8px] mt-2 ${loading ? "bg-gray-400" : "bg-[#FF6347]"}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? "Loading..." : "Continue"}
            </Text>
          </TouchableOpacity>

         <View className="flex flex-row items-center gap-2 justify-center">
            <Text className="text-center text-sm text-gray-500">
             Never had smile account..?
             </Text>
            <Link href='/home' className="underline text-[#FF6347]">Register</Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
