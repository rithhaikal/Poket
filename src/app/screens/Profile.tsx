import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Shield, Sparkles, LogOut, CheckCircle2, Lock, Zap, Star, Moon, Sun } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../theme";
import { AuraCore, AuraType, AURA_CONFIG } from "../components/AuraCore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width } = Dimensions.get("window");


type TabParamList = {
  Home: undefined; Spending: undefined; Goals: undefined;
  Streak: undefined; Profile: undefined; Challenge: undefined; DebtRadar: undefined;
};

const user = {
  name: "Fakhrul Mustaqim",
  university: "Universiti Teknologi Malaysia",
  joinDate: "March 2026",
  gxbankTier: "GXBank Young Saver",
};

const AURA_EVOLUTIONS: { id: AuraType; price: number; minLevel: number }[] = [
  { id: "origin", price: 0, minLevel: 1 },
  { id: "plasma", price: 300, minLevel: 4 },
  { id: "void", price: 750, minLevel: 8 },
  { id: "quantum", price: 1500, minLevel: 16 },
];

// Level from energy: 100 sparks per level
function getLevel(energy: number) {
  return Math.floor(energy / 100) + 1;
}
function getLevelProgress(energy: number) {
  return energy % 100;
}

function AnimatedLevelBadge({ level }: { level: number }) {
  const C = useTheme();
  const glow = useSharedValue(0.6);
  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, false,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "rgba(113,54,253,0.35)",
          },
          style,
        ]}
      />
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: C.primary,
          borderWidth: 2,
          borderColor: "rgba(176,143,255,0.6)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Star color="white" size={12} fill="white" />
        <Text style={{ color: "white", fontWeight: "900", fontSize: 18, lineHeight: 20 }}>{level}</Text>
      </View>
    </View>
  );
}

