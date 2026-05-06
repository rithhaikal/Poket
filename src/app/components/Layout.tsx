import { Text, TouchableOpacity, View } from "react-native";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Flame, Home as HomeIcon, Target, TrendingUp, User as UserIcon } from "lucide-react-native";
import { Home } from "../screens/Home";
import { SpendingDNA } from "../screens/SpendingDNA";
import { SavingsGoals } from "../screens/SavingsGoals";
import { StreakTracker } from "../screens/StreakTracker";
import { Challenge } from "../screens/Challenge";
import { Profile } from "../screens/Profile";
import { DebtRadar } from "../screens/DebtRadar";

const Tab = createBottomTabNavigator();

const iconMap: Record<string, any> = {
  Home: HomeIcon,
  Spending: TrendingUp,
  Goals: Target,
  Streak: Flame,
  Profile: UserIcon,
};

function PoketTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const visibleRoutes = state.routes.filter((route) => !["Challenge", "DebtRadar"].includes(route.name));

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 76,
        paddingTop: 8,
        paddingHorizontal: 10,
        backgroundColor: "#080111",
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.08)",
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      {visibleRoutes.map((route) => {
        const currentRouteName = state.routes[state.index]?.name;
        const routeIndex = state.routes.findIndex((item) => item.key === route.key);
        const isFocused = state.index === routeIndex || (currentRouteName === "Challenge" && route.name === "Profile");
        const options = descriptors[route.key]?.options ?? {};
        const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : route.name;
        const Icon = iconMap[route.name] ?? HomeIcon;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
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
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isFocused ? "rgba(32, 230, 156, 0.14)" : "transparent",
              }}
            >
              <Icon
                color={isFocused ? "#20E69C" : "#A89AB8"}
                size={22}
                strokeWidth={isFocused ? 2.8 : 2.2}
              />
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: isFocused ? "#20E69C" : "#A89AB8",
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
  return (
    <Tab.Navigator
      tabBar={(props) => <PoketTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#080111" },
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
