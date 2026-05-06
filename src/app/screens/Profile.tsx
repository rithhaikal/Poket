import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Shield, Trophy, ChevronRight, LogOut } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAppContext } from "../../context/AppContext";

const C = {
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

type TabParamList = {
  Home: undefined;
  Spending: undefined;
  Goals: undefined;
  Streak: undefined;
  Profile: undefined;
  Challenge: undefined;
  DebtRadar: undefined;
};

const user = {
  name: "Fakhrul Mustaqim",
  initials: "FM",
  university: "Universiti Teknologi Malaysia",
  joinDate: "March 2026",
  gxbankTier: "GXBank Young Saver",
};

const stats = [
  { label: "Total saved", value: "RM 642", color: C.primary },
  { label: "Best streak", value: "21 days", color: C.primary },
  { label: "Budget met", value: "78%", color: C.amber },
  { label: "Active BNPL", value: "3 plans", color: C.danger },
];

type MenuItem = {
  icon: React.ComponentType<{ color: string; size: number }>;
  label: string;
  screen: keyof TabParamList;
};

const menuItems: MenuItem[] = [
  { icon: Shield, label: "Check debt radar", screen: "DebtRadar" },
  { icon: Trophy, label: "Challenge leaderboard", screen: "Challenge" },
];

export function Profile() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { goals, transactions, budgetLimit, resetOnboarding } = useAppContext();

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalSpentThisMonth = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const budgetMetPct = Math.round(Math.max(0, 100 - (totalSpentThisMonth / budgetLimit) * 100));

  const stats = [
    { label: "Total saved", value: `RM ${totalSaved.toFixed(0)}`, color: C.primary },
    { label: "Best streak", value: "21 days", color: C.primary },
    { label: "Budget met", value: `${budgetMetPct}%`, color: C.amber },
    { label: "Active BNPL", value: "3 plans", color: C.danger },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, log out", style: "destructive", onPress: () => resetOnboarding() },
      ],
    );
  };

  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", "#080111"]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginBottom: 20 }}>Profile</Text>

          {/* Profile header */}
          <View style={{ backgroundColor: C.cardSoft, borderRadius: 24, borderWidth: 1, borderColor: C.border, padding: 20, alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: C.primary, fontSize: 24, fontWeight: "900" }}>{user.initials}</Text>
            </View>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "900", marginTop: 12 }}>{user.name}</Text>
            <Text style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>{user.university}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <View style={{ backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ color: C.primary, fontSize: 12, fontWeight: "900" }}>{user.gxbankTier}</Text>
              </View>
              <View style={{ backgroundColor: "rgba(246,166,35,0.15)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ color: C.amber, fontSize: 12, fontWeight: "900" }}>🏆 Top 4% National</Text>
              </View>
            </View>
            <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>Member since {user.joinDate}</Text>
          </View>

          {/* Stats grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {stats.map((stat) => (
              <View key={stat.label} style={{ flex: 1, minWidth: "45%", backgroundColor: C.cardSoft, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 14 }}>
                <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>{stat.label}</Text>
                <Text style={{ color: stat.color, fontSize: 20, fontWeight: "900" }}>{stat.value}</Text>
              </View>
            ))}
          </View>

          {/* Quick links */}
          <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: "900", marginBottom: 10 }}>QUICK ACCESS</Text>
          <View style={{ gap: 10, marginBottom: 20 }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.82}
                  onPress={() => navigation.navigate(item.screen)}
                  style={{ backgroundColor: C.cardSoft, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}
                >
                  <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" }}>
                    <Icon color={C.primary} size={20} />
                  </View>
                  <Text style={{ color: "white", fontWeight: "900", fontSize: 14, flex: 1 }}>{item.label}</Text>
                  <ChevronRight color={C.textMuted} size={18} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Log out */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{ borderRadius: 20, paddingVertical: 14, borderWidth: 1, borderColor: "rgba(255,98,98,0.3)", alignItems: "center", marginBottom: 12 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <LogOut color={C.danger} size={16} />
              <Text style={{ color: C.danger, fontWeight: "900", fontSize: 14 }}>Log Out</Text>
            </View>
          </TouchableOpacity>

          <Text style={{ color: C.textMuted, fontSize: 11, textAlign: "center" }}>Poket v1.0.0 · Powered by GXBank</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
