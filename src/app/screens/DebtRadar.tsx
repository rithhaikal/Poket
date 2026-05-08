import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AlertTriangle, CheckCircle, Sparkles, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getDebtAdvice, DebtAdvice } from "../../services/smartAdvice";
import { BNPLRow } from "../components/BNPLRow";
import { TextShimmer } from "../components/TextShimmer";
import { useTheme } from "../../theme";

const monthlyIncome = 2000;
const bnplPlans = [
  { id: "1", provider: "Shopee PayLater", initial: "S", monthlyAmount: 60, monthsLeft: 4, risk: "medium" as const },
  { id: "2", provider: "Atome", initial: "A", monthlyAmount: 90, monthsLeft: 2, risk: "high" as const },
  { id: "3", provider: "GrabPay Later", initial: "G", monthlyAmount: 40, monthsLeft: 6, risk: "low" as const },
];
const totalMonthly = bnplPlans.reduce((sum, p) => sum + p.monthlyAmount, 0);
const incomePercentage = Math.round((totalMonthly / monthlyIncome) * 100);
const risk: "low" | "medium" | "high" = incomePercentage >= 25 ? "high" : incomePercentage >= 15 ? "medium" : "low";
// pctColor computed inside component using C from useTheme

export function DebtRadar() {
  const C = useTheme();
  const pctColor = incomePercentage < 15 ? C.primary : incomePercentage < 25 ? C.amber : C.danger;
  const navigation = useNavigation<NavigationProp<{ Profile: undefined; [key: string]: undefined }>>();
  const [advice, setAdvice] = useState<DebtAdvice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const totalBnpl = bnplPlans.reduce((s, p) => s + p.monthlyAmount * p.monthsLeft, 0);
    getDebtAdvice(totalMonthly, totalBnpl, monthlyIncome, bnplPlans.length)
      .then(setAdvice).finally(() => setLoading(false));
  }, []);

  const bannerConfig = {
    high: { bg: "rgba(255,98,98,0.1)", border: C.danger, title: "High Risk Detected", titleColor: C.danger, Icon: AlertTriangle, iconColor: C.danger },
    medium: { bg: "rgba(246,166,35,0.1)", border: C.amber, title: "Moderate Risk", titleColor: C.amber, Icon: AlertTriangle, iconColor: C.amber },
    low: { bg: C.primarySoft, border: C.primary, title: "Looking Good", titleColor: C.primary, Icon: CheckCircle, iconColor: C.primary },
  }[risk];

  return (
    <LinearGradient colors={C.gradientColors as any} locations={C.gradientLocations as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          {/* Back button + title */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}
          >
            <ChevronLeft color="#BEB3CB" size={18} />
            <Text style={{ color: "#BEB3CB", fontSize: 14 }}>Back to Profile</Text>
          </TouchableOpacity>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: "900", marginBottom: 4 }}>Debt Radar</Text>
          <Text style={{ color: C.textSoft, fontSize: 14, marginBottom: 20 }}>Track your BNPL commitments</Text>

          <View style={{ backgroundColor: bannerConfig.bg, borderWidth: 1, borderColor: bannerConfig.border, borderRadius: 24, padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
            <bannerConfig.Icon color={bannerConfig.iconColor} size={20} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: bannerConfig.titleColor, fontWeight: "900", marginBottom: 4 }}>{bannerConfig.title}</Text>
              <Text style={{ color: C.textMuted, fontSize: 12, lineHeight: 18 }}>
                Monthly BNPL commitment: RM {totalMonthly} ({incomePercentage}% of income). Recommended safe limit: 20%.
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
            {[
              { label: "Monthly total", value: `RM ${totalMonthly}`, color: C.danger },
              { label: "% of income", value: `${incomePercentage}%`, color: pctColor },
              { label: "Active plans", value: `${bnplPlans.length} plans`, color: C.text },
            ].map((stat) => (
              <View key={stat.label} style={{ flex: 1, backgroundColor: C.cardSoft, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: C.border }}>
                <Text style={{ color: C.textMuted, fontSize: 11, marginBottom: 4 }}>{stat.label}</Text>
                <Text style={{ color: stat.color, fontSize: 16, fontWeight: "900" }}>{stat.value}</Text>
              </View>
            ))}
          </View>

          <Text style={{ color: C.text, fontSize: 16, fontWeight: "900", marginBottom: 10 }}>Active BNPL Plans</Text>
          <View style={{ gap: 10, marginBottom: 20 }}>
            {bnplPlans.map((plan) => (
              <BNPLRow key={plan.id} provider={plan.provider} initial={plan.initial} monthlyAmount={plan.monthlyAmount} monthsLeft={plan.monthsLeft} risk={plan.risk} />
            ))}
          </View>

          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 18 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Sparkles color={C.primary} size={18} />
              <Text style={{ color: C.primary, fontWeight: "900", fontSize: 14 }}>AI Advice</Text>
            </View>
            {loading ? <TextShimmer lines={4} /> : (
              <>
                <Text style={{ color: C.text, fontSize: 13, lineHeight: 20, marginBottom: 10 }}>{advice?.summary}</Text>
                <View style={{ borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10, marginBottom: 10 }}>
                  <Text style={{ color: C.primary, fontSize: 12, fontWeight: "900", marginBottom: 4 }}>Top action:</Text>
                  <Text style={{ color: C.text, fontSize: 13, lineHeight: 20 }}>{advice?.topAction}</Text>
                </View>
                <View style={{ borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 }}>
                  <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Estimated debt-free:</Text>
                  <Text style={{ color: C.primary, fontSize: 15, fontWeight: "900" }}>{advice?.timeToFree}</Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
