import { Item } from "@/components/settings";
import { View } from "react-native";

const Account: React.FC = () => {
 
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
      <Item icon="person-outline" label="Yakub" />
      <Item icon="mail" label="farmerintech@gmail.com" />
      <Item icon="key" label="Change password" />
      <Item icon="phone" label="Change number" />
      <Item icon="wallet" label="Payment methods"  />
      <Item icon="settings" label="support"  />
    </View>
  );
};

export default Account;
