import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, User, Lightbulb, TrendingUp, TrendingDown } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = {
  bg: "#080111",
  card: "rgba(255, 255, 255, 0.075)",
  cardSoft: "rgba(255, 255, 255, 0.065)",
  primary: "#20E69C",
  primarySoft: "rgba(32, 230, 156, 0.15)",
  textMuted: "#BEB3CB",
  textSoft: "#DCFBEF",
  amber: "#F6A623",
  danger: "#FF6262",
  border: "rgba(255,255,255,0.18)",
};

export function Home() {
  const transactions = [
    { merchant: "Tealive", category: "Drinks", amount: 18.0, label: "T" },
    { merchant: "RapidKL", category: "Transport", amount: 4.5, label: "R" },
    { merchant: "Shopee", category: "Shopping", amount: 85.0, label: "S" },
  ];

  return (
    <LinearGradient
        colors={["#0A7E58", "#123C35", "#170725", colors.bg]}
        locations={[0, 0.2, 0.5, 0.92]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 112 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 34, height: 34, backgroundColor: colors.primary, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#071009", fontWeight: "900", fontSize: 11 }}>PK</Text>
              </View>
              <View>
                <Text style={{ color: "white", fontWeight: "900", fontSize: 15 }}>Poket</Text>
                <Text style={{ color: "#C8FFE9", fontSize: 10, fontWeight: "700" }}>Powered by GXBank</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={{ width: 42, height: 42, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: colors.border, borderRadius: 21, alignItems: "center", justifyContent: "center" }}>
                <Bell color="#F4ECFF" size={19} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 42, height: 42, backgroundColor: colors.primary, borderRadius: 21, alignItems: "center", justifyContent: "center" }}>
                <User color="#071009" size={19} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ color: colors.textSoft, fontSize: 14, marginBottom: 2 }}>Good morning,</Text>
          <Text style={{ color: "white", fontSize: 27, fontWeight: "900", marginBottom: 24 }}>Amirah</Text>

          <View style={{ backgroundColor: "rgba(255,255,255,0.105)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: 26, padding: 20, marginBottom: 16 }}>
            <Text style={{ color: colors.textSoft, fontSize: 12, marginBottom: 8 }}>Available balance - GXBank Savings</Text>
            <Text style={{ color: "white", fontSize: 36, fontWeight: "900", marginBottom: 8 }}>RM 1,240.50</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 7, height: 7, backgroundColor: colors.primary, borderRadius: 4 }} />
              <Text style={{ color: "#B8FFE2", fontSize: 12, fontWeight: "800" }}>Live balance</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <TrendingUp color={colors.primary} size={14} />
                <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 11 }}>+12%</Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>Saved this month</Text>
              <Text style={{ color: "white", fontWeight: "900", fontSize: 18 }}>RM 180</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <TrendingDown color={colors.amber} size={14} />
                <Text style={{ color: colors.amber, fontWeight: "900", fontSize: 11 }}>67%</Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>Budget used</Text>
              <Text style={{ color: "white", fontWeight: "900", fontSize: 18 }}>RM 670</Text>
            </View>
          </View>

          <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <View style={{ width: 42, height: 42, backgroundColor: colors.primarySoft, borderRadius: 21, alignItems: "center", justifyContent: "center" }}>
                <Lightbulb color={colors.primary} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 13, marginBottom: 6 }}>Smart nudge</Text>
                <Text style={{ color: "white", fontSize: 13, lineHeight: 20 }}>
                  You spent RM 18 at Tealive. Drinks budget 80% used this week.{"\n"}Auto-save RM 2 to your Raya goal?
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 13, borderRadius: 16, alignItems: "center" }}>
                <Text style={{ color: "#071009", fontWeight: "900" }}>Yes, save it</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", paddingVertical: 13, borderRadius: 16, borderWidth: 1, borderColor: colors.border, alignItems: "center" }}>
                <Text style={{ color: colors.textMuted, fontWeight: "900" }}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ color: "white", fontWeight: "900", fontSize: 18, marginBottom: 12 }}>Recent transactions</Text>
          <View style={{ gap: 10 }}>
            {transactions.map((tx, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 22 }}>
                <View style={{ width: 48, height: 48, backgroundColor: colors.primarySoft, borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.primary, fontSize: 17, fontWeight: "900" }}>{tx.label}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "white", fontWeight: "900", marginBottom: 4 }}>{tx.merchant}</Text>
                  <View style={{ alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 20 }}>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{tx.category}</Text>
                  </View>
                </View>
                <Text style={{ color: colors.danger, fontWeight: "900" }}>-RM {tx.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
