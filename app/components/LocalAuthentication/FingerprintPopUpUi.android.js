import React, { Component } from "react";
import {
  BackHandler,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import styles from "./FingerprintPopupStyles";
import * as LocalAuthentication from "expo-local-authentication";
import ShakingImage from "../Utils/ShakingImage";
import { NavigationActions } from "react-navigation";

class FingerprintPopUpUi extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      attemptTimes: 0
    };
    this.backHandler = null;
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackPress(false)
    );
    this.authentication();
  }

  /**
   * ERROS: https://forums.expo.io/t/sdk34-local-authentication-error-in-expo-app/26201
   * @returns {Promise<void>}
   */
  async authentication() {

    // setTimeout was implemeted to minimize errors not indentified on expo
    setTimeout(async () => {
      LocalAuthentication.cancelAuthenticate();
      const ret = await LocalAuthentication.authenticateAsync();

      let { success, error, message } = ret;
      console.log(ret);
      if (success) {
        this.handlePopupDismissed();
      } else {
        let { attemptTimes } = this.state;
        attemptTimes++;

        // I put this conditional to prevent expo bugs and not enter in infinite loop
        if (attemptTimes >= 10) {
          message =
            "Ocorreu algum erro inesperado, tente com o PIN ou reinicie seu aplicativo.";
          return LocalAuthentication.cancelAuthenticate();
        }

        if (error === "authentication_failed") {
          this.printImage.shake();
        }

        this.authentication();

        this.setState({
          errorMessage: message,
          attemptTimes
        });
      }
    }, 1000);

  }

  componentWillUnmount() {
    this.backHandler.remove();
    LocalAuthentication.cancelAuthenticate();
  }

  handleBackPress = back => {
    return true;
  };

  handlePopupDismissed() {
    const backAction = NavigationActions.back({
      key: null
    });
    this.props.navigation.dispatch(backAction);
  }

  render() {
    const { errorMessage } = this.state;
    const { style, navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>
          <ShakingImage
            ref={instance => {
              this.printImage = instance;
            }}
            style={styles.logo}
            source={require("../../../assets/finger_print.png")}
          />

          <TouchableOpacity onPress={() => navigation.push("PinScreen")}>
            <Text>PIN CODE</Text>
          </TouchableOpacity>

          <Text
            ref={instance => {
              this.description = instance;
            }}
            style={styles.errorMessage}
          >
            {errorMessage}
          </Text>
        </View>
      </View>
    );
  }
}

export default FingerprintPopUpUi;
