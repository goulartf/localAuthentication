import React, { Component } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import FingerprintPopUpUi from './FingerprintPopUpUi';

class FingerprintPopup extends Component {
  state = {
    localAuthenticationAvailable: true,
  };
  componentDidMount() {
    this.initAuth();
  }

  /**
   * https://docs.expo.io/versions/latest/sdk/local-authentication/
   */
  async initAuth() {
    const hasHardwareAsync = await LocalAuthentication.hasHardwareAsync();
    const supportedAuthenticationTypesAsync = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolledAsync = await LocalAuthentication.isEnrolledAsync();

    if (
      !hasHardwareAsync &&
      !isEnrolledAsync &&
      !(supportedAuthenticationTypesAsync.indexOf(1) !== -1)
    ) {
      this.setState({ localAuthenticationAvailable: false });
    }
  }

  render() {
    const { localAuthenticationAvailable } = this.state;

    if (!localAuthenticationAvailable) return null;

    return <FingerprintPopUpUi navigation={this.props.navigation} />;
  }
}

export default FingerprintPopup;