export function Profile() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const C = useTheme();
  const {
    goals, transactions, budgetLimit, resetOnboarding,
    energy, unlockedAuras, equippedAura, earnEnergy, unlockAura, equipAura,
    isDarkMode, toggleTheme,
  } = useAppContext();

  const level = getLevel(energy);
  const levelProgress = getLevelProgress(energy);
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, log out", style: "destructive", onPress: resetOnboarding },
    ]);
  };

  const handleBuy = (item: typeof AURA_EVOLUTIONS[0]) => {
    if (level < item.minLevel) {
      Alert.alert(
        "Level Too Low",
        `You need Level ${item.minLevel} to unlock ${AURA_CONFIG[item.id].name}. Keep earning Sparks!`,
      );
      return;
    }
    if (unlockedAuras.includes(item.id)) {
      if (equippedAura !== item.id) {
        equipAura(item.id);
        Alert.alert("Aura Equipped ✨", `You are now radiating the ${AURA_CONFIG[item.id].name}!`);
      }
      return;
    }
    const success = unlockAura(item.id, item.price);
    if (success) {
      equipAura(item.id);
      Alert.alert("Evolution Unlocked! 🎉", `Your core has evolved to ${AURA_CONFIG[item.id].name}.`);
    } else {
      Alert.alert("Not enough Sparks", `You need ${item.price - energy} more Sparks to unlock this.`);
    }
  };

  const equippedCfg = AURA_CONFIG[equippedAura as AuraType] ?? AURA_CONFIG.origin;

  return (
    <LinearGradient
      colors={C.gradientColors as any}
      locations={C.gradientLocations as any}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <Text style={{ color: C.text, fontSize: 28, fontWeight: "900" }}>Profile</Text>
            <View style={{ backgroundColor: C.primarySoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Zap color={C.primary} size={14} fill={C.primary} />
              <Text style={{ color: C.primary, fontWeight: "900", fontSize: 13 }}>{energy} Sparks</Text>
            </View>
          </View>

          {/* ── Aura Hero Card ── */}
          <View
            style={{
              borderRadius: 32,
              borderWidth: 1.5,
              borderColor: equippedCfg.glow,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <LinearGradient
              colors={[C.card, C.cardSoft]}
              style={{ padding: 28, alignItems: "center" }}
            >
              {/* Aura orb + level badge side-by-side */}
              <View style={{ alignItems: "center", marginBottom: 18 }}>
                <AuraCore type={equippedAura as AuraType} size={150} animated />
                <View style={{ position: "absolute", bottom: -8, right: width * 0.5 - 110 }}>
                  <AnimatedLevelBadge level={level} />
                </View>
              </View>

              <Text style={{ color: C.text, fontSize: 22, fontWeight: "900", marginTop: 18 }}>{user.name}</Text>
              <Text style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>{user.university}</Text>

              {/* Aura name tag */}
              <View
                style={{
                  marginTop: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: equippedCfg.glow,
                  backgroundColor: "rgba(113,54,253,0.12)",
                }}
              >
                <Text style={{ color: C.text, fontWeight: "900", fontSize: 12 }}>
                  ✦ {equippedCfg.name}
                </Text>
              </View>

              {/* Level XP bar */}
              <View style={{ width: "100%", marginTop: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ color: C.textMuted, fontSize: 11 }}>Level {level}</Text>
                  <Text style={{ color: C.primary, fontSize: 11, fontWeight: "900" }}>
                    {levelProgress} / 100 XP
                  </Text>
                </View>
                <View style={{ height: 8, backgroundColor: C.borderSoft, borderRadius: 999, overflow: "hidden" }}>
                  <LinearGradient
                    colors={equippedCfg.colors}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ width: `${levelProgress}%`, height: "100%", borderRadius: 999 }}
                  />
                </View>
                <Text style={{ color: C.textMuted, fontSize: 10, marginTop: 4, textAlign: "right" }}>
                  {100 - levelProgress} XP to Level {level + 1}
                </Text>
              </View>

              {/* Stats row */}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 16, width: "100%" }}>
                <View style={{ flex: 1, backgroundColor: C.cardSoft, borderRadius: 16, padding: 12, alignItems: "center" }}>
                  <Shield color={C.amber} size={14} style={{ marginBottom: 4 }} />
                  <Text style={{ color: C.text, fontWeight: "900", fontSize: 16 }}>RM {totalSaved}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10 }}>Total saved</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: C.cardSoft, borderRadius: 16, padding: 12, alignItems: "center" }}>
                  <Sparkles color={C.primary} size={14} style={{ marginBottom: 4 }} />
                  <Text style={{ color: C.text, fontWeight: "900", fontSize: 16 }}>{energy}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10 }}>Total Sparks</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: C.cardSoft, borderRadius: 16, padding: 12, alignItems: "center" }}>
                  <Star color={C.amber} size={14} fill={C.amber} style={{ marginBottom: 4 }} />
                  <Text style={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Top 4%</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10 }}>National rank</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* ── Earn Sparks ── */}
          <Text style={{ color: C.text, fontSize: 16, fontWeight: "900", marginBottom: 10 }}>⚡ Earn Sparks</Text>
          <View style={{ gap: 8, marginBottom: 24 }}>
            {[
              { label: "Saving Streak", xp: 10, detail: "Earned daily for staying on budget", color: C.primary },
              { label: "Budget Shield", xp: 50, detail: "Stay under weekend budget", color: C.amber },
              { label: "Emergency Milestone", xp: 500, detail: "Hit your first RM 1,000 emergency fund", color: C.green },
            ].map((q) => (
              <TouchableOpacity
                key={q.label}
                onPress={() => { earnEnergy(q.xp); Alert.alert("⚡ Energy Spark!", `Your core gained +${q.xp} Sparks for ${q.label}.`); }}
                style={{
                  backgroundColor: C.cardSoft,
                  borderRadius: 20,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: `${q.color}22`, alignItems: "center", justifyContent: "center" }}>
                  <Zap color={q.color} size={18} fill={q.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: "900", fontSize: 13 }}>{q.label}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 11 }}>{q.detail}</Text>
                </View>
                <View style={{ backgroundColor: `${q.color}22`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                  <Text style={{ color: q.color, fontWeight: "900", fontSize: 13 }}>+{q.xp}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Evolution Chamber ── */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles color={C.text} size={16} />
            <Text style={{ color: C.text, fontSize: 16, fontWeight: "900" }}>Evolution Chamber</Text>
          </View>
          <View style={{ gap: 12, marginBottom: 24 }}>
            {AURA_EVOLUTIONS.map((item) => {
              const cfg = AURA_CONFIG[item.id];
              const isOwned = unlockedAuras.includes(item.id);
              const isEquipped = equippedAura === item.id;
              const isLocked = !isOwned && level < item.minLevel;
              const canAfford = energy >= item.price;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleBuy(item)}
                  activeOpacity={0.82}
                  style={{
                    borderRadius: 24,
                    borderWidth: isEquipped ? 1.5 : 1,
                    borderColor: isEquipped ? cfg.glow : isOwned ? "rgba(113,54,253,0.35)" : C.border,
                    overflow: "hidden",
                  }}
                >
                  <LinearGradient
                    colors={
                      isEquipped
                        ? [C.primarySoft, C.cardSoft]
                        : [C.card, C.cardSoft]
                    }
                    style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 16 }}
                  >
                    {/* Mini animated orb */}
                    <View style={{ width: 64, height: 64, alignItems: "center", justifyContent: "center" }}>
                      <AuraCore type={item.id} size={52} animated={isOwned || isEquipped} />
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <Text style={{ color: C.text, fontWeight: "900", fontSize: 15 }}>{cfg.name}</Text>
                        {isEquipped && (
                          <View style={{ backgroundColor: cfg.glow.replace("0.55", "0.25").replace("0.60", "0.25").replace("0.50", "0.25"), paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                            <Text style={{ color: C.text, fontSize: 10, fontWeight: "900" }}>ACTIVE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ color: C.textMuted, fontSize: 11, marginBottom: 8 }}>
                        {item.id === "origin" && "Your starting aura. Every legend begins here."}
                        {item.id === "plasma" && "Aggressive energy. Built for wealth builders."}
                        {item.id === "void" && "Deep financial peace. Transcend the ordinary."}
                        {item.id === "quantum" && "Master of time and money. Ultimate form."}
                      </Text>

                      {/* Status pill */}
                      {isEquipped ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <CheckCircle2 color={C.green} size={13} />
                          <Text style={{ color: C.green, fontWeight: "900", fontSize: 12 }}>Radiating</Text>
                        </View>
                      ) : isOwned ? (
                        <Text style={{ color: C.primary, fontWeight: "900", fontSize: 12 }}>Tap to Equip</Text>
                      ) : isLocked ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Lock color={C.textMuted} size={11} />
                          <Text style={{ color: C.textMuted, fontSize: 11 }}>Level {item.minLevel} required</Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <Zap color={canAfford ? C.amber : C.danger} size={12} fill={canAfford ? C.amber : C.danger} />
                          <Text style={{ color: canAfford ? C.amber : C.danger, fontWeight: "900", fontSize: 12 }}>
                            {item.price} Sparks {!canAfford && `(need ${item.price - energy} more)`}
                          </Text>
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Appearance ── */}
          <View
            style={{
              backgroundColor: C.card,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: C.border,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: C.text, fontSize: 16, fontWeight: "900", marginBottom: 16 }}>⚙️ Appearance</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: isDarkMode ? "rgba(113,54,253,0.18)" : "rgba(246,166,35,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isDarkMode ? (
                    <Moon color={C.primary} size={20} />
                  ) : (
                    <Sun color={C.amber} size={20} />
                  )}
                </View>
                <View>
                  <Text style={{ color: C.text, fontWeight: "900", fontSize: 14 }}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </Text>
                  <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 1 }}>
                    {isDarkMode ? "Easy on the eyes at night" : "Bright and clear"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "rgba(99,38,232,0.18)", true: C.primary }}
                thumbColor={isDarkMode ? "#DED6FF" : "#6326E8"}
                ios_backgroundColor="rgba(99,38,232,0.18)"
              />
            </View>
          </View>

          {/* Log out */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{ borderRadius: 20, paddingVertical: 14, borderWidth: 1, borderColor: "rgba(255,98,98,0.22)", alignItems: "center", marginBottom: 12 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <LogOut color={C.danger} size={16} />
              <Text style={{ color: C.danger, fontWeight: "900", fontSize: 14 }}>Log Out</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ color: C.textMuted, fontSize: 10, textAlign: "center" }}>Poket v1.0.0 · Resilience System Active</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
