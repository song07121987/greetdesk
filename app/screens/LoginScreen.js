import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  processColor,
  TouchableOpacity
} from 'react-native';

var Browser = require('react-native-browser');
var t = require('tcomb-form-native');
import store from 'react-native-simple-store';
var Form = t.form.Form;
import { Actions } from 'react-native-router-flux';
// here we are: define your domain model
var Person = t.struct({
  login: t.String,              // a required string
  password: t.String,
  //surname: t.maybe(t.String),  // an optional string
  //age: t.Number,               // a required number
  rememberMe: t.Boolean        // a boolean
});

var options = {
  fields: {
password: {
  password: true,
  secureTextEntry: true
}
}

}; // optional rendering options (see documentation)

var styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor: '#6FB8AF',
  },
  input_container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#43a2bf',
    borderColor: '#3b93ad',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

const LoginScreen = React.createClass({

  onPress() {
    var value = this.refs["form"].getValue();
    if (value) {

      fetch('https://greetdesk.com//oauth/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password:value['password'],
          username:value['login'],
          grant_type: "password",
          client_id: "K0mHMqdgO5g-0aAM",
          client_secret: "UQyio4TnZiLd6QzZ4QjyBBt9a7q-4I_8kanUO_UZx9Pr8rfp9MjMRmbcfaRMifRl",

        })
      }).then((response) => response.json())
      .then((responseData) => {
        if (!responseData['error']) {
          console.warn(navigator)
          store
          .save('profile_data', responseData['access_token']).then(() => Actions.accounts({type:'reset'}));
        }

      });
    }

    if (value) { // if validation fails, value will be null
    }
  },

  forgottenPassword() {
    Browser.open('https://greetdesk.com/users/password/new', {
                    showUrlWhileLoading: true,
                    loadingBarTintColor: processColor('#d64bbd'),
                    navigationButtonsHidden: false,
                    showActionButton: true,
                    showDoneButton: true,
                    doneButtonTitle: 'Done',
                    showPageTitles: true,
                    disableContextualPopupMenu: false,
                    hideWebViewBoundaries: false,
                    buttonTintColor: processColor('#d64bbd')
                  });
  },

  signup()  {
    Browser.open('https://greetdesk.com/users/sign_up', {
                    showUrlWhileLoading: true,
                    loadingBarTintColor: processColor('#d64bbd'),
                    navigationButtonsHidden: false,
                    showActionButton: true,
                    showDoneButton: true,
                    doneButtonTitle: 'Done',
                    showPageTitles: true,
                    disableContextualPopupMenu: false,
                    hideWebViewBoundaries: false,
                    buttonTintColor: processColor('#d64bbd')
                  });
  },

  render() {
    return (
      <View style={styles.container}>

        <Image style={{position: 'absolute', alignSelf: 'flex-end', left: 0}} source={require('../img/big-g.png')} />
        <View style = {styles.input_container}>
          <View style={{alignItems:'center', marginTop : 50}} >
            <Image style={{width : 186, height : 40, justifyContent : 'center'}} source={require('../img/logo-footer.png')} />
          </View>
          <Form
            ref="form"
            type={Person}
            options={options}
          />
          <TouchableOpacity style={{alignSelf : 'stretch', backgroundColor:'#C7E3E0', borderColor: '#C7E3E0', borderWidth: 1, borderRadius: 8, justifyContent: 'center', padding : 10, marginTop : 40,}} onPress={() => {
              this.onPress();
            }}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{alignSelf : 'stretch', justifyContent: 'center', padding : 10, marginTop : 20,}} onPress={() => {
              this.forgottenPassword();
            }}>
            <Text style={styles.buttonText}>Forgotten password?</Text>
          </TouchableOpacity>

        </View>

        <View style={{position: 'absolute', bottom : 40, left : 50, right : 50, alignItems:'center'}}>
          <TouchableOpacity style={{alignItems:'center'}} onPress={() => {
            this.signup();
            }}>
            <Text style={styles.buttonText}>Create a new Greetdesk account</Text>
         </TouchableOpacity>
        </View>

      </View>
    )
  }
});

export default LoginScreen;
