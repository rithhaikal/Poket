import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export type AuraType = 'origin' | 'plasma' | 'void' | 'quantum';

interface AuraCoreProps {
  type: AuraType;
  size: number;
  animated?: boolean;
}

export const AURA_CONFIG: Record<
  AuraType,
  { colors: readonly [string, string, string]; glow: string; highlight: string; name: string }
> = {
  origin: {
    colors: ['#B08FFF', '#7136FD', '#3D1A8C'],
    glow: 'rgba(113, 54, 253, 0.55)',
    highlight: 'rgba(180, 150, 255, 0.35)',
    name: 'Origin Core',
  },
  plasma: {
    colors: ['#FFB347', '#FF6A00', '#CC2200'],
    glow: 'rgba(255, 106, 0, 0.60)',
    highlight: 'rgba(255, 190, 100, 0.35)',
    name: 'Plasma Burst',
  },
  void: {
    colors: ['#7A00E8', '#2A0080', '#08082E'],
    glow: 'rgba(100, 0, 220, 0.50)',
    highlight: 'rgba(130, 50, 255, 0.25)',
    name: 'Ethereal Void',
  },
  quantum: {
    colors: ['#00F0FF', '#00A8CC', '#005B8E'],
    glow: 'rgba(0, 229, 255, 0.60)',
    highlight: 'rgba(0, 240, 255, 0.35)',
    name: 'Quantum Flux',
  },
};

export const AuraCore: React.FC<AuraCoreProps> = ({ type, size, animated = true }) => {
  const cfg = AURA_CONFIG[type] ?? AURA_CONFIG.origin;

  const ring1Scale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(1);
  const ring2Opacity = useSharedValue(0);
  const coreScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.55);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!animated) return;

    // Ring 1 — sonar ping
    ring1Scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1.8, { duration: 2200, easing: Easing.out(Easing.cubic) }),
      ),
      -1,
      false,
    );
    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 0 }),
        withTiming(0, { duration: 2200, easing: Easing.out(Easing.quad) }),
      ),
      -1,
      false,
    );

    // Ring 2 — offset by 1100 ms
    timerRef.current = setTimeout(() => {
      ring2Scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.8, { duration: 2200, easing: Easing.out(Easing.cubic) }),
        ),
        -1,
        false,
      );
      ring2Opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 0 }),
          withTiming(0, { duration: 2200, easing: Easing.out(Easing.quad) }),
        ),
        -1,
        false,
      );
    }, 1100);

    // Core breathe
    coreScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.96, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    // Ambient glow pulse
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.35, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [animated, type]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));
  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const ringBase = {
    position: 'absolute' as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: cfg.glow,
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow blob */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size * 1.15,
            height: size * 1.15,
            borderRadius: size * 0.575,
            backgroundColor: cfg.glow,
          },
          glowStyle,
        ]}
      />

      {/* Sonar rings */}
      <Animated.View style={[ringBase, ring1Style]} />
      <Animated.View style={[ringBase, ring2Style]} />

      {/* Inner orb */}
      <Animated.View
        style={[{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }, coreStyle]}
      >
        <LinearGradient
          colors={cfg.colors}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Specular highlight */}
        <View
          style={{
            position: 'absolute',
            top: size * 0.08,
            left: size * 0.12,
            width: size * 0.38,
            height: size * 0.38,
            borderRadius: size * 0.19,
            backgroundColor: cfg.highlight,
          }}
        />
        {/* Depth shadow */}
        <View
          style={{
            position: 'absolute',
            bottom: size * 0.1,
            right: size * 0.1,
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size * 0.11,
            backgroundColor: 'rgba(0,0,0,0.22)',
          }}
        />
      </Animated.View>
    </View>
  );
};
