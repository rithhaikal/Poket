import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, Repeat2, X, Trash2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { getSavingsAdvice, SavingsAdvice } from "../../services/smartAdvice";
import { TextShimmer } from "../components/TextShimmer";
import { useAppContext, Goal, GoalStatus } from "../../context/AppContext";
import { useTheme } from "../../theme";


const EMOJIS = ["🌙", "🛡️", "✈️", "🏠", "🎓", "💍", "🚗", "💻", "🎸", "👟", "🐕"];

const monthlyRoundUp = 42.80;

function GoalCard({ goal, onDelete, C }: { goal: Goal; onDelete: (id: string) => void; C: any }) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const sc: Record<GoalStatus, { label: string; bg: string; text: string; barColor: string }> = {
    "on-track": { label: "On track", bg: "rgba(113, 54, 253, 0.15)", text: C.primary, barColor: C.primary },
    "behind": { label: "Behind", bg: "rgba(246,166,35,0.15)", text: C.amber, barColor: C.amber },
    "achieved": { label: "Achieved", bg: "rgba(113, 54, 253, 0.9)", text: "#FFF", barColor: C.primary },
  };
  const s = sc[goal.status];

  const handleDelete = () => {
    Alert.alert(
      "Remove goal?",
      `Are you sure you want to remove "${goal.name}"? This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => onDelete(goal.id) },
      ]
    );
  };
  return (
    <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 18, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 22 }}>{goal.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.text, fontWeight: "900", fontSize: 16 }}>{goal.name}</Text>
            <Text style={{ color: C.textMuted, fontSize: 12 }}>RM {goal.saved.toFixed(2)} / RM {goal.target.toFixed(2)}</Text>
            {goal.deadline ? <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>Due: {goal.deadline}</Text> : null}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ backgroundColor: s.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
            <Text style={{ color: s.text, fontSize: 11, fontWeight: "900" }}>{s.label}</Text>
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,98,98,0.1)", alignItems: "center", justifyContent: "center" }}
          >
            <Trash2 color="#FF6262" size={14} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 6, backgroundColor: C.borderSoft, borderRadius: 999, overflow: "hidden" }}>
        <View style={{ width: `${pct}%` as any, height: "100%", backgroundColor: s.barColor, borderRadius: 999 }} />
      </View>
      <Text style={{ color: C.textMuted, fontSize: 11 }}>
        {goal.autoSavePerDay > 0 ? `Auto-saving RM ${goal.autoSavePerDay.toFixed(2)}/day via round-ups` : "No auto-save set yet"}
      </Text>
    </View>
  );
}

export function SavingsGoals() {
  const C = useTheme();
  const { goals, addGoal, removeGoal } = useAppContext();
  const [aiData, setAiData] = useState<SavingsAdvice | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌙");

  useEffect(() => {
    getSavingsAdvice(
      goals.map((g) => ({ name: g.name, saved: g.saved, target: g.target, status: g.status })),
      monthlyRoundUp,
    ).then(setAiData).finally(() => setAiLoading(false));
  }, []);

  const handleAddGoal = () => {
    const targetNum = parseFloat(newTarget);
    if (!newName.trim() || isNaN(targetNum) || targetNum <= 0) return;
    addGoal({ name: newName.trim(), emoji: selectedEmoji, target: targetNum, deadline: newDeadline.trim() || null });
    setNewName(""); setNewTarget(""); setNewDeadline(""); setSelectedEmoji("🌙");
    setShowModal(false);
  };

  return (
    <LinearGradient colors={C.gradientColors as any} locations={C.gradientLocations as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: "900", marginBottom: 4 }}>My Savings</Text>
          <Text style={{ color: C.textSoft, fontSize: 14, marginBottom: 20 }}>Round-up engine active</Text>

          {/* Round-up banner */}
          <View style={{ backgroundColor: "rgba(113, 54, 253, 0.1)", borderWidth: 1, borderColor: C.primary, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Repeat2 color={C.primary} size={18} />
            <Text style={{ color: C.primary, fontWeight: "900", fontSize: 13, flex: 1 }}>RM {monthlyRoundUp.toFixed(2)} auto-saved this month via round-ups</Text>
          </View>

          {/* Prominent Add Goal button */}
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{ backgroundColor: C.primary, borderRadius: 20, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}
          >
            <Plus color={C.text} size={20} />
            <Text style={{ color: C.text, fontWeight: "900", fontSize: 15 }}>Add New Goal</Text>
          </TouchableOpacity>

          {/* Goal cards */}
          <View style={{ gap: 14, marginBottom: 20 }}>
            {goals.map((goal) => <GoalCard key={goal.id} goal={goal} onDelete={removeGoal} C={C} />)}
          </View>

          {/* AI Coach */}
          <Text style={{ color: C.text, fontWeight: "900", fontSize: 16, marginBottom: 12 }}>AI Savings Coach</Text>
          {aiLoading ? (
            <View style={{ backgroundColor: C.cardSoft, borderRadius: 24, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 20 }}>
              <TextShimmer lines={3} />
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Tip", value: aiData?.tip, color: C.primary },
                { label: "Projection", value: aiData?.projectionMessage, color: C.primary },
                { label: "Vibe check", value: aiData?.motivationLine, color: C.primary },
              ].map((item) => (
                <View key={item.label} style={{ flex: 1, backgroundColor: C.cardSoft, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ color: C.textMuted, fontSize: 11, marginBottom: 6 }}>{item.label}</Text>
                  <Text style={{ color: item.color, fontSize: 12, lineHeight: 18, fontWeight: "900" }}>{item.value}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add Goal Modal */}
        <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }} activeOpacity={1} onPress={() => setShowModal(false)} />
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={{ backgroundColor: C.modalBg, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 48, borderTopWidth: 1, borderTopColor: C.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>New Savings Goal</Text>
                <TouchableOpacity onPress={() => setShowModal(false)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" }}>
                  <X color={C.textMuted} size={18} />
                </TouchableOpacity>
              </View>

              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 8 }}>Pick an emoji</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 18 }}>
                {EMOJIS.map((e) => (
                  <TouchableOpacity key={e} onPress={() => setSelectedEmoji(e)} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: selectedEmoji === e ? C.primarySoft : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: selectedEmoji === e ? C.primary : "transparent", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 22, textAlign: "center", includeFontPadding: false, lineHeight: 30 }}>{e}</Text>
                  </TouchableOpacity>
                ))}
                
                {/* Custom Emoji Input */}
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: !EMOJIS.includes(selectedEmoji) ? C.primarySoft : "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: !EMOJIS.includes(selectedEmoji) ? C.primary : "transparent", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <TextInput
                    value={!EMOJIS.includes(selectedEmoji) ? selectedEmoji : ""}
                    onChangeText={(text) => {
                      if (!text) {
                        setSelectedEmoji("🎯");
                        return;
                      }
                      // Extract only valid emojis from the typed text
                      const emojisOnly = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
                      if (emojisOnly && emojisOnly.length > 0) {
                        setSelectedEmoji(emojisOnly[0]); // Keep only the first emoji
                      }
                    }}
                    placeholder="+"
                    placeholderTextColor={C.textMuted}
                    maxLength={4} // Allow longer length temporarily to catch complex emojis before regex
                    style={{ flex: 1, width: "100%", fontSize: 22, color: C.text, textAlign: "center", textAlignVertical: "center", padding: 0, margin: 0 }}
                    onFocus={() => {
                      if (EMOJIS.includes(selectedEmoji)) setSelectedEmoji("");
                    }}
                  />
                </View>
              </View>

              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 6 }}>Goal name</Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="e.g. New Laptop"
                placeholderTextColor={C.textMuted}
                style={{ backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, color: C.text, fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: C.border }}
              />

              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 6 }}>Target amount (RM)</Text>
              <TextInput
                value={newTarget}
                onChangeText={setNewTarget}
                placeholder="e.g. 2000"
                placeholderTextColor={C.textMuted}
                keyboardType="numeric"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, color: C.text, fontSize: 15, marginBottom: 14, borderWidth: 1, borderColor: C.border }}
              />

              <Text style={{ color: C.textMuted, fontSize: 12, marginBottom: 6 }}>Deadline (optional)</Text>
              <TextInput
                value={newDeadline}
                onChangeText={setNewDeadline}
                placeholder="e.g. Dec 2026"
                placeholderTextColor={C.textMuted}
                style={{ backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, color: C.text, fontSize: 15, marginBottom: 20, borderWidth: 1, borderColor: C.border }}
              />

              <TouchableOpacity
                onPress={handleAddGoal}
                style={{ backgroundColor: newName.trim() && newTarget.trim() ? C.primary : "rgba(255,255,255,0.1)", borderRadius: 18, paddingVertical: 15, alignItems: "center" }}
              >
                <Text style={{ color: newName.trim() && newTarget.trim() ? "#071009" : C.textMuted, fontWeight: "900", fontSize: 15 }}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}
