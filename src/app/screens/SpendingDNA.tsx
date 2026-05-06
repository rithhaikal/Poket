import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const filters = ["All", "Food", "Transport", "Entertainment", "Bills"];
const categories = [
  { name: "Food & drinks", spent: 320, budget: 350, percentage: 91, status: "warning" },
  { name: "Transport", spent: 55, budget: 120, percentage: 46, status: "safe" },
  { name: "Entertainment", spent: 180, budget: 150, percentage: 100, status: "over" },
  { name: "Groceries", spent: 115, budget: 200, percentage: 57, status: "safe" },
];

export function SpendingDNA() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", "#080111"]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginBottom: 4 }}>Spending</Text>
          <Text style={{ color: "#DCFBEF", fontSize: 14, marginBottom: 20 }}>May 2026 breakdown</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
            {filters.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <TouchableOpacity key={filter} onPress={() => setActiveFilter(filter)} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, marginRight: 8, backgroundColor: selected ? "#20E69C" : "rgba(255,255,255,0.08)", borderWidth: selected ? 0 : 1, borderColor: "rgba(255,255,255,0.16)" }}>
                  <Text style={{ color: selected ? "#071009" : "#F4ECFF", fontSize: 13, fontWeight: "900" }}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ gap: 12, marginBottom: 18 }}>
            {categories.map((category, index) => {
              const barColor = category.status === "safe" ? "#20E69C" : category.status === "warning" ? "#F6A623" : "#FF6262";
              return (
                <View key={index} style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 16 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "white", fontSize: 16, fontWeight: "900", marginBottom: 4 }}>{category.name}</Text>
                      <Text style={{ color: "#BEB3CB", fontSize: 12 }}>RM {category.spent} / RM {category.budget}</Text>
                    </View>
                    {category.status === "over" ? (
                      <View style={{ paddingHorizontal: 9, paddingVertical: 5, backgroundColor: "rgba(255,98,98,0.12)", borderRadius: 999 }}>
                        <Text style={{ color: "#FF6262", fontSize: 11, fontWeight: "900" }}>Over budget</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                    <View style={{ width: `${Math.min(category.percentage, 100)}%` as any, height: "100%", backgroundColor: barColor, borderRadius: 999 }} />
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18, marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(32,230,156,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Sparkles color="#20E69C" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#20E69C", fontSize: 13, fontWeight: "900", marginBottom: 6 }}>AI insight</Text>
                <Text style={{ color: "white", fontSize: 13, lineHeight: 20 }}>You could save RM 90/month by cooking 2 more meals at home instead of eating out.</Text>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18 }}>
            <Text style={{ color: "#BEB3CB", fontSize: 13, marginBottom: 6 }}>Your spending type</Text>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "900", marginBottom: 8 }}>Convenience Spender</Text>
            <Text style={{ color: "#BEB3CB", fontSize: 13, lineHeight: 20, marginBottom: 12 }}>Quick meals, ride-hailing, and instant delivery are your go-to choices.</Text>
            <Text style={{ color: "#20E69C", fontSize: 13, fontWeight: "900" }}>Similar users save RM 200+ by batch-cooking on weekends.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
