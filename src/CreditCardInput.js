import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules, View, Text, StyleSheet, ScrollView, Dimensions, TextInput,
} from "react-native";
import {ViewPropTypes, TextPropTypes} from 'deprecated-react-native-prop-types';

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  form: {
    marginTop: 20,
    width: "100%",
    padding: 20,
  },
  inputContainer: {
    // marginLeft: 20,
    width: "100%",
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
});

const CVC_INPUT_WIDTH = 70;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get("window").width - EXPIRY_INPUT_WIDTH - CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120; // https://github.com/yannickcr/eslint-plugin-react/issues/106

/* eslint react/prop-types: 0 */ export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: TextPropTypes.style,
    inputStyle: TextPropTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,
    isFormDirty: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "Cardholder name",
      number: "Card number",
      expiry: "Expiry date",
      cvc: "CVC",
      postalCode: "Postal code",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
    isFormDirty: false,
  };

  componentDidMount = () => this._focus(this.props.focused);

  UNSAFE_componentWillReceiveProps = (newProps) => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  Form = createRef()

  _focus = (field) => {
    if (!field) return;

    const scrollResponder = this.Form.current.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      (e) => {
        throw e;
      },
      (x) => {
        scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
        this.refs[field].focus();
      },
    );
  };

  _inputProps = (field) => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: {
        number, expiry, cvc, name, type,
      },
      focused,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
      isFormDirty,
    } = this.props;

    return (
      <View style={s.container}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc} />
        <ScrollView ref={this.Form} keyboardShouldPersistTaps="always" scrollEnabled={allowScroll} showsHorizontalScrollIndicator={false} style={s.form}>
          <CCInput
            {...this._inputProps("number")}
            keyboardType="numeric"
            isFormDirty={isFormDirty}
            containerStyle={[s.inputContainer, inputContainerStyle, { width: "100%" }]} />
          {requiresName && (
            <CCInput
              {...this._inputProps("name")}
              isFormDirty={isFormDirty}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: "100%" }]} />
          )}
          <CCInput
            {...this._inputProps("expiry")}
            keyboardType="numeric"
            isFormDirty={isFormDirty}
            containerStyle={[s.inputContainer, inputContainerStyle, { width: "100%" }]} />
          {requiresCVC && (
            <CCInput
              {...this._inputProps("cvc")}
              keyboardType="numeric"
              isFormDirty={isFormDirty}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: "100%" }]} />
          )}
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps("postalCode")}
              keyboardType="numeric"
              isFormDirty={isFormDirty}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: "100%" }]} />
          )}
        </ScrollView>
      </View>
    );
  }
}
