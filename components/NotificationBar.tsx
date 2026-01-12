import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export const NotificationBar = ({ text, trigger }: { text: string, trigger: any }) => {
  const [show, setShow] = useState<boolean>(false);
  
 useEffect(() => {
  if (trigger) {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [trigger]);

  return (
    show && (
      <View className="w-[100%] px-[14px] absolute top-100 left-0 pt-5 z-10">
        <View className="px-[16px] py-[10px] bg-white/10 w-[100%] flex items-center gap-[8px] 
        rounded-[6px] border-1 border-white flex-row">
          <Ionicons
            name={'notifications-outline'}
            size={25}
            color="#22AD5C"
            style={{ marginRight: 8 }}
          />
          <Text className="text-[#294736] font-[500] text-gray-400">{text}</Text>
        </View>
      </View>
    )
  );
};
