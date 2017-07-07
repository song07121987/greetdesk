import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  Config,
  TouchableHighlight,
  View,
  Image,
  ScrollView,
} from 'react-native';

import GridView from 'react-native-gridview';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../styles/layout.js';
import store from 'react-native-simple-store';

import { Actions } from 'react-native-router-flux';

class ContactScreen extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      visible:true,
      dataSource: ds.cloneWithRows([]),
    };
  }

  _pressRow(rowID) {
    Actions.editcontact({account_id:this.props.account_id,
    event_id: this.props.event_id,
    contact_id: rowID});
  }

  componentWillReceiveProps() {

      this.setState({visible:true})
      store.get('profile_data').then((data)=> {
        if (data === null || data === undefined) {
            // redirect to home page
        } else {
          fetch("https://greetdesk.com/api/v1/contacts/" + this.props.contact_id + ".json",
          {method: "GET",
        headers: {
          'Authorization': 'Bearer ' + data,
        }}).then((response) => response.json())
            .then((responseData) => {
              this.setState({visible:false, id:responseData['id'], name: responseData['name'], email: responseData['email'], tags: responseData['tags'].join(', '), dataSource: this.state.dataSource.cloneWithRows(responseData['tags'])})

        }).catch((error) => {
              //this.setState({visible:false})
              console.warn(error);
        });
        }
      })
  }

  componentDidMount(  ) {

    store.get('profile_data').then((data)=> {
      if (data === null || data === undefined) {
          // redirect to home page
      } else {
        fetch("https://greetdesk.com/api/v1/contacts/" + this.props.contact_id + ".json",
        {method: "GET",
      headers: {
        'Authorization': 'Bearer ' + data,
      }}).then((response) => response.json())
          .then((responseData) => {
            this.setState({visible:false, id:responseData['id'], name: responseData['name'], email: responseData['email'], tags: responseData['tags'].join(', '), dataSource: this.state.dataSource.cloneWithRows(responseData['tags'])})

      }).catch((error) => {
            //this.setState({visible:false})
            console.warn(error);
      });
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
      <Spinner visible={this.state.visible}/>
      <ScrollView scrollEnabled = {false}>
        <Text style={styles.label_style}>Name</Text>
        <Text style={styles.text_style}>{this.state.name}</Text>
        <Text style={styles.label_style}>Email</Text>
        <Text style={styles.text_style}>{this.state.email}</Text>
        <Text style={styles.label_style}>Tags</Text>
        
        <ListView
            scrollEnabled = {false}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <View style={{paddingLeft : 20, paddingRight : 20, paddingTop:5,}}><View style={{borderColor : '#29695F', borderWidth:1, borderRadius:5, alignSelf:'flex-start'}}><Text style={{alignSelf:'flex-start', padding:5, fontSize:18, color:'#FFFFFF', backgroundColor:'#29695F', }}>{rowData}</Text></View></View>}
          />

        <TouchableHighlight style={{backgroundColor:'#C7E3E0', borderColor: '#C7E3E0', borderWidth: 1, borderRadius: 8, justifyContent: 'center', padding : 10, margin : 20}} onPress={() => {
          this._pressRow(this.state.id); }}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableHighlight>

        </ScrollView>
        <View style={{position: 'absolute', bottom : 40, left : 100, right : 100, alignItems:'center'}} >
          <Image style={{width : 140, height : 30, justifyContent : 'center'}} source={require('../img/logo-footer.png')} />
        </View>

      </View>
    );
  }
}


export default ContactScreen;

//name, email, tags
