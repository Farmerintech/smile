import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabType = "cart" | "ongoing" | "completed";

export default function Order() {
  const [activeTab, setActiveTab] = useState<TabType>("cart");

  const renderScreen = () => {
    if (activeTab === "cart") {
      return <Cart />;
    }

    if (activeTab === "ongoing") {
      return <OngoingOrder />;
    }

    if (activeTab === "completed") {
      return <CompletedOrder />;
    }

    // Fallback (never return null on web)
    return <View />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== TAB BUTTONS ===== */}
      <View style={styles.tabRow}>
        <TabButton
          title="Cart"
          active={activeTab === "cart"}
          onPress={() => setActiveTab("cart")}
        />

        <TabButton
          title="Ongoing"
          active={activeTab === "ongoing"}
          onPress={() => setActiveTab("ongoing")}
        />

        <TabButton
          title="Completed"
          active={activeTab === "completed"}
          onPress={() => setActiveTab("completed")}
        />
      </View>

      {/* ===== SCREEN CONTENT ===== */}
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
}

/* ===== TAB BUTTON ===== */

function TabButton({ title, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabBtn,
        active && styles.activeTab,
      ]}
    >
      <Text
        style={[
          styles.tabText,
          active && styles.activeText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

/* ===== STYLES ===== */

import { Text } from "react-native";
import Cart from "../(screens)/cart";
import CompletedOrder from "../(screens)/completedOrder";
import OngoingOrder from "../(screens)/ongoingOrder";

const styles = StyleSheet.create({
  container: {
    paddingTop:20,
    flex: 1,
    backgroundColor: "white",
  },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },

  activeTab: {
    borderBottomWidth: 3,
    borderColor: "#093131",
  },

  tabText: {
    color: "#666",
    fontWeight: "500",
  },

  activeText: {
    color: "#093131",
    fontWeight: "700",
  },

  content: {
    flex: 1,
  },
});
