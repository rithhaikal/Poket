import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoalCard } from "../components/GoalCard";

export function SavingsGoals() {
  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", "#080111"]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginBottom: 4 }}>My savings</Text>
          <Text style={{ color: "#DCFBEF", fontSize: 14, marginBottom: 20 }}>Round-up engine active</Text>

          <View style={{ backgroundColor: "rgba(255,255,255,0.105)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: 24, padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 8, height: 8, backgroundColor: "#20E69C", borderRadius: 4 }} />
              <Text style={{ color: "#C8FFE9", fontSize: 14, fontWeight: "900", flex: 1 }}>RM 42.80 auto-saved this month via round-ups</Text>
            </View>
          </View>

          <View style={{ gap: 14 }}>
            <GoalCard name="Raya Fund" current={360} target={500} dueDate="Due 28 Jun 2026" status="on-track" autoSaveAmount="RM 2.40" />
            <GoalCard name="Emergency Fund" current={220} target={1000} dueDate="Due 31 Dec 2026" status="behind" aiTip="Increase auto-save by RM 3/day to reach your target on time" />

            <TouchableOpacity style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", paddingVertical: 16, borderRadius: 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Plus color="#BEB3CB" size={20} />
              <Text style={{ color: "#BEB3CB", fontWeight: "900" }}>Add new goal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
