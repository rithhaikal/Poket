import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Layout } from "./src/app/components/Layout";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Layout />
    </NavigationContainer>
  );
}
