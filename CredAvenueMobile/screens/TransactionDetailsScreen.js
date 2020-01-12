import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  Button,
  View,Image,
Dimensions
} from "react-native";
import _get from "lodash/get";
import humps from 'humps'
import COLORS from '../constants/ChartColors'
import {
    BarChart,
    PieChart  } from "react-native-chart-kit";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
const TransactionDetailsScreen =(props) =>  {
  const [item, setitem] = useState({});
  const [details, setdetails] = useState({})
  useEffect(() => {
      const data = JSON.parse(props.navigation.getParam('item', ''));
      setitem(data);
      fetch(`http://transaction-api.vivriti.in:3000/${_get(data, 'transactionType')}s/${_get(data, 'id')}`, {headers: JSON.parse(localStorage.getItem('header', ''))})
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
      setdetails(humps.camelizeKeys(myJson));
  })
  .catch((error) => {
    console.error(error);
  });
  }, []);



  const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5
    };

    const _handleBid = () => {

    }
  
    const _expressInterest = () => {
      const headers = JSON.parse(localStorage.getItem('header', ''));
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';
      fetch(`http://transaction-api.vivriti.in:3000/${_get(item, 'transactionType')}s/${_get(item, 'id')}/investor_interests`, {headers: headers, method: 'POST', 
      body: JSON.stringify({ 
        investor_interest: {
          comments:"Test",
          tentative_settlement_date:"2020-01-16"
        }})})
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
          setdetails(humps.camelizeKeys(myJson));
      })
      .catch((error) => {
        console.error(error);
      });
    }
    
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: '#fff',borderRadius: '10px', marginBottom:'5px',marginLeft:'0px',marginRight:'5px',boxShadow:'inset 0px 0px 11px -3px #999',padding:'10px'}}>
          <View style={{flex: 1, flexDirection: 'row',justifyContent:'space-between',maxHeight:'45px'}}>
            <Text style={{marginBottom: 5,color:'#ffa602',fontSize:'14px',fontWeight:'600',textTransform:'uppercase' }}>
              {_get(item, "clientName", "-")}
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
              {_get(item, "transactionState", "-")}
            </Text>
          </View>
          <Text style={{ color:'rgba(123, 130, 149,0.7)',fontWeight:'500'}}>
            {_get(item, "dealName", "-")}
          </Text>
          <Text  style={{textTransform:'capitalize'}}>
            {_get(item, "assetClass", "-")}
          </Text>
          
          <Text style={{textTransform:'capitalize'}}>
            {_get(item, "transactionType", "-")}
          </Text>
          <Text>
            {(
              _get(item, "humanizedIssuanceSize", "-")
            )}
          </Text>
          <View style={{flex: 1, flexDirection: 'row',minHeight:'70px',alignItems:'flex-end',justifyContent:'space-between'}}>
              <TouchableOpacity style={styles.bidButton} 
                onPress={_handleBid}>
                  <Text style={{color:'#fff',fontWeight:'500'}}>Bid</Text>
                </TouchableOpacity>
              <TouchableOpacity style={styles.expressInterestButton} 
                onPress={_expressInterest}>
                <Text style={{color:'#fff',fontWeight:'500'}}>Express Interest</Text>
              </TouchableOpacity>
          </View>
        </View>
        <View>
        {_get(details, 'poolSummary.consolidatedPoolInfo.state') && 
        (<><Text>Top State Concentration</Text>
        <PieChart
            data={_get(details, 'poolSummary.consolidatedPoolInfo.state', []).map((data, index) => ({...data, color: COLORS[COLORS.length - 1-index],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15}))}
    width={Dimensions.get('window').width}
            height="220"
            accessor="principal"
            backgroundColor="transparent"
            paddingLeft="0"
            chartConfig={chartConfig}
        /></>)}
        </View>
      </View>
    );

  
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
    fontWeight:'500',
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
    // backgroundImage: 'linear-gradient(to right, #63e277 , #50d79c);',
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