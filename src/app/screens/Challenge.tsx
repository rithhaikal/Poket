import { View, Text, ScrollView, TouchableOpacity, Share } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Trophy, CheckCircle, Lock, Sparkles, ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getChallengeMotivation, ChallengeMotivation } from "../../services/smartAdvice";
import { TextShimmer } from "../components/TextShimmer";
import { useTheme } from "../../theme";

const challengeData = {
  rank: 1842,
  totalParticipants: 48209,
  daysLeft: 10,
  totalDays: 30,
  savedSoFar: 284,
  targetSave: 500,
  daysCurrent: 20,
};

const milestones = [
  { id: "1", title: "7-day streak", reward: "0.5% cashback boost on GXBank", achieved: true },
  { id: "2", title: "Saved RM 100", reward: "+0.2% savings interest rate", achieved: true },
  { id: "3", title: "21-day streak", reward: "RM 20 GXBank e-voucher", achieved: false, daysLeft: 10 },
  { id: "4", title: "Saved RM 500", reward: "Exclusive GXBank reward", achieved: false, daysLeft: null },
];

const topPct = Math.round((challengeData.rank / challengeData.totalParticipants) * 100);
const progressPct = Math.round((challengeData.daysCurrent / challengeData.totalDays) * 100);

export function Challenge() {
  const C = useTheme();
  const navigation = useNavigation<NavigationProp<{ Profile: undefined; [key: string]: undefined }>>();
  const [aiData, setAiData] = useState<ChallengeMotivation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChallengeMotivation(challengeData.rank, challengeData.totalParticipants, challengeData.daysLeft, challengeData.savedSoFar)
      .then(setAiData).finally(() => setLoading(false));
  }, []);

  const handleShare = () => {
    Share.share({ message: `I've saved RM ${challengeData.savedSoFar} in the #PoketChallenge! Join now on GXBank. 💜 #GXBank #Poket` });
  };

  return (
    <LinearGradient colors={C.gradientColors as any} locations={C.gradientLocations as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}
          >
            <ChevronLeft color="#BEB3CB" size={18} />
            <Text style={{ color: "#BEB3CB", fontSize: 14 }}>Back to Profile</Text>
          </TouchableOpacity>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: "900", marginBottom: 4 }}>Poket Challenge</Text>
          <Text style={{ color: C.textSoft, fontSize: 14, marginBottom: 20 }}>30-Day National Savings Campaign · GXBank</Text>

          {/* Rank card */}
          <View style={{ backgroundColor: C.cardSoft, borderRadius: 24, borderWidth: 1, borderColor: "rgba(113, 54, 253, 0.3)", padding: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Trophy color={C.primary} size={20} />
              <Text style={{ color: C.textMuted, fontSize: 13 }}>Your Ranking</Text>
            </View>
            <Text style={{ color: C.text, fontSize: 38, fontWeight: "900" }}>#{challengeData.rank.toLocaleString()}</Text>
            <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 8 }}>of {challengeData.totalParticipants.toLocaleString()} participants</Text>
            <View style={{ backgroundColor: C.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, alignSelf: "flex-start" }}>
              <Text style={{ color: C.primary, fontSize: 12, fontWeight: "900" }}>Top {topPct}% nationally</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={{ backgroundColor: C.card, borderRadius: 24, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
              <Text style={{ color: C.textMuted, fontSize: 12 }}>Challenge progress</Text>
              <Text style={{ color: C.text, fontSize: 12, fontWeight: "900" }}>Day {challengeData.daysCurrent}/{challengeData.totalDays}</Text>
            </View>
            <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
              <View style={{ width: `${progressPct}%` as any, height: "100%", backgroundColor: C.primary, borderRadius: 999 }} />
            </View>
            <Text style={{ color: C.textMuted, fontSize: 12 }}>RM {challengeData.savedSoFar} / RM {challengeData.targetSave} saved</Text>
          </View>

          {/* Milestones */}
          <Text style={{ color: C.text, fontSize: 16, fontWeight: "900", marginBottom: 12 }}>Milestones</Text>
          <View style={{ gap: 10, marginBottom: 20 }}>
            {milestones.map((m) => (
              <View key={m.id} style={{ backgroundColor: C.card, borderRadius: 24, borderWidth: 1, borderColor: m.achieved ? "rgba(113, 54, 253, 0.3)" : C.border, padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: m.achieved ? C.primarySoft : "rgba(255,255,255,0.06)", alignItems: "center", justifyContent: "center" }}>
                  {m.achieved ? <CheckCircle color={C.primary} size={22} /> : <Lock color={C.textMuted} size={22} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.text, fontWeight: "900", fontSize: 14, marginBottom: 2 }}>{m.title}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 12 }}>{m.reward}</Text>
                  {!m.achieved && m.daysLeft ? (
                    <View style={{ backgroundColor: "rgba(32,155,230,0.15)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6 }}>
                      <Text style={{ color: "#4DB8FF", fontSize: 11, fontWeight: "900" }}>{m.daysLeft} days left</Text>
                    </View>
                  ) : null}
                </View>
                {m.achieved ? <Text style={{ color: C.primary, fontSize: 12, fontWeight: "900" }}>Unlocked</Text> : null}
              </View>
            ))}
          </View>

          {/* AI Motivation */}
          <Text style={{ color: C.text, fontWeight: "900", fontSize: 16, marginBottom: 12 }}>AI Coach</Text>
          {loading ? (
            <View style={{ gap: 10, marginBottom: 20 }}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={{ backgroundColor: C.cardSoft, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 14 }}>
                  <TextShimmer lines={2} />
                </View>
              ))}
            </View>
          ) : (
            <View style={{ gap: 10, marginBottom: 20 }}>
              <View style={{ backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 14, flexDirection: "row", gap: 10 }}>
                <Sparkles color={C.primary} size={18} />
                <Text style={{ color: C.text, fontSize: 13, lineHeight: 18, flex: 1 }}>{aiData?.rankMessage}</Text>
              </View>
              <View style={{ backgroundColor: C.cardSoft, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 14 }}>
                <Text style={{ color: C.primary, fontSize: 11, fontWeight: "900", marginBottom: 4 }}>This week's tip:</Text>
                <Text style={{ color: C.text, fontSize: 13, lineHeight: 18 }}>{aiData?.weeklyTip}</Text>
              </View>
              <View style={{ backgroundColor: C.cardSoft, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 14 }}>
                <Text style={{ color: C.textMuted, fontSize: 11, marginBottom: 4 }}>Countdown:</Text>
                <Text style={{ color: C.text, fontSize: 13, lineHeight: 18 }}>{aiData?.streakNote}</Text>
              </View>
            </View>
          )}

          {/* Share button */}
          <TouchableOpacity style={{ backgroundColor: C.primary, borderRadius: 20, paddingVertical: 14, alignItems: "center", marginBottom: 8 }} onPress={handleShare}>
            <Text style={{ color: "white", fontWeight: "900", fontSize: 15 }}>Share My Progress</Text>
          </TouchableOpacity>
          <Text style={{ color: C.textMuted, fontSize: 11, textAlign: "center" }}>Powered by GXBank</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
