import { Item } from "@/components/settings";
import { router } from "expo-router";
import { View } from "react-native";
import { useAppStore } from "./store/useAppStore";
const Account: React.FC = () => {
 const {user} = useAppStore()
 
 return (
    <View
      style={{
        marginTop: 8,
        marginBottom:24,
        backgroundColor: "#FFFFFF",
        // borderRadius: 16,
        overflow: "scroll",
      }}
    >
      <Item icon="person" label={user.username} />
      <Item icon="mail" label={user.email} />
      <Item icon="key" label="Change password" onPress={()=>router.push("/(auth)/changePsw")}/>
      <Item icon="call" label="Change number" onPress={()=>router.push("/(auth)/changeNumber")}/>
      <Item icon="wallet" label="Payment methods"  />
      <Item icon="settings" label="support"  />
    </View>
  );
};

export default Account;
