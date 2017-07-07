import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Alert,
  Config,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../styles/layout.js';
import store from 'react-native-simple-store';
import { Actions } from 'react-native-router-flux';


class AccountsScreen extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      visible:true,
      dataSource: ds.cloneWithRows([]),
    };
  }

  _pressRow(rowID) {
    Actions.events({account_id:rowID});
  }

  renderRightButton = () => {
    return(
      <TouchableOpacity onPress={this.onLogout}>
      <Text style={{color : '#FFFFFF', fontSize:15}}>Logout</Text>
      </TouchableOpacity>
      )
  }

  onLogout()  {
    store.save('profile_data', null).then(() => Actions.login({type:'reset'}));
  }

  componentDidMount(  ) {

      Actions.refresh({renderLeftButton:this.renderLeftButton, renderRightButton:this.renderRightButton})
      store.get('profile_data').then((data)=> {
        if (data === null || data === undefined) {
            // redirect to home page
        } else {
          fetch("https://greetdesk.com/api/v1/accounts.json",
          {method: "GET",
        headers: {
          'Authorization': 'Bearer ' + data,
        }}).then((response) => response.json())
            .then((responseData) => {
              this.setState({visible:false, dataSource: this.state.dataSource.cloneWithRows(responseData)})
        }).catch((error) => {
            Alert.alert(
              'Internet connection is not working, try to open application once again',
              'Internet problem',

            )
        });
        }
      })

  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.visible}/>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <TouchableHighlight onPress={() => {
              this._pressRow(rowData.id);
            }}><Text style={styles.list_item}>{rowData.name} </Text></TouchableHighlight>}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />

        <View style={{position: 'absolute', bottom : 40, left : 100, right : 100, alignItems:'center'}} >
        <Image style={{width : 140, height : 30, justifyContent : 'center'}} source={require('../img/logo-footer.png')} />
        </View>

      </View>
    );
  }
}


export default AccountsScreen;
