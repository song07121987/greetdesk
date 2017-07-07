import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  Config,
  Image,
  TouchableHighlight,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import ContactsHeader from '../components/ContactsHeader.js';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../styles/layout.js';
import store from 'react-native-simple-store';
import Display from 'react-native-display';

import { Actions } from 'react-native-router-flux';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

class ContactsScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      visible: true,
      input_text:'',
      dataSource: ds.cloneWithRows([]),
      data_array:[],
      enable : false,
    };
  }

  changeStatus()  {
    let toggel = !this.state.enable;
    this.setState({enable:toggel});
  }

  _pressRow(rowID) {
    Actions.contact({account_id:this.props.account_id,
    event_id: this.props.event_id,
    contact_id: rowID});
  }

  addContact()  {
    Actions.new_contact();
  }

  renderRightButton = () => {
    return(
      <TouchableOpacity onPress={this.addContact}>
        <Text style={styles.add_button}>+</Text>
      </TouchableOpacity>
      )
  }

  onSwipeDown(gestureState) {
    this.setState({enable:false});
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.account_list != this.props.account_list) {
      this.setState({input_text:''})
      store.get('profile_data').then((data)=> {
        if (data === null || data === undefined) {
            // redirect to home page
        } else {
          fetch("https://greetdesk.com/api/v1/accounts/" + this.props.account_id + "/contacts.json",
          {method: "GET",
        headers: {
          'Authorization': 'Bearer ' + data,
        }}).then((response) => response.json())
            .then((responseData) => {
              this.setState({visible:false, enable:false, data_array: responseData, dataSource: this.state.dataSource.cloneWithRows(responseData)})

        }).catch((error) => {
              this.setState({visible:false})
              console.warn(error);  
        });
        }
      })
    }
  }

  componentDidMount(  ) {

    Actions.refresh({renderLeftButton:this.renderLeftButton, renderRightButton:this.renderRightButton})
    store.get('profile_data').then((data)=> {
      if (data === null || data === undefined) {
          // redirect to home page
      } else {
        fetch("https://greetdesk.com/api/v1/accounts/" + this.props.account_id + "/contacts.json",
        {method: "GET",
      headers: {
        'Authorization': 'Bearer ' + data,
      }}).then((response) => response.json())
          .then((responseData) => {
            this.setState({visible:false, enable:false, isSearching:false, data_array: responseData, dataSource: this.state.dataSource.cloneWithRows(responseData)})

      }).catch((error) => {
            this.setState({visible:false})
            console.warn(error);
      });
      }
    })


  }

  render() {
    return (
      <View style={styles.container}>
      <GestureRecognizer
        onSwipeDown = {(state) => this.onSwipeDown(state)}>
      <Display enable = {this.state.enable}>
      <View style={styles.search_container}>
        <TextInput
          style={styles.input}
          placeholder="SEARCH"
          autoFocus={true}
          value={this.state.input_text}
          onChangeText={(text) =>{
              this.setState({input_text:text})
              var data_array = this.state.data_array;
              var rows = [];

              for (var i=0; i < data_array.length; i++) {
                 var stateName = data_array[i]['name'].toLowerCase();

                 if(stateName.search(text.toLowerCase()) !== -1){
                   rows.push({'id': data_array[i]['id'], 'name':data_array[i]['name']});
                 }

               }

               this.setState({dataSource:this.state.dataSource.cloneWithRows(rows)});
            }}
        />
      </View>
      </Display>
      <Spinner visible={this.state.visible}/>
      <Display  enable = {!this.state.enable}>
      <TouchableHighlight onPress={this.changeStatus.bind(this)}>
      <View style = {{flexDirection:'row', justifyContent: 'flex-start', backgroundColor: '#FFFFFF',padding : 10, marginTop : 20, marginLeft:20, marginRight:20, borderWidth:1, borderColor:'#C7E3E0', borderRadius:5,}} >
        <View style={{flex : 1}}>
          <Image style={{width : 20, height : 20}} source={require('../img/icon-search.png')} />
        </View>
        <View style={{flex:2, paddingLeft:20}}>
          <Text style={{color:'#333333', fontSize:18, fontWeight : 'bold'}}>SEARCH</Text>
        </View>
      </View>
      </TouchableHighlight>
      </Display>
      <Display enable = {this.state.enable}>
      <View style = {{alignSelf : 'stretch', height : 50}}/>
      </Display>
      </GestureRecognizer>
        <View style={{marginTop : 40}}>
        <ListView
          style={{marginTop : 20}}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableHighlight style={{backgroundColor:'#C7E3E0'}}onPress={() => {
            this._pressRow(rowData.id);
          }}><Text style={styles.list_item}>{rowData.name}</Text></TouchableHighlight> }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
        <View style={{flexDirection:'row', backgroundColor:'#C7E3E0', alignItemSelf : 'center', justifyContent:'center', padding :10}}>
          <Image style={{width : 140, height : 30}} source={require('../img/logo-footer.png')} />
        </View>
        </View>
      </View>
    );
  }
}


export default ContactsScreen;
