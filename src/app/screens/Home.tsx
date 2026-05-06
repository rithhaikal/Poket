import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, User, Lightbulb, TrendingUp, TrendingDown, Plus, X, AlertCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { getSmartNudge, SmartNudge } from "../../services/smartAdvice";
import { TextShimmer } from "../components/TextShimmer";
import { useAppContext } from "../../context/AppContext";
import { Logo } from "../components/Logo";

const C = {
  bg: "#080111", card: "rgba(255,255,255,0.075)", cardSoft: "rgba(255,255,255,0.065)",
  primary: "#20E69C", primarySoft: "rgba(32,230,156,0.15)", textMuted: "#BEB3CB",
  textSoft: "#DCFBEF", amber: "#F6A623", danger: "#FF6262", border: "rgba(255,255,255,0.18)",
};

const PRESETS = [
  { merchant: "Tealive", category: "Drinks", amount: 18.0, label: "T" },
  { merchant: "GrabFood", category: "Food", amount: 32.5, label: "G" },
  { merchant: "Shopee", category: "Shopping", amount: 85.0, label: "S" },
  { merchant: "RapidKL", category: "Transport", amount: 4.5, label: "R" },
  { merchant: "KFC", category: "Food", amount: 24.9, label: "K" },
  { merchant: "Netflix", category: "Entertainment", amount: 17.0, label: "N" },
  { merchant: "Watsons", category: "Health", amount: 43.0, label: "W" },
  { merchant: "Petronas", category: "Transport", amount: 60.0, label: "P" },
  { merchant: "Uniqlo", category: "Shopping", amount: 129.0, label: "U" },
  { merchant: "McDonald's", category: "Food", amount: 21.5, label: "M" },
  { merchant: "Touch 'n Go", category: "Transport", amount: 30.0, label: "TG" },
  { merchant: "Lazada", category: "Shopping", amount: 55.0, label: "L" },
];

