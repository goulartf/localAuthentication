import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import styles from './Styles';

export default class PinBox extends Component {
  renderText() {
    if (!this.props.hasValue) return null;

    return (
        <Text>•</Text>
    );
  }

  render() {
    return <View style={styles.pinBox}>{this.renderText()}</View>;
  }
}
