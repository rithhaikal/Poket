import { View, Text, TouchableOpacity, Dimensions, PanResponder, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";
import { Logo } from "../components/Logo";
import { Lightbulb, Target, Flame, Shield, ChevronRight, Sparkles, Heart } from "lucide-react-native";

const { width } = Dimensions.get("window");

const C = {
  primary: "#20E69C",
  primarySoft: "rgba(32, 230, 156, 0.15)",
  card: "rgba(255,255,255,0.075)",
  border: "rgba(255,255,255,0.18)",
  textMuted: "#BEB3CB",
  textSoft: "#DCFBEF",
};

const FEATURES = [
  { Icon: Lightbulb, title: "Smart Nudges", desc: "AI advice personalised to every spend" },
  { Icon: Target, title: "Savings Goals", desc: "Round-up savings that fund your dreams" },
  { Icon: Flame, title: "Daily Streak", desc: "Gamified streaks that make saving addictive" },
  { Icon: Shield, title: "Debt Radar", desc: "BNPL risk tracking before it's a problem" },
];

function Slide1() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      <View style={{ width: 100, height: 100, borderRadius: 28, backgroundColor: C.primarySoft, borderWidth: 1, borderColor: C.primary, alignItems: "center", justifyContent: "center", marginBottom: 36 }}>
        <Logo width={62} height={62} />
      </View>
      <Text style={{ color: "white", fontSize: 40, fontWeight: "900", textAlign: "center", letterSpacing: -1.5, lineHeight: 46, marginBottom: 16 }}>
        {"Meet\nPoket."}
      </Text>
      <Text style={{ color: C.textSoft, fontSize: 16, textAlign: "center", lineHeight: 26, marginBottom: 36 }}>
        Your AI-powered savings companion built for the GXBank generation.
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.primarySoft, borderWidth: 1, borderColor: C.primary, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 }}>
        <Sparkles color={C.primary} size={14} />
        <Text style={{ color: C.primary, fontWeight: "900", fontSize: 13 }}>Powered by GXBank</Text>
      </View>
    </View>
  );
}

function Slide2() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: "center" }}>
      <Text style={{ color: "white", fontSize: 30, fontWeight: "900", textAlign: "center", letterSpacing: -0.5, marginBottom: 6 }}>
        Everything you need
      </Text>
      <Text style={{ color: C.textSoft, fontSize: 15, textAlign: "center", marginBottom: 28 }}>
        to save smarter, not harder.
      </Text>
      <View style={{ gap: 12 }}>
        {FEATURES.map((feat) => (
          <View key={feat.title} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center" }}>
              <feat.Icon color={C.primary} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontWeight: "900", fontSize: 14, marginBottom: 2 }}>{feat.title}</Text>
              <Text style={{ color: C.textMuted, fontSize: 12 }}>{feat.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function Slide3({ onStart }: { onStart: () => void }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.primarySoft, borderWidth: 1, borderColor: C.primary, alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
        <Heart color={C.primary} size={36} fill={C.primary} />
      </View>
      <Text style={{ color: "white", fontSize: 36, fontWeight: "900", textAlign: "center", letterSpacing: -1, lineHeight: 42, marginBottom: 16 }}>
        {"Your financial\nfreedom\nstarts here."}
      </Text>
      <Text style={{ color: C.textSoft, fontSize: 15, textAlign: "center", lineHeight: 24, marginBottom: 48 }}>
        Join Malaysian students building better money habits — one smart save at a time.
      </Text>
      <TouchableOpacity
        onPress={onStart}
        activeOpacity={0.85}
        style={{ width: "100%", backgroundColor: C.primary, borderRadius: 20, paddingVertical: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}
      >
        <Text style={{ color: "#071009", fontWeight: "900", fontSize: 17 }}>Get Started</Text>
        <ChevronRight color="#071009" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (index: number) => {
    Animated.spring(slideAnim, {
      toValue: -index * width,
      useNativeDriver: true,
      damping: 20,
      stiffness: 120,
    }).start();
    setActiveIndex(index);
    activeIndexRef.current = index;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => {
        // Slides follow finger live
        slideAnim.setValue(-activeIndexRef.current * width + g.dx);
      },
      onPanResponderRelease: (_, g) => {
        const cur = activeIndexRef.current;
        let next = cur;
        if (g.dx < -50 && cur < 2) next = cur + 1;
        else if (g.dx > 50 && cur > 0) next = cur - 1;
        goTo(next);
      },
    })
  ).current;

  return (
    <LinearGradient
      colors={["#0A7E58", "#123C35", "#170725", "#080111"]}
      locations={[0, 0.2, 0.5, 0.92]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>

        {/* Swipeable slide viewport */}
        <View style={{ flex: 1, overflow: "hidden" }} {...panResponder.panHandlers}>
          <Animated.View
            style={{ flexDirection: "row", width: width * 3, flex: 1, transform: [{ translateX: slideAnim }] }}
          >
            <View style={{ width, flex: 1 }}><Slide1 /></View>
            <View style={{ width, flex: 1 }}><Slide2 /></View>
            <View style={{ width, flex: 1 }}><Slide3 onStart={onComplete} /></View>
          </Animated.View>
        </View>

        {/* Dot indicators */}
        <View style={{ paddingBottom: 52, alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() => goTo(i)}
                hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
              >
                <View style={{ width: i === activeIndex ? 28 : 8, height: 8, borderRadius: 4, backgroundColor: i === activeIndex ? C.primary : "rgba(255,255,255,0.22)" }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}
