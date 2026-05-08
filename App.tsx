import "./global.css";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Layout } from "./src/app/components/Layout";
import { AppProvider } from "./src/context/AppContext";
import { Onboarding } from "./src/app/screens/Onboarding";
import { useAppContext } from "./src/context/AppContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootNavigator() {
  const { isOnboarded, completeOnboarding } = useAppContext();
  if (!isOnboarded) return <Onboarding onComplete={completeOnboarding} />;
  return <Layout />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={DarkTheme}>
          <StatusBar style="light" translucent backgroundColor="transparent" />
          <RootNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
