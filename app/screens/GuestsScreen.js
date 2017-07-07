import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  Config,
  TouchableHighlight,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../styles/layout.js';
import store from 'react-native-simple-store';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import Display from 'react-native-display';

import { Actions } from 'react-native-router-flux';
import { SwipeListView } from 'react-native-swipe-list-view';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
var cutSubstr = require('cut-substring');

class GuestsScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      attendees:'',
      checked:'',
      percents : '',
      percents_n : 0,
      unChecked:'',
      visible: true,
      dataSource: ds.cloneWithRows([]),
      enable : false,
      focusable : false,
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
    this.changeStatus();
    Actions.guest({account_id:this.props.account_id,
    event_id: this.props.event_id,
    contact_id: rowID,
    list_id: this.props.list_id});
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.account_list != this.props.account_list) {
      this.setState({input_text:''})
      store.get('profile_data').then((data)=> {
        if (data === null || data === undefined) {
            // redirect to home page
        } else {
          fetch("https://greetdesk.com/api/v1/lists/" + this.props.list_id + "/contacts.json",
          {method: "GET",
        headers: {
          'Authorization': 'Bearer ' + data,
        }}).then((response) => response.json())
            .then((responseData) => {
              function isChecked(person) {
                return person.status == 'in';
              }
            var percet = 0;
            var unChecked = 0;
            var percet_st = "";
            if (responseData.length == 0) {
              percet = 0;
              unChecked = 0;
              percet_st = "0";
            } else {
              percet = responseData.filter(isChecked).length / responseData.length * 100;
              unChecked = responseData.length - responseData.filter(isChecked).length;
              percet_st = percet + "";
              if (percet_st.length > 4) {
                percet_st = cutSubstr(percet_st, 3, percet_st.length-1);
                console.log("percents : " + percet_st + "");
              }
            }
            this.setState({visible:false, enable:false, checked:responseData.filter(isChecked).length, percents:percet_st, percents_n : percet, unChecked : unChecked, attendees: responseData.length, data_array: responseData, dataSource: this.state.dataSource.cloneWithRows(responseData), focusable : false})

        }).catch((error) => {
              //this.setState({visible:false})
              console.warn(error);
        });
        }
      })
    }
  }

  swipeRight(secId, rowId, rowMap) {
     var guest = this.state.data_array[rowId];
     var data_array = []
     this.state.data_array.forEach(function (item) {
       data_array.push({contact_id:item['contact_id'], name: item['name'], status:item['status']});
     })
   
     if (rowMap[`${secId}${rowId}`].state.translateX._value > 0) {
       var action = 'out';
     } else {
       var action = 'in';
     }

     if (action == 'out' && guest['status'] == 'out') {
       rowMap[`${secId}${rowId}`].closeRow();
       return;
     }

     if (action == 'in' && guest['status'] == 'in') {
       rowMap[`${secId}${rowId}`].closeRow();
       return;
     }

     this.setState({visible:true});

     store.get('profile_data').then((data)=> {
       if (data === null || data === undefined) {
           // redirect to home page
       } else {
         fetch("https://greetdesk.com/api/v1/lists/" + this.props.list_id + "/contacts/" + guest['contact_id'] + "/" + action + ".json",
         {method: "POST",
       headers: {
         'Authorization': 'Bearer ' + data,
       }}).then((response) => response.json())
           .then((responseData) => {
             function isChecked(person) {
               return person.status == 'in';
             }
             rowMap[`${secId}${rowId}`].closeRow();
             console.warn(data_array[rowId]['status']);
             data_array[rowId]['status'] = action;
             console.warn(data_array[rowId]['status']);
             this.setState({visible:false, checked:data_array.filter(isChecked).length,  data_array: data_array, dataSource: this.state.dataSource.cloneWithRows(data_array)})

       }).catch((error) => {
             //this.setState({visible:false})
             console.warn(error);
       });
       }
     })

   }


  scanView()  {
    Actions.barcode();
  }

  renderRightButton = () => {
    return(
      <TouchableOpacity onPress={this.scanView}>
        <Image style={styles.qr_button} source={require('../img/icon-qr.png')} />
      </TouchableOpacity>
      )
  }

  componentDidMount(  ) {
    Actions.refresh({renderLeftButton:this.renderLeftButton, renderRightButton:this.renderRightButton})
    this.props.set_account_list_id(this.props.list_id);
    store.get('profile_data').then((data)=> {
      if (data === null || data === undefined) {
          // redirect to home page
      } else {
        fetch("https://greetdesk.com/api/v1/lists/" + this.props.list_id + "/contacts.json",
        {method: "GET",
      headers: {
        'Authorization': 'Bearer ' + data,
      }}).then((response) => response.json())
          .then((responseData) => {
            function isChecked(person) {
              return person.status == 'in';
            }

            console.log("response data");
            console.log(responseData);
            var percet = 0;
            var unChecked = 0;
            var percet_st = "";
            if (responseData.length == 0) {
              percet = 0;
              unChecked = 0;
              percet_st = "0";
            } else {
              percet = responseData.filter(isChecked).length / responseData.length * 100;
              unChecked = responseData.length - responseData.filter(isChecked).length;
              percet_st = percet + "";
              if (percet_st.length > 4) {
                percet_st = cutSubstr(percet_st, 3, percet_st.length-1);
                console.log("percents : " + percet_st + "");
              }
            }
            
            this.setState({visible:false, enable:false, checked:responseData.filter(isChecked).length, percents:percet_st, percents_n : percet, unChecked : unChecked, attendees: responseData.length, data_array: responseData, dataSource: this.state.dataSource.cloneWithRows(responseData), focusable : false})

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

        <GestureRecognizer
        onSwipeDown = {(state) => this.onSwipeDown(state)}
        style = {{flex : 1,}}>
          <Display enable = {this.state.enable}>
          <View style={styles.search_container}>
          <TextInput
              style={styles.input}
              placeholder="Search..."
              value={this.state.input_text}
              onChangeText={(text) =>{
                  this.setState({input_text:text})
                  var data_array = this.state.data_array;
                  var rows = [];

                  for (var i=0; i < data_array.length; i++) {
                     var stateName = data_array[i]['name'].toLowerCase();

                     if(stateName.search(text.toLowerCase()) !== -1){
                       rows.push({'contact_id': data_array[i]['contact_id'], 'name':data_array[i]['name'], 'status':data_array[i]['status']});
                     }

                   }

                   this.setState({data_array:data_array, dataSource:this.state.dataSource.cloneWithRows(rows)});
                }}
            />
          </View>
          </Display>
          <Spinner visible={this.state.visible}/>
          <Display  enable = {!this.state.enable}>
          <TouchableHighlight onPress={this.changeStatus.bind(this)}>
          <View style = {{flexDirection:'row', justifyContent: 'flex-start', backgroundColor: '#FFFFFF',padding : 10, margin:20, borderWidth:1, borderColor:'#C7E3E0', borderRadius:5,}} >
            <View style={{flex : 1}}>
              <Image style={{width : 20, height : 20}} source={require('../img/icon-search.png')} />
            </View>
            <View style={{flex:2, paddingLeft:20}}>
              <Text style={{color:'#333333', fontSize:18, fontWeight : 'bold'}}>SEARCH</Text>
            </View>
          </View>
          </TouchableHighlight>
          </Display>

          <View style={{flexDirection : 'row', marginTop : 40,}}>
            <View style = {{flex : 1, alignItems : 'flex-end', marginRight : 10}}>
              <AnimatedCircularProgress
                ref='circularProgress' size = {120} width = {5} fill = {this.state.percents_n} tintColor = '#22695f' backgroundColor = '#FFFFFF'>                
              </AnimatedCircularProgress>
              <Text style={{color : '#ffffff', fontSize : 15, fontWeight : 'bold', marginRight : 43, marginTop : 10}} numberOfLines = {1}>{this.state.percents = NaN ? 0 : this.state.percents}%</Text>
            </View>
            <View style={{flex : 1, flexDirection : 'column', marginLeft : 10}}>
              <View style={{flex : 1, flexDirection : 'row', alignItems:'center'}}>
                <Image style={{width : 29, height : 50}} source={require('../img/icon-man-phone.png')} />
                <View style = {{marginLeft : 20}}>
                  <Text style={{color : '#ffffff', fontSize : 30, fontWeight:'bold'}}>{this.state.checked}</Text>
                  <Text style={{color : '#ffffff', fontSize : 15, }}>Checked In</Text>
                </View>
              </View>
              <View style={{flex : 1, flexDirection : 'row', alignItems:'center'}}>
                <Image style={{width : 29, height : 50}} source={require('../img/icon-man-phone.png')} />
                <View style = {{marginLeft : 20}}>
                  <Text style={{color : '#ffffff', fontSize : 30, fontWeight:'bold'}}>{this.state.unChecked}</Text>
                  <Text style={{color : '#ffffff', fontSize : 15, }}>Awaiting</Text>
                </View>
              </View>
            </View>
          </View>
          </GestureRecognizer>

          <SwipeListView
            style = {{marginTop:40}}
            dataSource = {this.state.dataSource}
            onRowOpen={ (secId, rowId, rowMap) => (
                        this._swipeRight(secId, rowId, rowMap)
                        )}

            renderHiddenRow={ (data, secId, rowId, rowMap) => (
                            <View style={styles.rowBack}>
                                <Text>Out</Text>
                                <Text style={styles.backTextWhite}>In</Text>
                            </View>
                        )}
            leftOpenValue={75}
            rightOpenValue={-75}
            renderRow={(rowData) => <TouchableHighlight style={{backgroundColor : '#C7E3E0', padding : 10}} onPress={() => {
              this._pressRow(rowData.contact_id);
            }}><View style = {{paddingRight : 12, flexDirection : 'row'}}>
              <View style = {{flex : 6, paddingBottom:10,}}>
              <Text style={{alignSelf:'stretch', paddingLeft : 5, paddingTop : 10, fontSize : 20, paddingBottom:10, color : '#333333'}}>{rowData.name}</Text>
              </View>
              {rowData.status == 'in' ? <View style={{flex : 1, flexDirection:'row'}}>
              <Image style={{width : 20, height : 21, alignSelf:'center', marginTop : 12, position: 'absolute', right:0}} source={require('../img/icon-tick-big.png')}/>
              </View> : <View></View>}
              </View></TouchableHighlight>}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />

      </View>
    );
  }
}


export default GuestsScreen;
