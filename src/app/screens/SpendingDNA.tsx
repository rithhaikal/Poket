import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSpendingInsight, SpendingInsight } from "../../services/smartAdvice";
import { TextShimmer } from "../components/TextShimmer";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../theme";

const filters = ["All", "Food & drinks", "Transport", "Entertainment", "Shopping", "Health"];

const currentMonthYear = new Date().toLocaleString("en-MY", { month: "long", year: "numeric" });

export function SpendingDNA() {
  const C = useTheme();
  const { categorySpending } = useAppContext();
  const [activeFilter, setActiveFilter] = useState("All");
  const [aiData, setAiData] = useState<SpendingInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpendingInsight(categorySpending)
      .then(setAiData)
      .finally(() => setLoading(false));
  }, [categorySpending]);

  return (
    <LinearGradient colors={C.gradientColors as any} locations={C.gradientLocations as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: "900", marginBottom: 4 }}>Spending</Text>
          <Text style={{ color: C.textSoft, fontSize: 14, marginBottom: 20 }}>{currentMonthYear} breakdown</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
            {filters.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <TouchableOpacity key={filter} onPress={() => setActiveFilter(filter)} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, marginRight: 8, backgroundColor: selected ? C.primary : C.card, borderWidth: selected ? 0 : 1, borderColor: C.border }}>
                  <Text style={{ color: selected ? "white" : C.textSoft, fontSize: 13, fontWeight: "900" }}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ gap: 12, marginBottom: 18 }}>
            {categorySpending
              .filter(cat => activeFilter === "All" || cat.name === activeFilter)
              .map((category, index) => {
              const barColor = category.status === "safe" ? C.primary : category.status === "warning" ? C.amber : C.danger;
              return (
                <View key={index} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 16 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: C.text, fontSize: 16, fontWeight: "900", marginBottom: 4 }}>{category.name}</Text>
                      <Text style={{ color: C.textMuted, fontSize: 12 }}>RM {category.spent} / RM {category.budget}</Text>
                    </View>
                    {category.status === "over" ? (
                      <View style={{ paddingHorizontal: 9, paddingVertical: 5, backgroundColor: "rgba(255,98,98,0.12)", borderRadius: 999 }}>
                        <Text style={{ color: C.danger, fontSize: 11, fontWeight: "900" }}>Over budget</Text>
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

          {/* AI Insight */}
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 18, marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" }}>
                <Sparkles color={C.primary} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.primary, fontSize: 13, fontWeight: "900", marginBottom: 6 }}>AI insight</Text>
                {loading ? (
                  <TextShimmer lines={2} />
                ) : (
                  <Text style={{ color: C.text, fontSize: 13, lineHeight: 20 }}>{aiData?.insight}</Text>
                )}
              </View>
            </View>
          </View>

          {/* AI Spending Personality */}
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 18 }}>
            <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 6 }}>Your spending type</Text>
            {loading ? (
              <View style={{ marginBottom: 12 }}>
                <TextShimmer lines={3} />
              </View>
            ) : (
              <>
                <Text style={{ color: C.text, fontSize: 20, fontWeight: "900", marginBottom: 8 }}>{aiData?.spendingType}</Text>
                <Text style={{ color: C.textMuted, fontSize: 13, lineHeight: 20, marginBottom: 12 }}>{aiData?.spendingDescription}</Text>
                <Text style={{ color: C.primary, fontSize: 13, fontWeight: "900" }}>{aiData?.peerComparison}</Text>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