export function Home() {
  const navigation = useNavigation<any>();
  const { transactions, balance, totalSpent, budgetLimit, addTransaction, goals, addSavedAmount } = useAppContext();
  const [nudge, setNudge] = useState<SmartNudge | null>(null);
  const [nudgeLoading, setNudgeLoading] = useState(true);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const budgetUsedPct = Math.min(100, Math.round((totalSpent / budgetLimit) * 100));
  const savedAmount = 180;

  // Pick the most behind goal (lowest saved/target ratio, not achieved)
  const topGoal = goals
    .filter((g) => g.status !== "achieved")
    .sort((a, b) => (a.saved / a.target) - (b.saved / b.target))[0];

  const topGoalForAI = topGoal
    ? { name: topGoal.name, saved: topGoal.saved, target: topGoal.target }
    : undefined;

  // Fetch nudge — called on mount and when new transactions arrive
  const fetchNudge = (txSnapshot: typeof transactions) => {
    setNudgeLoading(true);
    setNudge(null);
    setNudgeDismissed(false);
    let cancelled = false;
    getSmartNudge(
      txSnapshot.slice(0, 3),
      Math.min(100, Math.round((totalSpent / budgetLimit) * 100)),
      savedAmount,
      topGoalForAI,
    ).then((result) => {
      if (!cancelled) setNudge(result);
    }).finally(() => {
      if (!cancelled) setNudgeLoading(false);
    });
    return () => { cancelled = true; };
  };

  useEffect(() => {
    return fetchNudge(transactions);
  }, [transactions]); // auto re-fetch when transactions change

  const handleSimulate = (preset: typeof PRESETS[0]) => {
    addTransaction(preset);
    setLastAdded(preset.merchant);
    setTimeout(() => setLastAdded(null), 2000);
  };

  const handleSaveIt = () => {
    const goalName = topGoal?.name ?? "your savings goal";
    const amountToSave = transactions.length > 0 ? Math.max(2, Math.round(transactions[0].amount * 0.08)) : 2;
    
    if (topGoal) {
      addSavedAmount(topGoal.id, amountToSave);
    }
    
    Alert.alert("Saved! 💚", `RM ${amountToSave.toFixed(2)} has been auto-saved to ${goalName}.\n\nSmall saves today build bigger freedom tomorrow.`);
    setNudgeDismissed(true);
  };

  const handleSkip = () => {
    setNudgeDismissed(true);
  };

  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", C.bg]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 34, height: 34, backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                <Logo width={34} height={34} />
              </View>
              <View>
                <Text style={{ color: "white", fontWeight: "900", fontSize: 15 }}>Poket</Text>
                <Text style={{ color: "#C8FFE9", fontSize: 10, fontWeight: "700" }}>Powered by GXBank</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={{ width: 42, height: 42, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: C.border, borderRadius: 21, alignItems: "center", justifyContent: "center" }}>
                <Bell color="#F4ECFF" size={19} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ width: 42, height: 42, backgroundColor: C.primary, borderRadius: 21, alignItems: "center", justifyContent: "center" }}>
                <User color="#071009" size={19} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ color: C.textSoft, fontSize: 14, marginBottom: 2 }}>Good morning,</Text>
          <Text style={{ color: "white", fontSize: 27, fontWeight: "900", marginBottom: 24 }}>Fakhrul</Text>

          {/* Balance */}
          <View style={{ backgroundColor: "rgba(255,255,255,0.105)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: 26, padding: 20, marginBottom: 16 }}>
            <Text style={{ color: C.textSoft, fontSize: 12, marginBottom: 8 }}>Available balance · GXBank Savings</Text>
            <Text style={{ color: "white", fontSize: 36, fontWeight: "900", marginBottom: 8 }}>RM {balance.toFixed(2)}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={{ width: 7, height: 7, backgroundColor: C.primary, borderRadius: 4 }} />
              <Text style={{ color: "#B8FFE2", fontSize: 12, fontWeight: "800" }}>Live balance</Text>
            </View>
          </View>

          {/* Stats — computed from REAL transaction data */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            <View style={{ flex: 1, backgroundColor: C.cardSoft, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <TrendingUp color={C.primary} size={14} />
                <Text style={{ color: C.primary, fontWeight: "900", fontSize: 11 }}>+12%</Text>
              </View>
              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Saved this month</Text>
              <Text style={{ color: "white", fontWeight: "900", fontSize: 18 }}>RM {savedAmount}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: C.cardSoft, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <TrendingDown color={budgetUsedPct >= 80 ? C.danger : C.amber} size={14} />
                <Text style={{ color: budgetUsedPct >= 80 ? C.danger : C.amber, fontWeight: "900", fontSize: 11 }}>{budgetUsedPct}%</Text>
              </View>
              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Budget used</Text>
              <Text style={{ color: "white", fontWeight: "900", fontSize: 18 }}>RM {totalSpent.toFixed(0)}</Text>
            </View>
          </View>

          {/* Budget alert bar — only shows when over 70% */}
          {budgetUsedPct >= 70 && (
            <View style={{ backgroundColor: budgetUsedPct >= 90 ? "rgba(255,98,98,0.1)" : "rgba(246,166,35,0.1)", borderWidth: 1, borderColor: budgetUsedPct >= 90 ? C.danger : C.amber, borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <AlertCircle color={budgetUsedPct >= 90 ? C.danger : C.amber} size={16} />
              <Text style={{ color: budgetUsedPct >= 90 ? C.danger : C.amber, fontSize: 12, fontWeight: "900", flex: 1 }}>
                {budgetUsedPct >= 90 ? `You've used ${budgetUsedPct}% of your budget. Slow down!` : `You've used ${budgetUsedPct}% of your monthly budget.`}
              </Text>
            </View>
          )}

          {/* Budget progress bar */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ color: C.textMuted, fontSize: 11 }}>Monthly budget</Text>
              <Text style={{ color: C.textMuted, fontSize: 11 }}>RM {totalSpent.toFixed(0)} / RM {budgetLimit}</Text>
            </View>
            <View style={{ height: 5, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
              <View style={{ width: `${budgetUsedPct}%` as any, height: "100%", backgroundColor: budgetUsedPct >= 90 ? C.danger : budgetUsedPct >= 70 ? C.amber : C.primary, borderRadius: 999 }} />
            </View>
          </View>

          {/* AI Smart Nudge */}
          {!nudgeDismissed && (
            <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 18, marginBottom: 24 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
                <View style={{ width: 42, height: 42, backgroundColor: C.primarySoft, borderRadius: 21, alignItems: "center", justifyContent: "center" }}>
                  <Lightbulb color={C.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <Text style={{ color: C.primary, fontWeight: "900", fontSize: 13 }}>Smart nudge</Text>
                    {nudgeLoading && <Text style={{ color: C.textMuted, fontSize: 10 }}>Analysing your spend...</Text>}
                  </View>
                  {nudgeLoading ? <TextShimmer lines={3} /> : (
                    <Text style={{ color: "white", fontSize: 13, lineHeight: 20 }}>{nudge?.message}</Text>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: nudgeLoading ? "rgba(32,230,156,0.4)" : C.primary, paddingVertical: 13, borderRadius: 16, alignItems: "center" }}
                  onPress={handleSaveIt}
                  disabled={nudgeLoading}
                >
                  <Text style={{ color: "#071009", fontWeight: "900" }}>{nudge?.actionLabel ?? "Yes, save it"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.06)", paddingVertical: 13, borderRadius: 16, borderWidth: 1, borderColor: C.border, alignItems: "center" }}
                  onPress={handleSkip}
                >
                  <Text style={{ color: C.textMuted, fontWeight: "900" }}>Skip for now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Transactions */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ color: "white", fontWeight: "900", fontSize: 18 }}>Recent transactions</Text>
            <TouchableOpacity onPress={() => setShowSimulator(true)} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Plus color={C.primary} size={14} />
              <Text style={{ color: C.primary, fontSize: 12, fontWeight: "900" }}>Simulate</Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {transactions.map((tx) => (
              <View key={tx.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 22 }}>
                <View style={{ width: 48, height: 48, backgroundColor: C.primarySoft, borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: C.primary, fontSize: 14, fontWeight: "900" }}>{tx.label}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "white", fontWeight: "900", marginBottom: 4 }}>{tx.merchant}</Text>
                  <View style={{ alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 20 }}>
                    <Text style={{ color: C.textMuted, fontSize: 11 }}>{tx.category}</Text>
                  </View>
                </View>
                <Text style={{ color: C.danger, fontWeight: "900" }}>-RM {tx.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Simulate modal */}
        <Modal visible={showSimulator} transparent animationType="slide" onRequestClose={() => setShowSimulator(false)}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }} activeOpacity={1} onPress={() => setShowSimulator(false)} />
          <View style={{ backgroundColor: "#10092A", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 48, borderTopWidth: 1, borderTopColor: C.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "900" }}>Simulate Transaction</Text>
              <TouchableOpacity onPress={() => setShowSimulator(false)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" }}>
                <X color={C.textMuted} size={18} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 4 }}>Tap any merchant — the AI will react to your spend.</Text>
            <Text style={{ color: C.textMuted, fontSize: 11, marginBottom: 16 }}>Budget: RM {totalSpent.toFixed(0)} / RM {budgetLimit} used ({budgetUsedPct}%)</Text>
            {lastAdded ? (
              <View style={{ backgroundColor: C.primarySoft, borderRadius: 12, padding: 10, marginBottom: 12, alignItems: "center" }}>
                <Text style={{ color: C.primary, fontWeight: "900" }}>✓ {lastAdded} added — nudge refreshing...</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {PRESETS.map((p) => (
                <TouchableOpacity key={p.merchant} onPress={() => handleSimulate(p)} style={{ backgroundColor: C.cardSoft, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, minWidth: "30%", flex: 1, alignItems: "center" }}>
                  <Text style={{ color: "white", fontWeight: "900", fontSize: 12 }}>{p.merchant}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>RM {p.amount.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}
