import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Button,
  KeyboardAvoidingView
} from "react-native";

import PinBoxList from "./PinBoxList";
import styles from "./Styles";

import LocalAuthenticationService from "../../../services/LocalAuthenticationService";
const localAuthenticationService = new LocalAuthenticationService();

export default class PinScreenRegister extends Component {
  state = {
    maxPinLength: 4,
    pinValue: "",
    pin: "",
    title: "Register PIN:"
  };

  componentDidMount() {}

  onPinEntry = pinValue => {
    if (pinValue.length && isNaN(pinValue)) return;
    this.setState({ pinValue }, this.onPinEntered);
  };

  async onPinEntered() {
    const { navigation } = this.props;
    if (this.state.pinValue.length < this.state.maxPinLength) return;

    if (this.state.pin === "") {
      this.setState({
        pin: this.state.pinValue,
        title: "Confirm PIN:",
        pinValue: ""
      });
      return;
    }

    if (this.state.pinValue === this.state.pin) {
      try {
        await localAuthenticationService.setPin(this.state.pin);
        alert("Registered! Now you can use your fingerprint");
        navigation.goBack();
        navigation.state.params.setLocalAuthentication(true);
      } catch (e) {
        alert("OPS! Something is wrong. Try Again.");
        navigation.goBack();
        navigation.state.params.setLocalAuthentication(false);
      }

      return;
    } else {
      alert("Pins are not match! Try Again!");
      this.setState({
        pinValue: ""
      });
      return;
    }
  }

  render() {
    const { title } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.pinView}>
          <KeyboardAvoidingView enabled>
            <Text style={styles.pinPromptText}>{title}</Text>
            <PinBoxList
              pinLength={this.state.maxPinLength}
              pinValueLength={this.state.pinValue && this.state.pinValue.length}
              handleOnPressInput={this.handleOnPressInput}
            />
            <Button
              title={"Cancel"}
              danger
              style={styles.btnCancel}
              onPress={() => this.props.navigation.goBack()}
            />
          </KeyboardAvoidingView>
        </View>
        <TextInput
          autoFocus={true}
          blurOnSubmit={false}
          defaultValue={this.state.pinValue}
          enablesReturnKeyAutomatically={false}
          keyboardType="phone-pad"
          maxLength={this.state.maxPinLength}
          onChangeText={this.onPinEntry}
          style={styles.input}
        />
      </View>
    );
  }
}
