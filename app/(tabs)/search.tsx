// screens/Search.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";
import { AppText } from "../_layout";
import { BaseURL } from "../lib/api";
import { useAppStore } from "../store/useAppStore";


const Search = () => {
  const { user } = useAppStore();
  const params = useLocalSearchParams();
const keywordFromParams = Array.isArray(params.keyword) 
  ? params.keyword[0] 
  : params.keyword || "";
  const [search, setSearch] = useState(keywordFromParams);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔎 Search API call
  const fetchSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setStores([]);
      setProducts([]);
      return;
    }

    try {
      setLoading(true);

      const token = user?.token;
      const res = await fetch(`${BaseURL}/products/search?keyword=${encodeURIComponent(keyword)}`, {
        method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 required
      },
        
      });

      const json = await res.json();

      if (json.success) {
  setStores(json.data.stores || []);
  setProducts(json.data.products || []);
}
    } catch (err) {
      console.log("Search error", err);
      setStores([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Trigger search when typing (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  // 🔎 Trigger search if navigated from a vendor
  useEffect(() => {
    if (keywordFromParams) {
      fetchSearch(keywordFromParams);
    }
  }, [keywordFromParams]);

  // Merge results for FlatList
  const mergedResults = [
    ...stores.map((s) => ({ ...s, type: "store" })),
    ...products.map((p) => ({ ...p, type: "product" })),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: 40 }}>
      {/* Search Bar */}
      <View style={{ paddingHorizontal: 18 }}>
        <View
          className="flex-row items-center shadow rounded-[20px] px-4 py-3 mb-4"
          style={{ backgroundColor: "#F1F5F9" }}
        >
          <Ionicons name="search-outline" size={20} color="#6B7280" />

          <TextInput
            className="flex-1 mx-3 text-[15px]"
            placeholder="Search vendors or products..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={{ color: "#1A1A1A" }}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B35" />
      ) : (
        <FlatList
          data={mergedResults}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          ListHeaderComponent={
            search ? (
              <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                <AppText style={{ fontSize: 14 }}>
                  {mergedResults.length} Results for "{search}"
                </AppText>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#E5E7EB",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: item.type === "store" ? 12 : 0,
                marginBottom: item.type === "store" ? 12 : 0,
              }}
              onPress={() => {
                if (item.type === "store") {
                  // Navigate to search with vendor name
                  router.push(`/search?keyword=${encodeURIComponent(item.name)}`);
                } else {
                  // Optionally handle product click
                }
              }}
            >
              {/* Image */}
              <Image
                source={{
                  uri:
                    item.type === "store"
                      ? item.coverImage || "https://via.placeholder.com/50"
                      : item.imageUrl || "https://via.placeholder.com/50",
                }}
                style={{ width: 50, height: 50, borderRadius: 12 }}
              />

              {/* Info */}
              <View style={{ marginLeft: 12, flex: 1 }}>
                <AppText
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  {item.name}
                </AppText>

                {item.type === "product" && (
                  <AppText
                    style={{
                      fontSize: 13,
                      marginTop: 2,
                      color: "#6B7280",
                    }}
                  >
                    ₦{item.price}
                  </AppText>
                )}
              </View>

              <MaterialIcons
                name="favorite-outline"
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            search ? (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <AppText>No results found</AppText>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default Search;