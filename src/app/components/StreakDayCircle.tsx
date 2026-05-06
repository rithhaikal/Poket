import { View, Text, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

interface StreakDayCircleProps {
  status: "completed" | "today" | "future";
  label?: string;
}

export function StreakDayCircle({ status, label }: StreakDayCircleProps) {
  if (status === "completed") {
    return (
      <View style={styles.wrapper}>
        <View style={styles.completedCircle}>
          <Check color="#20E69C" size={20} />
        </View>
        {label ? <Text style={styles.labelMuted}>{label}</Text> : null}
      </View>
    );
  }

  if (status === "today") {
    return (
      <View style={styles.wrapper}>
        <View style={styles.todayCircle}>
          <Text style={styles.todayText}>T</Text>
        </View>
        {label ? <Text style={styles.labelActive}>{label}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.futureCircle} />
      {label ? <Text style={styles.labelDim}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 4,
  },
  completedCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(32, 230, 156, 0.2)",
    borderWidth: 1,
    borderColor: "#20E69C",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  todayCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#20E69C",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  todayText: {
    fontSize: 14,
    color: "#071009",
    fontWeight: "bold",
  },
  futureCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  labelMuted: {
    fontSize: 12,
    color: "#BEB3CB",
  },
  labelActive: {
    fontSize: 12,
    color: "#20E69C",
  },
  labelDim: {
    fontSize: 12,
    color: "#776D86",
  },
});
