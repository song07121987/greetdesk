/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Col, Row, Grid } from "react-native-easy-grid";
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  AlertIOS,
  View
} from 'react-native';

import App from './app/App';

AppRegistry.registerComponent('greetdesk', () => App);
