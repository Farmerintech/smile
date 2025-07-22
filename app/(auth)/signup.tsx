import CountrySelectWithInput from "@/components/countries";
import { FormDatePicker } from "@/components/form/datePicker";
import { InputFields } from "@/components/form/formInput";
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

const SignUp: React.FC = () => {
  interface formDataTypes {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPSW: string;
    gender: string;
    dateOfBirth: Date | null;
  }
interface errorTypes {
      firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPSW: string;
    gender: string;
    dateOfBirth: string
}
  const [formData, setFormdata] = useState<formDataTypes>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPSW: "",
    gender: "",
    dateOfBirth: null,
  });

  const [error, setError] = useState<errorTypes>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPSW: "",
    gender: "",
    dateOfBirth: "",
  } as any);

  const [loading, setLoading] = useState<boolean>();

  const handleForm = (key: keyof formDataTypes, value: any) => {
    setFormdata((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    Object.keys(formData).forEach((key) => {
      const k = key as keyof formDataTypes;
      if (!formData[k]) {
        setError((prev) => ({
          ...prev,
          [k]: `${k} should not be empty`,
        }));
        setLoading(false);
      } else {
        setError((prev) => ({ ...prev, [k]: "" }));
      }
    });

    if (!/^\d+$/.test(formData.phoneNumber)) {
      setError((prev) => ({
        ...prev,
        phoneNumber: "Only numbers allowed",
      }));
      setLoading(false);
    }

    if (formData.password.length < 8) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      setLoading(false);
    }

    if (formData.password !== formData.confirmPSW) {
      setError((prev) => ({
        ...prev,
        password: "Passwords do not match",
        confirmPSW: "Passwords do not match",
      }));
      setLoading(false);
    }

    try {
      const res = await fetch("url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // handle error
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 80 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 200,
        }}
      >
        <View style={{ marginBottom: 24 }}>
          <Text className="text-[32px] font-bold text-center mb-2">
            Let's get you started
          </Text>
          <Text className="text-center text-gray-600 text-[16px]">
            Please fill the form with your details correctly
          </Text>
        </View>

        <View className="flex flex-col gap-[12px] w-full">
          <CountrySelectWithInput
            value={formData.phoneNumber}
            onChange={(text) => handleForm("phoneNumber", text)}
            error={error.phoneNumber}
          />
          <InputFields
            label="Email"
            placeHolder=""
            value={formData?.email}
            action={(text) => handleForm("email", text)}
            name="Email"
            error={error?.email}
            icon="email"
          />
          <View className="flex-row gap-[12px] w-full">
            <View className="flex-1">
              <InputFields
                label="First Name"
                placeHolder=""
                value={formData?.firstName}
                action={(text) => handleForm("firstName", text)}
                name="First Name"
                error={error?.firstName}
                icon="account"
              />
            </View>
            <View className="flex-1">
              <InputFields
                label="Last Name"
                placeHolder=""
                value={formData?.lastName}
                action={(text) => handleForm("lastName", text)}
                name="Last Name"
                error={error?.lastName}
                icon="account"
              />
            </View>
          </View>

          <View className="flex-row gap-[12px] w-full">
            <View className="flex-1">
              <FormDatePicker
                label="Date of Birth"
                icon="calendar"
                error={error?.dateOfBirth || ""}
                value={formData.dateOfBirth}
                onChange={(date: Date) => handleForm("dateOfBirth", date)}
              />
            </View>
          </View>

          <Text className="text-center text-sm text-gray-500 mt-4 text-sm">
            By signing up you agree to our terms of use and services
          </Text>
          <TouchableOpacity
            className="w-full bg-[#FF6347] py-[12px] rounded-[8px] mt-2 "
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-semibold text-base">
              Continue
            </Text>
          </TouchableOpacity>
          <View className="flex flex-row items-center gap-2 justify-center">
            <Text className="text-center text-sm text-gray-500">
              Already have an account..?
            </Text>
            <Link href="/signin" className="underline text-[#FF6347]">
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
