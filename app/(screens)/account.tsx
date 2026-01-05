import { Item } from "@/components/settings";
import { View } from "react-native";

const Account: React.FC = () => {
 
 return (
    <View
      style={{
        marginTop: 12,
        marginBottom:24,
        backgroundColor: "#FFFFFF",
        // borderRadius: 16,
        overflow: "scroll",
      }}
    >
      <Item icon="receipt-outline" label="Order History" />
      <Item icon="person-outline" label="Account" />
      <Item icon="notifications-outline" label="Notifications" />
      <Item icon="trash-outline" label="Delete my account" danger />
      <Item icon="log-out-outline" label="Logout" danger />
    </View>
  );
};

export default Account;
