import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Award, ChevronRight, CreditCard, Settings, ShieldCheck, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type TabParamList = {
  Home: undefined;
  Spending: undefined;
  Goals: undefined;
  Streak: undefined;
  Profile: undefined;
  Challenge: undefined;
  DebtRadar: undefined;
};

export function Profile() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();

  return (
    <LinearGradient colors={["#0A7E58", "#123C35", "#170725", "#080111"]} locations={[0, 0.2, 0.5, 0.92]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} edges={["top", "left", "right"]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "900", marginBottom: 18 }}>Profile</Text>

          <View style={{ backgroundColor: "rgba(255,255,255,0.105)", borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: 26, padding: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: "#20E69C", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#071009", fontWeight: "900", fontSize: 18 }}>A</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: "900", marginBottom: 4 }}>Amirah</Text>
                <Text style={{ color: "#DCFBEF", fontSize: 13 }}>Personal account</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(32,230,156,0.14)" }}>
                <Text style={{ color: "#20E69C", fontSize: 11, fontWeight: "900" }}>Verified</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.84} onPress={() => navigation.navigate("Challenge")} style={{ backgroundColor: "rgba(255,255,255,0.075)", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", borderRadius: 24, padding: 18, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(32,230,156,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Award color="#20E69C" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "white", fontWeight: "900", marginBottom: 3 }}>30-Day Poket Challenge</Text>
                <Text style={{ color: "#BEB3CB", fontSize: 13 }}>Day 20 of 30 - top 4% nationally</Text>
              </View>
            </View>
            <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
              <View style={{ width: "67%", height: "100%", backgroundColor: "#20E69C", borderRadius: 999 }} />
            </View>
            <Text style={{ color: "#20E69C", fontSize: 13, fontWeight: "900" }}>Next milestone: 21-day streak</Text>
          </TouchableOpacity>

          <View style={{ gap: 10 }}>
            <ProfileRow icon={User} label="Personal details" />
            <ProfileRow icon={CreditCard} label="Linked GXBank account" />
            <ProfileRow icon={ShieldCheck} label="Security and privacy" />
            <ProfileRow icon={Settings} label="App preferences" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ProfileRow({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <TouchableOpacity activeOpacity={0.82} style={{ backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.17)", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.09)", alignItems: "center", justifyContent: "center" }}>
        <Icon color="#BEB3CB" size={18} />
      </View>
      <Text style={{ color: "white", fontWeight: "800", flex: 1 }}>{label}</Text>
      <ChevronRight color="#7F738D" size={18} />
    </TouchableOpacity>
  );
}
