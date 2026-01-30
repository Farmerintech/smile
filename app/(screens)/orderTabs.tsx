import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppText } from "../_layout";

type TabsProps = {
  activeTab: "ongoing" | "completed" | "cancelled";
  setActiveTab: (tab: "ongoing" | "completed" | "cancelled") => void;
};
export const OrderTabs = ({
  activeTab,
  setActiveTab,
}: TabsProps) => {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        onPress={() => setActiveTab("ongoing")}
        style={[
          styles.tab,
          activeTab === "ongoing" && styles.tabActive,
        ]}
      >
        <AppText
          style={[
            styles.tabText,
            activeTab === "ongoing" &&
              styles.tabTextActive,
          ]}
        >
          Ongoing Orders
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab("completed")}
        style={[
          styles.tab,
          activeTab === "completed" && styles.tabActive,
        ]}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "completed" &&
              styles.tabTextActive,
          ]}
        >
          Completed Orders
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* ---------------------------- */
/* Styles */
/* ---------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  timeline: {
    width: 30,
    alignItems: "center",
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: {
    borderColor: "#093131",
    borderWidth: 2,
    backgroundColor: "#E6F2F2",
  },
  dotInactive: {
    borderColor: "#D1D5DB",
    borderWidth: 2,
  },
  connector: {
    width: 2,
    height: 40,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    marginTop: 6,
  },
  connectorActive: {
    borderColor: "#093131",
  },
  content: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  titleActive: {
    color: "#111827",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  completedText: {
    fontSize: 16,
    color: "#16A34A",
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#111827",
    fontWeight: "600",
  },
});
