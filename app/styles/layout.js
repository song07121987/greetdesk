import { Dimensions, Platform, StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listview_container : {
    backgroundColor : '#C7E3E0',
    marginLeft : 10,
    marginRight : 10,
    borderWidth:1,
    marginTop : 15,
    borderColor:'#C7E3E0',
    borderRadius:5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
  search_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor : (Platform.OS === 'ios') ? '#FFFFFF' : '#red',
    marginTop : (Platform.OS === 'ios') ? 0 : 20,
  },
  input: {
    padding : 8,
    height: 38,
    flex: 1,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  red: {
    color: 'red'
  },
  container: {
    flex: 1,
    marginTop:(Platform.OS === 'ios') ? 64 : 54,
    backgroundColor: '#6eb8ad',
  },
  add_button : {
    color : '#FFFFFF', 
    fontSize: (Platform.OS === 'ios') ? 27 : 20,
  },
  qr_button : {
    width : (Platform.OS === 'ios') ? 25 : 20,
    height : (Platform.OS === 'ios') ? 25 : 20,
    tintColor : '#FFFFFF'
  },
  search_view_container : {
    backgroundColor: '#6eb8ad',
  },
  container_without_header: {
    flex: 1,
    paddingTop:(Platform.OS === 'ios') ? 64 : 54,
    backgroundColor: '#6eb8ad',
  },
  container_empty: {
    flex: 1,
  },
  list_item: {
    marginLeft:10,
    paddingLeft:5,
    paddingTop:10,
    fontSize: 20,
    paddingBottom:10
  },
  contacts_button: {
    borderWidth:1,
    borderColor:'#C7E3E0',
    borderRadius:5,
    marginLeft : 10,
    marginRight : 10,
    paddingTop : 10,
    marginTop : 10,
    paddingBottom : 10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor : '#C7E3E0'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#6eb8ad',
  },
  label_style : {
    fontSize : 17,
    color : '#4A4A4A',
    marginTop : 10,
    marginLeft : 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#333333',
    alignSelf: 'center',
    fontWeight : 'bold',
  },
  text_style : {
    fontSize : 20,
    color : '#333333',
    marginTop : 10,
    marginLeft : 20,
  },
  cellContainer : {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#C7E3E0',
    flexDirection : 'row',
  },
  cellTitle: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginTop: 20,
    color : '#333333',
    fontWeight : 'bold',
    marginLeft : 20,
  },
  cellLocation : {
    fontSize : 17,
    color : '#4A4A4A',
    marginBottom : 20,
    marginTop : 15,
    marginLeft : 20,
  },
  normal_cell_touchopacity : {
    backgroundColor:'#C7E3E0',
  }
});
