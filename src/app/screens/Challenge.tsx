import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check, Lock, Share2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const milestones = [
  { title: "7-day streak", reward: "0.5% cashback boost", unlocked: true },
  { title: "Saved RM 100", reward: "+0.2% interest rate", unlocked: true },
  { title: "21-day streak", reward: "RM 20 GXBank e-voucher", unlocked: false, daysLeft: 10 },
];

export function Challenge() {
  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", "#080111"]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <View style={{ width: 26, height: 26, backgroundColor: "#20E69C", borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#071009", fontSize: 11, fontWeight: "900" }}>GX</Text>
            </View>
            <Text style={{ color: "#DCFBEF", fontSize: 13, fontWeight: "800" }}>GXBank Challenge</Text>
          </View>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginBottom: 4 }}>30-Day Poket Challenge</Text>
          <Text style={{ color: "#DCFBEF", fontSize: 14, marginBottom: 20 }}>National savings campaign</Text>

          <View style={{ backgroundColor: "rgba(255,255,255,0.105)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: 26, padding: 20, marginBottom: 18 }}>
            <Text style={{ color: "#DCFBEF", fontSize: 13, marginBottom: 6 }}>Your rank</Text>
            <Text style={{ color: "white", fontSize: 38, fontWeight: "900", marginBottom: 4 }}>#1,842</Text>
            <Text style={{ color: "#DCFBEF", fontSize: 13, marginBottom: 4 }}>of 48,209 participants</Text>
            <Text style={{ color: "#20E69C", fontSize: 14, fontWeight: "900" }}>Top 4% nationally</Text>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18, marginBottom: 18 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ color: "white", fontWeight: "900" }}>Challenge progress</Text>
              <Text style={{ color: "#20E69C", fontWeight: "900" }}>Day 20 of 30</Text>
            </View>
            <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
              <View style={{ height: "100%", width: "67%", backgroundColor: "#20E69C", borderRadius: 999 }} />
            </View>
          </View>

          <Text style={{ color: "white", fontSize: 18, fontWeight: "900", marginBottom: 12 }}>Milestones</Text>
          <View style={{ gap: 12, marginBottom: 18 }}>
            {milestones.map((milestone, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 16, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: milestone.unlocked ? "rgba(32,230,156,0.34)" : "rgba(255,255,255,0.18)" }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: milestone.unlocked ? "#20E69C" : "rgba(255,255,255,0.07)", alignItems: "center", justifyContent: "center" }}>
                  {milestone.unlocked ? <Check color="#071009" size={20} /> : <Lock color="#776D86" size={20} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: milestone.unlocked ? "white" : "#BEB3CB", fontWeight: "900", marginBottom: 4 }}>{milestone.title}</Text>
                  <Text style={{ color: milestone.unlocked ? "#20E69C" : "#776D86", fontSize: 13 }}>{milestone.reward}</Text>
                  {!milestone.unlocked && milestone.daysLeft ? <Text style={{ color: "#20E69C", fontSize: 12, fontWeight: "900", marginTop: 8 }}>{milestone.daysLeft} days left</Text> : null}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={{ width: "100%", backgroundColor: "#20E69C", paddingVertical: 16, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Share2 color="#071009" size={20} />
            <Text style={{ color: "#071009", fontWeight: "900" }}>Share my progress</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
