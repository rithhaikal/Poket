import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { Flame, Home as HomeIcon, Target, TrendingUp, User as UserIcon } from "lucide-react-native";
import { Home } from "../screens/Home";
import { SpendingDNA } from "../screens/SpendingDNA";
import { SavingsGoals } from "../screens/SavingsGoals";
import { StreakTracker } from "../screens/StreakTracker";
import { Challenge } from "../screens/Challenge";
import { Profile } from "../screens/Profile";
import { DebtRadar } from "../screens/DebtRadar";
import { useTheme } from "../../theme";

const Tab = createMaterialTopTabNavigator();

const iconMap: Record<string, any> = {
  Home: HomeIcon,
  Spending: TrendingUp,
  Goals: Target,
  Streak: Flame,
  Profile: UserIcon,
};

function PoketTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  const C = useTheme();
  const visibleRoutes = state.routes.filter((route) => !["Challenge", "DebtRadar"].includes(route.name));
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 64 + bottomPadding,
        paddingTop: 8,
        paddingBottom: bottomPadding,
        paddingHorizontal: 10,
        backgroundColor: C.navBg,
        borderTopWidth: 1,
        borderTopColor: C.borderSoft,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {visibleRoutes.map((route) => {
        const currentRouteName = state.routes[state.index]?.name;
        const routeIndex = state.routes.findIndex((item) => item.key === route.key);
        const isFocused = state.index === routeIndex || (["Challenge", "DebtRadar"].includes(currentRouteName) && route.name === "Profile");
        const options = descriptors[route.key]?.options ?? {};
        const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : route.name;
        const Icon = iconMap[route.name] ?? HomeIcon;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (currentRouteName !== route.name && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            activeOpacity={0.82}
            style={{
              flex: 1,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 36,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isFocused && (
                <View style={{ position: "absolute", top: -8, width: 40, height: 3, backgroundColor: "#7136FD", borderRadius: 2 }} />
              )}
              <Icon
                color={isFocused ? C.tabIndicator : C.tabInactive}
                size={22}
                strokeWidth={isFocused ? 2.8 : 2.2}
              />
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: isFocused ? C.tabIndicator : C.tabInactive,
                fontSize: 10,
                lineHeight: 13,
                fontWeight: isFocused ? "800" : "600",
                marginTop: 2,
                textAlign: "center",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function Layout() {
  const C = useTheme();
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={(props) => <PoketTabBar {...props} />}
      screenOptions={{
        swipeEnabled: false,
        animationEnabled: true,
        sceneStyle: { backgroundColor: C.bg },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Spending" component={SpendingDNA} />
      <Tab.Screen name="Goals" component={SavingsGoals} />
      <Tab.Screen name="Streak" component={StreakTracker} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Challenge" component={Challenge} />
      <Tab.Screen name="DebtRadar" component={DebtRadar} />
    </Tab.Navigator>
  );
}
