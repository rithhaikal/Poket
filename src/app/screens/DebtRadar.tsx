import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Shield, Sparkles } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BNPLRow } from "../components/BNPLRow";

export function DebtRadar() {
  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", "#080111"]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Text style={{ color: "white", fontSize: 28, fontWeight: "900" }}>Debt radar</Text>
            <View style={{ width: 34, height: 34, backgroundColor: "rgba(246,166,35,0.18)", borderRadius: 17, alignItems: "center", justifyContent: "center" }}>
              <Shield color="#F6A623" size={18} />
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.095)", borderWidth: 1, borderColor: "rgba(246,166,35,0.34)", borderRadius: 26, padding: 18, marginBottom: 18 }}>
            <Text style={{ color: "#F6A623", fontWeight: "900", marginBottom: 8 }}>BNPL risk detected</Text>
            <Text style={{ color: "white", fontSize: 13, lineHeight: 20 }}>Your Buy Now Pay Later commitments are 38% of your monthly income.</Text>
          </View>

          <Text style={{ color: "white", fontSize: 18, fontWeight: "900", marginBottom: 12 }}>Active BNPL plans</Text>
          <View style={{ gap: 12, marginBottom: 18 }}>
            <BNPLRow provider="Shopee PayLater" planName="Laptop purchase" monthlyAmount={180} monthsRemaining={4} riskLevel="high" />
            <BNPLRow provider="GrabPay Later" planName="Phone upgrade" monthlyAmount={120} monthsRemaining={6} riskLevel="medium" />
            <BNPLRow provider="Atome" planName="Furniture set" monthlyAmount={90} monthsRemaining={2} riskLevel="low" />
          </View>

          <View style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(32,230,156,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Sparkles color="#20E69C" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontWeight: "900", marginBottom: 8 }}>Pay off Atome first</Text>
                <Text style={{ color: "#BEB3CB", fontSize: 13, lineHeight: 20, marginBottom: 10 }}>Clearing the shortest plan first frees up RM 90/month for your emergency fund.</Text>
                <Text style={{ color: "#20E69C", fontSize: 13, fontWeight: "900" }}>Projected outcome: Debt-free by August.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
