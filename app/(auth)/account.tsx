import { Item } from "@/components/settings";
import { useStatusBar } from "@/hooks/statusBar";
import { router } from "expo-router";
import { View } from "react-native";
import { useAppStore } from "../store/useAppStore";
const Account: React.FC = () => {
 const {user} = useAppStore()
  useStatusBar("#093131", "light-content");  
 
 return (
    <View
      style={{
        marginBottom:24,
        backgroundColor: "#FFFFFF",
        // borderRadius: 16,
        marginTop:5,
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
