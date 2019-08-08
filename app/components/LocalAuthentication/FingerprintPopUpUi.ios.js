import React, { Component } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { NavigationActions } from "react-navigation";
import withNavigation from "react-navigation/src/views/withNavigation";
import { Text, View } from "react-native";
import ShakingImage from "../Utils/ShakingImage";
import styles from "./FingerprintPopupStyles";

const ATTEMPT_TIMES_LIMIT = 3;

class FingerprintPopUpUi extends Component {
  static navigationOptions = {
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: undefined,
      attemptTimesLimit: ATTEMPT_TIMES_LIMIT
    };
  }

  componentDidMount() {
    this.authentication();
  }

  authentication() {
    LocalAuthentication.authenticateAsync("Auth").then(ret => {
      const { success, error, warning } = ret;
      console.log(success, error, warning, ret);

      if (success) {
        this.handlePopupDismissed();
      } else {
        this.authentication();

        this.setState({
          errorMessage: warning
        });
      }
    });
  }

  handlePopupDismissed() {
    const backAction = NavigationActions.back({
      key: null
    });
    this.props.navigation.dispatch(backAction);
  }

  render() {
    const { errorMessage } = this.state;
    const { style, navigation } = this.props;

    if (!errorMessage) {
      return null;
    }

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
