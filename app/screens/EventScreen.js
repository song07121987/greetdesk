import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  ScrollView,
  Config,
  Image,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../styles/layout.js';
import store from 'react-native-simple-store';
import Display from 'react-native-display';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


class EventScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      visible:true,
      dataSource: ds.cloneWithRows([]),
      data_array:[],
      enable : false,
    };
  }

  changeStatus()  {
    let toggel = !this.state.enable;
    this.setState({enable:toggel});
  }

  onSwipeDown(gestureState) {
    this.setState({enable:false});
  }

  _pressRow(rowID) {
    Actions.guests({account_id:this.props.account_id,
    event_id: this.props.event_id,
    list_id: rowID});

    /*
    this.props.navigator.push({
      id: 'guests',
      account_id:this.props.account_id,
      event_id: this.props.event_id,
      list_id: rowID
    })*/
  }

  componentDidMount(  ) {

    store.get('profile_data').then((data)=> {
      if (data === null || data === undefined) {
          // redirect to home page
      } else {
        fetch("https://greetdesk.com/api/v1/events/" + this.props.event_id + ".json",
        {method: "GET",
      headers: {
        'Authorization': 'Bearer ' + data,
      }}).then((response) => response.json())
          .then((responseData) => {
            this.setState({visible:false, enable : false, data_array : responseData['lists'], dataSource: this.state.dataSource.cloneWithRows(responseData['lists'])})

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
      
      <Spinner visible={this.state.visible}/>
      <GestureRecognizer
        onSwipeDown = {(state) => this.onSwipeDown(state)}
        style = {{flex : 1}}>
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
      <View style = {{flexDirection:'row', justifyContent: 'flex-start', backgroundColor: '#FFFFFF',padding : 10, marginTop:20, marginLeft : 20, marginRight:20, borderWidth:1, borderColor:'#C7E3E0', borderRadius:5,}} >
        <View style={{flex : 1}}>
          <Image style={{width : 20, height : 20}} source={require('../img/icon-search.png')} />
        </View>
        <View style={{flex:2, paddingLeft:20}}>
          <Text style={{color:'#333333', fontSize:18, fontWeight : 'bold'}}>SEARCH</Text>
        </View>
      </View>
      </TouchableHighlight>
      </Display>
      <ListView
        style = {{marginTop : 60}}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <TouchableHighlight style={{backgroundColor : '#C7E3E0'}}  onPress={() => {
          this._pressRow(rowData.id);
        }}><Text style={styles.list_item}>{rowData.name}</Text></TouchableHighlight>}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
      
            </GestureRecognizer>

      <View style={{position: 'absolute', bottom : 40, left : 100, right : 100, alignItems:'center'}} >
          <Image style={{width : 140, height : 30, justifyContent : 'center'}} source={require('../img/logo-footer.png')} />
      </View>

      </View>
    );
  }
}


export default EventScreen;
