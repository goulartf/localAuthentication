import React, { Component } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";

import PinBoxList from "./PinBoxList";
import styles from "./Styles";
import ShakingText from "../../Utils/ShakingText";

import LocalAuthenticationService from "../../../services/LocalAuthenticationService";
const localAuthenticationService = new LocalAuthenticationService();

const ATTEMPT_TIMES_LIMIT = 3;

export default class PinScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxPinLength: 4,
      pinValue: "",
      errorMessage: "",
      attemptTimesLimit: ATTEMPT_TIMES_LIMIT
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => this.handleBackPress
    );
  }

  handleBackPress = back => {
    return false;
  };

  onPinEntry = pinValue => {
    if (pinValue.length && isNaN(pinValue)) return;

    this.setState({ pinValue }, this.onPinEntered);
  };

  onPinEntered = async () => {
    if (this.state.pinValue.length < this.state.maxPinLength) return;

    const pw = await localAuthenticationService.getPin();

    if (this.state.pinValue === pw) {
      //Trick to back current screen
      setTimeout(() => {
        this.props.navigation.goBack(null);
        this.props.navigation.goBack(null);
      }, 50);
    } else {
      let attemptTimesLimit = this.state.attemptTimesLimit;
      attemptTimesLimit--;

      if (attemptTimesLimit <= 0) {
        this.setState({
          errorMessage: "Blocked, try later!",
          attemptTimesLimit: attemptTimesLimit
        });
      } else {
        this.setState({
          pinValue: "",
          errorMessage: "PIN not match, try again: ",
          attemptTimesLimit: attemptTimesLimit
        });
      }
      this.description.shake();
    }
  };

  render() {
    const { errorMessage } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.pinView}>
          <Text style={styles.pinPromptText}>Insira o Pin:</Text>
          <ShakingText
            ref={instance => {
              this.description = instance;
            }}
            style={styles.errorMessage}
          >
            {errorMessage}
          </ShakingText>
          <PinBoxList
            pinLength={this.state.maxPinLength}
            pinValueLength={this.state.pinValue && this.state.pinValue.length}
          />
        </View>
        <TextInput
          autoFocus={true}
          blurOnSubmit={false}
          defaultValue={this.state.pinValue}
          enablesReturnKeyAutomatically={false}
          keyboardType="numeric"
          maxLength={this.state.maxPinLength}
          onChangeText={this.onPinEntry}
          style={styles.input}
        />
      </View>
    );
  }
}
