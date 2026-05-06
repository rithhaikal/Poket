import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flame } from "lucide-react-native";
import { StreakDayCircle } from "../components/StreakDayCircle";
import { SafeAreaView } from "react-native-safe-area-context";

export function StreakTracker() {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const streakData = [...Array(11).fill("completed"), "today", ...Array(3).fill("future")];
  const streakRows = [streakData.slice(0, 7), streakData.slice(7, 14)];

  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", "#080111"]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginBottom: 22 }}>Daily streak</Text>

          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View style={{ width: 94, height: 94, backgroundColor: "#20E69C", borderRadius: 47, alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Flame color="#071009" size={46} />
            </View>
            <Text style={{ color: "#20E69C", fontSize: 58, fontWeight: "900", lineHeight: 64 }}>11</Text>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "900", marginTop: 2 }}>day streak</Text>
            <Text style={{ color: "#DCFBEF", fontSize: 13, marginTop: 4 }}>Personal best: 21 days</Text>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              {weekDays.map((day, index) => (
                <View key={index} style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: "#BEB3CB", fontSize: 12 }}>{day}</Text>
                </View>
              ))}
            </View>
            <View style={{ gap: 12 }}>
              {streakRows.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: "row" }}>
                  {row.map((status, index) => (
                    <View key={`${rowIndex}-${index}`} style={{ flex: 1, alignItems: "center" }}>
                      <StreakDayCircle status={status as "completed" | "today" | "future"} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18, marginBottom: 16 }}>
            <Text style={{ color: "#F6A623", fontWeight: "900", marginBottom: 8 }}>Recovery mode</Text>
            <Text style={{ color: "#BEB3CB", fontSize: 13, lineHeight: 20 }}>Complete 3 financial tasks to restore your streak if you miss a day.</Text>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18 }}>
            <Text style={{ color: "#BEB3CB", fontSize: 13, marginBottom: 10 }}>Your cohort comparison</Text>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "900", marginBottom: 10 }}>Cohort avg: 8 days</Text>
            <Text style={{ color: "#20E69C", fontSize: 12, fontWeight: "900", marginBottom: 12 }}>You are in the top 22%</Text>
            <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
              <View style={{ height: "100%", width: "78%", backgroundColor: "#20E69C", borderRadius: 999 }} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
