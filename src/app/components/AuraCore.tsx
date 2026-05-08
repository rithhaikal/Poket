import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

  // RN Animated values
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const coreScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.55)).current;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!animated) return;

    const sonarLoop = (scale: Animated.Value, opacity: Animated.Value) =>
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1.8, duration: 2200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.75, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 2200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          ]),
        ])
      );

    sonarLoop(ring1Scale, ring1Opacity).start();

    timerRef.current = setTimeout(() => {
      sonarLoop(ring2Scale, ring2Opacity).start();
    }, 1100);

    Animated.loop(
      Animated.sequence([
        Animated.timing(coreScale, { toValue: 1.06, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(coreScale, { toValue: 0.96, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.85, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.35, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ring1Scale.stopAnimation();
      ring1Opacity.stopAnimation();
      ring2Scale.stopAnimation();
      ring2Opacity.stopAnimation();
      coreScale.stopAnimation();
      glowOpacity.stopAnimation();
    };
  }, [animated, type]);

  const ringBase: any = {
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
          { opacity: glowOpacity },
        ]}
      />

      {/* Sonar rings */}
      <Animated.View style={[ringBase, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />
      <Animated.View style={[ringBase, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />

      {/* Inner orb */}
      <Animated.View
        style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', transform: [{ scale: coreScale }] }}
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
