import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {ViewPropTypes, TextPropTypes} from 'deprecated-react-native-prop-types';

const s = StyleSheet.create({
  baseInputStyle: {
    color: 'black',
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(['valid', 'invalid', 'incomplete']),

    containerStyle: ViewPropTypes.style,
    inputStyle: TextPropTypes.style,
    labelStyle: TextPropTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),
    isFormDirty: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    value: '',
    status: 'incomplete',
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
    additionalInputProps: {},
    isFormDirty: false,
  };

  UNSAFE_componentWillReceiveProps = newProps => {
    const {status, value, onBecomeEmpty, onBecomeValid, field} = this.props;
    const {status: newStatus, value: newValue} = newProps;

    if (value !== '' && newValue === '') onBecomeEmpty(field);
    if (status !== 'valid' && newStatus === 'valid') onBecomeValid(field);
  };

  input = createRef();

  focus = () => this.input.current.focus();

  _onFocus = () => this.props.onFocus(this.props.field);

  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const {
      label,
      value,
      placeholder,
      status,
      keyboardType,
      containerStyle,
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      additionalInputProps,
      isFormDirty,
    } = this.props;
    let isError = (isFormDirty && !value) || status === 'invalid';
    return (
      <TouchableOpacity onPress={this.focus} activeOpacity={0.99}>
        <View
          style={[
            containerStyle,
            {borderBottomColor: isError ? 'red' : '#212121'},
          ]}
        >
          {!!label && <Text style={[labelStyle]}>{label}</Text>}
          <TextInput
            ref={this.input}
            {...additionalInputProps}
            keyboardType={keyboardType}
            autoCapitalise="words"
            autoCorrect={false}
            style={[
              s.baseInputStyle,
              inputStyle,
              validColor && status === 'valid'
                ? {color: validColor}
                : invalidColor && status === 'invalid'
                ? {color: invalidColor}
                : {},
              {
                backgroundColor:
                isError ? '#ffefef' : 'transparent',
                height: 30,
              },
            ]}
            underlineColorAndroid="transparent"
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            value={value}
            onFocus={this._onFocus}
            onChangeText={this._onChange}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
