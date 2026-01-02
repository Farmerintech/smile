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

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ phoneNumber: "" });
  const [error, setError] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const handleFormChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (error[key]) setError((prev) => ({ ...prev, [key]: "" }));
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
        const errorData = await response.json();
        console.error("Login failed:", errorData.message || response.statusText);
      } else {
        // Handle success
      }
    } catch (error) {
      console.error("Network or server error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#093131" }}>
      <StatusBar barStyle="light-content" />

      {/* Top 25% */}
      <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24 }}>
        <Text className="text-[48px] font-bold text-white text-center mb-2">
          Smile
        </Text>
        <Text className="text-[#CFEDEA] text-center text-[14px]">
        </Text>
      </View>

      {/* Bottom 75% Modal */}
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 24 }}>
            <Text className="text-[30px] font-bold text-center mb-2">
              Welcome
            </Text>
            <Text className=" text-center text-[18px]">
              Let's get you started with phone number
            </Text>
          </View>
          <View className="flex flex-col gap-4 mt-4">
            {/* Phone Input */}
            <CountrySelectWithInput
              value={formData.phoneNumber}
              onChange={(text: any) => handleFormChange("phoneNumber", text)}
              error={error.phoneNumber}
            />



            {/* Continue Button */}
            <View className="flex flex-row items-center justify-center gap-4">
              {/* SMS Button */}
              <TouchableOpacity
                className={`flex-1 py-4 rounded-full border border-gray-400`}
                onPress={handleSubmit}
                disabled={loading} // disable while loading
              >
                <Text className="text-black text-center font-semibold text-base">
                  {loading ? "Loading..." : "SMS"}
                </Text>
              </TouchableOpacity>

              {/* WhatsApp Button */}
              <TouchableOpacity
                className={`flex-1 py-4 rounded-full ${loading ? "bg-gray-400" : "bg-[#093131]"}`}
                onPress={handleSubmit}
                disabled={loading} // disable while loading
              >
                <Text className="text-white text-center font-semibold text-base">
                  {loading ? "Loading..." : "WhatsApp"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex flex-row items-center justify-center gap-2 mt-4">
              <Text className="text-gray-500 text-sm">
                Never had a Smile account?
              </Text>
              <Link href="/home" className="underline text-[#1EBA8D] text-sm">
                Register
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
