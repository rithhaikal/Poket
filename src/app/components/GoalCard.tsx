import { View, Text, StyleSheet } from "react-native";

interface GoalCardProps {
  name: string;
  current: number;
  target: number;
  dueDate?: string;
  status: "on-track" | "behind";
  autoSaveAmount?: string;
  aiTip?: string;
}

export function GoalCard({ name, current, target, dueDate, status, autoSaveAmount, aiTip }: GoalCardProps) {
  const percentage = Math.round((current / target) * 100);
  const isOnTrack = status === "on-track";

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          {dueDate ? <Text style={styles.dueDate}>{dueDate}</Text> : null}
        </View>
        <View style={[styles.pill, isOnTrack ? styles.pillGreen : styles.pillAmber]}>
          <Text style={[styles.pillText, isOnTrack ? styles.pillTextGreen : styles.pillTextAmber]}>
            {isOnTrack ? "On track" : "Behind"}
          </Text>
        </View>
      </View>

      {/* Amount */}
      <Text style={styles.amount}>
        RM {current.toFixed(2)}{" "}
        <Text style={styles.amountTarget}>/ RM {target.toFixed(2)}</Text>
      </Text>

      {/* Progress bar */}
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.min(100, Math.max(0, percentage))}%` as any },
            isOnTrack ? styles.barGreen : styles.barAmber,
          ]}
        />
      </View>

      {autoSaveAmount ? (
        <Text style={styles.autoSave}>Auto-saving {autoSaveAmount}/day</Text>
      ) : null}

      {aiTip ? (
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>{aiTip}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.075)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: { flex: 1 },
  name: { color: "#FFFFFF", fontSize: 17, fontWeight: "bold", marginBottom: 3 },
  dueDate: { fontSize: 13, color: "#BEB3CB" },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginLeft: 8, borderWidth: 1 },
  pillGreen: { backgroundColor: "rgba(32,230,156,0.12)", borderColor: "rgba(32,230,156,0.3)" },
  pillAmber: { backgroundColor: "rgba(246,166,35,0.12)", borderColor: "rgba(246,166,35,0.3)" },
  pillText: { fontSize: 11, fontWeight: "bold" },
  pillTextGreen: { color: "#20E69C" },
  pillTextAmber: { color: "#F6A623" },
  amount: { fontSize: 24, color: "#FFFFFF", fontWeight: "bold", marginBottom: 12 },
  amountTarget: { fontSize: 16, color: "#BEB3CB", fontWeight: "normal" },
  barBg: { height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", marginBottom: 12 },
  barFill: { height: "100%", borderRadius: 999 },
  barGreen: { backgroundColor: "#20E69C" },
  barAmber: { backgroundColor: "#F6A623" },
  autoSave: { fontSize: 13, color: "#BEB3CB" },
  tipBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  tipText: { fontSize: 13, color: "#BEB3CB", lineHeight: 19 },
});
