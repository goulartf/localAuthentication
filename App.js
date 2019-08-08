import React, { Component } from "react";
import { StyleSheet, Text, View, Switch, Platform } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./app/HomeScreen";
import FingerprintPopup from "./app/components/LocalAuthentication/FingerprintPopup";
import PinScreen from "./app/components/LocalAuthentication/Pin/PinScreen";
import PinScreenRegister from "./app/components/LocalAuthentication/Pin/PinScreenRegister";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    PinScreenRegister,
    FingerprintPopup,
    PinScreen
  },
  {
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
