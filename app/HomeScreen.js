import React, { Component } from "react";
import { StyleSheet, Text, View, Switch, Platform, Button } from "react-native";
import LocalAuthenticationService, {
  AUTH_LOCATION_DISABLE,
  AUTH_LOCATION_ENABLE
} from "./services/LocalAuthenticationService";
import * as LocalAuthentication from "expo-local-authentication";

const localAuthenticationService = new LocalAuthenticationService();

export default class HomeScreen extends Component {
  state = {
    localAuthenticationAvailable: true,
    localAuthentication: false
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
      this.setState({ localAuthentication });
    } else {
      this.setState({ localAuthenticationAvailable: false });
    }

  }

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
                <Button onPress={ () => navigation.navigate('FingerprintPopup')} title='Click Here to try' />
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
