import React, { Component } from "react";
import {
  AppState,
  StyleSheet,
  Text,
  View,
  Switch,
  Platform,
  Button
} from "react-native";
import LocalAuthenticationService, {
  AUTH_LOCATION_DISABLE,
  AUTH_LOCATION_ENABLE
} from "./services/LocalAuthenticationService";
import * as LocalAuthentication from "expo-local-authentication";

const localAuthenticationService = new LocalAuthenticationService();

export default class HomeScreen extends Component {
  state = {
    localAuthenticationAvailable: true,
    localAuthentication: false,
    appState: AppState.currentState
  };

  async componentDidMount() {
    const hasHardwareAsync = await LocalAuthentication.hasHardwareAsync();
    const supportedAuthenticationTypesAsync = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolledAsync = await LocalAuthentication.isEnrolledAsync();
    if (
      hasHardwareAsync &&
      isEnrolledAsync &&
      supportedAuthenticationTypesAsync.indexOf(1) !== -1
    ) {
      const localAuthentication = await localAuthenticationService.isEnable();

      if (localAuthentication) {
        this.runLocalAuthentication();
        AppState.addEventListener("change", this._handleAppStateChange);
      }

      this.setState({ localAuthentication });
    } else {
      this.setState({ localAuthenticationAvailable: false });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      this.runLocalAuthentication();
    }
    this.setState({ appState: nextAppState });
  };

  updatePreferenceLocalAuthentication = async val => {
    if (val && Platform.OS === "android") {
      this.props.navigation.navigate("PinScreenRegister", {
        setLocalAuthentication: this.setLocalAuthentication
      });
    } else {
      this.setLocalAuthentication(val);
    }
  };

  setLocalAuthentication = async val => {
    this.setState({ localAuthentication: val });

    try {
      await localAuthenticationService.set(
        val ? AUTH_LOCATION_ENABLE : AUTH_LOCATION_DISABLE
      );
    } catch (e) {
      console.log(e);
    }
  };

  runLocalAuthentication() {
    let localAuthenticationService = new LocalAuthenticationService();
    localAuthenticationService.isEnable().then(enable => {
      if (enable) {
        this.props.navigation.navigate("FingerprintPopup");
      }
    });
  }

  render() {
    const { localAuthenticationAvailable, localAuthentication } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        {localAuthenticationAvailable && (
          <React.Fragment>
            <Text>LocalAuthentication</Text>
            <Switch
              value={localAuthentication}
              onValueChange={val => {
                this.updatePreferenceLocalAuthentication(val);
              }}
              trackColor={"#1A4854"}
              thumbColor={"#eee"}
            />

            {localAuthentication && (
              <Button
                onPress={() => navigation.navigate("FingerprintPopup")}
                title="Click Here to try"
              />
            )}
          </React.Fragment>
        )}
        {!localAuthenticationAvailable && (
          <Text>Your Device not suupport this auth.</Text>
        )}
      </View>
    );
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
