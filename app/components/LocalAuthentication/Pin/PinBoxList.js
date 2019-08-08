import React, { Component } from 'react';
import { TouchableOpacity, View} from 'react-native';

import PinBox from './PinBox';
import styles from './Styles';

export default class PinBoxList extends Component {
  renderPills() {
    let pills = [];

    for (var i = 0; i < this.props.pinLength; i++) {
      pills.push(this.renderPill(i + 1));
    }

    return pills;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.handleOnPressInput}>
        <View style={styles.pinBoxList}>{this.renderPills()}</View>
      </TouchableOpacity>
    );
  }

  renderPill(index) {
    const { pinValueLength } = this.props;

    return (
      <PinBox
        key={index}
        hasValue={pinValueLength && pinValueLength >= index}
      />
    );
  }
}
