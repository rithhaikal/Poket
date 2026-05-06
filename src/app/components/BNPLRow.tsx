import { View, Text, StyleSheet } from "react-native";

interface BNPLRowProps {
  provider: string;
  planName: string;
  monthlyAmount: number;
  monthsRemaining: number;
  riskLevel: "low" | "medium" | "high";
}

export function BNPLRow({ provider, planName, monthlyAmount, monthsRemaining, riskLevel }: BNPLRowProps) {
  const riskColors = {
    low: { bg: "rgba(32, 230, 156, 0.12)", text: "#20E69C" },
    medium: { bg: "rgba(246, 166, 35, 0.12)", text: "#F6A623" },
    high: { bg: "rgba(255, 87, 87, 0.12)", text: "#FF5757" },
  };
  const colors = riskColors[riskLevel];
  const riskLabel = riskLevel === "low" ? "Low" : riskLevel === "medium" ? "Medium" : "High";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{provider[0]}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.planName}>{provider}</Text>
        <Text style={styles.planSubtext}>
          {planName} - RM {monthlyAmount.toFixed(2)}/mo - {monthsRemaining}m left
        </Text>
      </View>
      <View style={[styles.riskPill, { backgroundColor: colors.bg, borderColor: `${colors.text}40` }]}>
        <Text style={[styles.riskText, { color: colors.text }]}>{riskLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.075)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderRadius: 22,
  },
  iconContainer: {
    width: 46,
    height: 46,
    backgroundColor: "rgba(32, 230, 156, 0.14)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#20E69C",
  },
  detailsContainer: { flex: 1 },
  planName: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 3,
  },
  planSubtext: {
    fontSize: 12,
    color: "#BEB3CB",
  },
  riskPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  riskText: {
    fontSize: 11,
    fontWeight: "bold",
  },
});
