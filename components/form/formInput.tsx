import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import "../../global.css";

interface InputFieldsProps {
  label?: string;          // optional now
  name: string;
  value: string;
  placeHolder: string;
  action: (text: string) => void;
  error?: string;          // optional
  icon?: any;
}

export const InputFields: React.FC<InputFieldsProps> = ({
  label,
  name,
  value,
  placeHolder,
  action,
  error = "",
  icon,
}) => {
  const [showPsw, setShowPsw] = useState<boolean>(true);

  return (
    <View className="flex-col gap-[5px] w-full">
      {/* Render label only if provided */}
      {label ? (
        <Text className="text-[16px] font-[600] text-gray-800">{label}</Text>
      ) : null}

<View
  className="flex justify-between items-center flex-row p-4 py-6 text-black rounded-full"
  style={{
    borderWidth: 3,
    borderColor: error.trim() !== "" ? "#F87171" : "#E9EAEB",
  }}
>


        <View className="flex items-center justify-between flex-row gap-[8px] flex-1">
          {/* Show icon for fields except phone number */}
          {name && name !== "Phone Number" && icon && (
            <MaterialCommunityIcons name={icon} size={15} />
          )}

          <TextInput
            placeholder={placeHolder}
            value={value}
            secureTextEntry={name === "Password" && !showPsw}
            onChangeText={action}
            keyboardType={name === "Phone Number" ? "phone-pad" : "default"}
            className="w-full outline-none border-none"
          />
        </View>

        {/* Password toggle */}
        {name === "Password" && (
          <TouchableOpacity onPress={() => setShowPsw(!showPsw)}>
            <MaterialCommunityIcons
              name={showPsw ? "eye" : "eye-off"}
              size={15}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error ? (
        <Text className="text-[10px] italic text-red-500 font-serif">{error}</Text>
      ) : null}
    </View>
  );
};

interface SearchInputProps {
  name?: string;
  icon?: any;
  value: string;
  error?: string;
  placeHolder?: string;
  action: (text: string) => void;
  style?: any;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  action,
  style,
  placeHolder = "Search",
}) => {
  return (
    <View
      className={`flex justify-between items-center flex-row bg-[#1F2A370D] min-h-14 p-4 py-1 text-black rounded-[7px]`}
      style={style}
    >
      <View className="flex-1 items-center justify-between flex-row gap-[8px]">
        <MaterialCommunityIcons name={"magnify"} size={25} />
        <TextInput
          placeholder={placeHolder}
          value={value}
          onChangeText={action}
          className="w-full outline-none border-none"
        />
      </View>

      <TouchableOpacity className="flex items-center justify-center">
        <MaterialCommunityIcons name={"tune"} size={25} />
      </TouchableOpacity>
    </View>
  );
};
