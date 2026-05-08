import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Sparkles } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { getStreakMotivation, StreakMotivation } from "../../services/smartAdvice";
import { StreakDayCircle } from "../components/StreakDayCircle";
import { TextShimmer } from "../components/TextShimmer";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../theme";



const personalBest = 21;
const todayIndex = 10;

const dayLetters = ["S", "M", "T", "W", "T", "F", "S"];

// Dynamically generate the calendar so "Today" always perfectly matches the real-world day of the week during the pitch!
const weekHistory = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (todayIndex - i));
  return {
    day: dayLetters[d.getDay()],
    done: i <= todayIndex, // past days are 'done', future days are blank
  };
});

export function StreakTracker() {
  const C = useTheme();
  const { totalSpent, budgetLimit } = useAppContext();
  const [aiData, setAiData] = useState<StreakMotivation | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRecovered, setHasRecovered] = useState(false);

  // For the demo: totalSpent starts at 177.5. GrabFood (+32.5) -> 210. 
  // Shopee 1 (+85) -> 295. Shopee 2 (+85) -> 380. 
  // We want it to break on Shopee 2, so threshold is 300.
  const isBroken = totalSpent > 300 && !hasRecovered;
  const currentStreak = isBroken ? 0 : 11;
  const todayBudgetUsed = isBroken ? 115 : 67;

  const budgetBarColor =
    todayBudgetUsed < 70 ? C.primary : todayBudgetUsed < 90 ? C.amber : C.danger;

  useEffect(() => {
    getStreakMotivation(currentStreak, personalBest)
      .then(setAiData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <LinearGradient colors={C.gradientColors as any} locations={C.gradientLocations as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: "900", marginBottom: 4 }}>Daily Streak</Text>
          <Text style={{ color: C.textSoft, fontSize: 14, marginBottom: 20 }}>Stay within budget every day</Text>

          {/* Big streak display */}
          <View style={{ backgroundColor: isBroken ? C.card : C.primarySoft, borderRadius: 24, padding: 28, alignItems: "center", marginBottom: 16 }}>
            <Flame color={isBroken ? C.textMuted : C.primary} size={36} />
            <Text style={{ color: isBroken ? C.textMuted : C.primary, fontSize: 60, fontWeight: "900", lineHeight: 72, marginTop: 8 }}>{currentStreak}</Text>
            <Text style={{ color: C.text, fontSize: 15, fontWeight: "700" }}>day streak</Text>
            <Text style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>Personal best: {personalBest} days</Text>
          </View>

          {/* Day circles grid */}
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 16, marginBottom: 16 }}>
            <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 14 }}>Last 14 days</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
              {weekHistory.slice(0, 7).map((item, index) => (
                <StreakDayCircle key={index} day={item.day} done={index === todayIndex ? !isBroken : item.done} isToday={index === todayIndex} />
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {weekHistory.slice(7, 14).map((item, index) => (
                <StreakDayCircle key={index + 7} day={item.day} done={(index + 7) === todayIndex ? !isBroken : item.done} isToday={(index + 7) === todayIndex} />
              ))}
            </View>
          </View>

          {/* Today's budget */}
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
              <Text style={{ color: C.textMuted, fontSize: 12 }}>Today's budget</Text>
              <Text style={{ color: budgetBarColor, fontSize: 12, fontWeight: "900" }}>{todayBudgetUsed}%</Text>
            </View>
            <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
              <View style={{ width: `${todayBudgetUsed}%` as any, height: "100%", backgroundColor: budgetBarColor, borderRadius: 999 }} />
            </View>
          </View>

          {/* Recovery mode */}
          {isBroken ? (
            <View style={{ backgroundColor: "rgba(255,98,98,0.1)", borderWidth: 1, borderColor: C.danger, borderRadius: 20, padding: 16, marginBottom: 16 }}>
              <Text style={{ color: C.danger, fontWeight: "900", fontSize: 14, marginBottom: 6 }}>Streak Frozen 🧊</Text>
              <Text style={{ color: C.text, fontSize: 12, lineHeight: 18, marginBottom: 12 }}>
                You exceeded your daily budget. Your 11-day streak is frozen. Stay under a lighter Recovery Budget (RM 30/day) for the next 3 days to thaw your flame and get back on track!
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Recovery Sprint Activated!", "Your daily budget is temporarily lowered to RM 30. Complete 3 days of safe spending to restore your 11-day streak!");
                  setHasRecovered(true);
                }}
                style={{ backgroundColor: C.danger, paddingVertical: 12, borderRadius: 16, alignItems: "center" }}
              >
                <Text style={{ color: "white", fontWeight: "900" }}>Start 3-Day Sprint</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ backgroundColor: "rgba(246,166,35,0.08)", borderWidth: 1, borderColor: C.amber, borderRadius: 20, padding: 16, marginBottom: 16 }}>
              <Text style={{ color: C.amber, fontWeight: "900", fontSize: 14, marginBottom: 6 }}>Recovery Mode</Text>
              <Text style={{ color: C.textMuted, fontSize: 12, lineHeight: 18 }}>
                If you miss a day, we don't reset right away. You get a 3-day recovery sprint with lighter targets to get back on track.
              </Text>
            </View>
          )}

          {/* AI Motivation */}
          <Text style={{ color: C.text, fontWeight: "900", fontSize: 16, marginBottom: 12 }}>AI Motivation</Text>
          {loading ? (
            <View style={{ backgroundColor: C.cardSoft, borderRadius: 24, borderWidth: 1, borderColor: C.border, padding: 16, gap: 12 }}>
              <TextShimmer lines={2} />
              <TextShimmer lines={2} />
            </View>
          ) : (
            <View style={{ gap: 10, marginBottom: 16 }}>
              <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 16, flexDirection: "row", gap: 12 }}>
                <Sparkles color={C.primary} size={20} />
                <Text style={{ color: C.text, fontSize: 13, lineHeight: 20, flex: 1 }}>{aiData?.message}</Text>
              </View>
              <View style={{ backgroundColor: C.cardSoft, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 16 }}>
                <Text style={{ color: C.primary, fontSize: 11, fontWeight: "900", marginBottom: 6 }}>Today's challenge:</Text>
                <Text style={{ color: C.text, fontSize: 13, lineHeight: 20 }}>{aiData?.challenge}</Text>
              </View>
            </View>
          )}

          {/* Peer comparison */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: C.cardSoft, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 14 }}>
              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Group average</Text>
              <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>8 days</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: C.cardSoft, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 14 }}>
              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Your ranking</Text>
              <Text style={{ color: C.primary, fontSize: 20, fontWeight: "900" }}>Top 4%</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
