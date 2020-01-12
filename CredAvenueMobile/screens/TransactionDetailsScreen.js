import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  Button,
  View,Image
} from "react-native";
import _get from "lodash/get";

class TransactionDetailsScreen extends React.Component {
  render() {
   const { navigation } = this.props; 
    console.log(navigation);
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: '#fff',borderRadius: '10px', marginBottom:'5px',marginLeft:'0px',marginRight:'5px',boxShadow:'inset 0px 0px 11px -3px #999',padding:'10px'}}>
          <View style={{flex: 1, flexDirection: 'row',justifyContent:'space-between',maxHeight:'45px'}}>
            <Text style={{marginBottom: 5,color:'#ffa602',fontSize:'14px',fontWeight:'600',textTransform:'uppercase' }}>
              {navigation.getParam("clientName", "NO-ID")}
            </Text>
            <Text style={{ textAlign: "right", color: "red",color: "#a8adbc",
                borderRadius: "3px",
                lineHeight: "12px",
                marginLeft: "auto",
                backgroundColor: "#f1f5f9",
                paddingTop: "3px",
                fontSize: "12px",
                paddingRight: "5px",
                paddingBottom: "3px",
                paddingLeft: "5px",textTransform:'capitalize',height:'20px' }}>
              {navigation.getParam("transactionState", "NO-ID")}
            </Text>
          </View>
          <Text style={{ color:'rgba(123, 130, 149,0.7)',fontWeight:'500'}}>
            {navigation.getParam("dealName", "NO-ID")}
          </Text>
          <Text  style={{textTransform:'capitalize'}}>
            {navigation.getParam("assetClass", "NO-ID")}
          </Text>
          
          <Text style={{textTransform:'capitalize'}}>
            {navigation.getParam("transactionType", "NO-ID")}
          </Text>
          <Text>
            {(
              navigation.getParam("humanizedIssuanceSize", "NO-ID")
            )}
          </Text>
          <View style={{flex: 1, flexDirection: 'row',minHeight:'70px',alignItems:'flex-end',justifyContent:'space-between'}}>
              <TouchableOpacity style={styles.bidButton} 
                onPress={this._handleBid}>
                  <Text style={{color:'#fff',fontWeight:'500'}}>Bid</Text>
                </TouchableOpacity>
              <TouchableOpacity style={styles.expressInterestButton} 
                onPress={this._expressInterest}>
                <Text style={{color:'#fff',fontWeight:'500'}}>Express Interest</Text>
              </TouchableOpacity>
          </View>
        </View>
        
      </View>
    );
  }

  _handleBid = () => {

  }

  _expressInterest = () => {

  }
}


TransactionDetailsScreen.navigationOptions = {
  headerBackground: (
    <Image
      style={{
        width: '45%',
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: 50,
        marginTop: -10,
      }}
      source={require('../assets/images/cred-logo-primary.png')}
    />
  ),
  headerStyle: {
    backgroundColor: '#fff'
  },
  headerTitleStyle: {
    color: '#fff',
    fontWeight:500,
  },headerTintColor: '#00c7cc',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#5478de",
    padding:'10px'
  },
  bidButton: {
    backgroundColor: '#ffa602',
    color:'#fff',
    paddingTop:5, 
    paddingRight:12,
    paddingLeft:12,
    paddingBottom:5,
    minWidth:'48%',
    display:'flex',
    alignItems:'center'
  },
  expressInterestButton: {
    backgroundImage: 'linear-gradient(to right, #63e277 , #50d79c);',
    color:'#fff',
    paddingTop:5, 
    paddingRight:12,
    paddingLeft:12,
    paddingBottom:5,
    minWidth:'48%',
    display:'flex',
    alignItems:'center'
  }
});

export default TransactionDetailsScreen;