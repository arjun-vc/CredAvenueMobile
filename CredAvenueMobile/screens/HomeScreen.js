import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
  AsyncStorage,
  Text,TouchableOpacity,Image,
} from 'react-native';
import humps from 'humps';
import _get from 'lodash/get';
import _has from 'lodash/has'


export const humanizeNumber = (value) => {
  let val = Math.abs(value);
  if (val >= 10000000) {
      val = `${(val / 10000000).toFixed(2)} ${(val / 10000000).toFixed(2) > 1 ? ' Crs' : ' Cr'}`;
  } else if (val >= 100000) {
      val = `${(val / 100000).toFixed(2)} ${(val / 100000).toFixed(2) > 1 ? 'Lakhs' : 'Lakh'}`;
  }
  return val;
};

const HomeScreen = (props)=> {
  const [authData, setAuthData] = useState({});
  useEffect(async () => {
    const data = await AsyncStorage.getItem('userToken');
    setAuthData(data ? JSON.parse(data) : {});
  }, []);

  useEffect(() => {
    const groupHeader = {};
    groupHeader['Current-Entity-Id'] = authData.entity_id;
    groupHeader['Current-User-Id'] = authData.id;
    groupHeader['Current-Group'] = 'investor';
  
    fetch(`http://transaction-api.vivriti.in:3000/transactions/investor_dashboard_stats`, {headers: groupHeader})
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      setData(_get(humps.camelizeKeys(myJson), 'investorDashboardStats.summary', {}))
    })
    .catch((error) => {
      console.error(error);
    });
    
  }, [authData])

  const [data, setData] = useState({});

    return (
        <View style={styles.container}>
          <div>
            <View style={styles.invHead}>
            <Text style={{color:'#fff',fontSize:'17px',fontWeight:'600',marginBottom:'15px'}}>My summary</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={[{flex: 1,alignItems:'center',justifyContent:'center',height: 100, backgroundColor: '#fff',borderRadius: '10px', marginBottom:'5px',marginLeft:'0px',marginRight:'5px',boxShadow:'inset 0px 0px 11px -3px #999'}, styles.li]} >
                      <Text style={{color:'#ffa602',fontSize:'18px',fontWeight:'600',textTransform:'uppercase'}}>{humanizeNumber(data.amountInvested)}</Text>
                      <Text style={{color:'rgba(123, 130, 149,0.7)',fontWeight:'500'}}>My Investment</Text>
              </View>
              <View style={[{flex: 1,alignItems:'center',justifyContent:'center',height: 100, backgroundColor: '#fff',borderRadius: '10px', marginBottom:'5px',marginRight:'0px',marginLeft:'5px',boxShadow:'inset 0px 0px 11px -3px #999'}, styles.li]} >
                      <Text style={{color:'#ffa602',fontSize:'18px',fontWeight:'600',textTransform:'uppercase'}}>{data.myDeals}</Text>
                      <Text style={{color:'rgba(123, 130, 149,0.7)',fontWeight:'500'}}>My Deals</Text>
              </View>
            </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={[{flex: 1,alignItems:'center',justifyContent:'center',height: 100,  backgroundColor: '#fff',borderRadius: '10px', marginTop:'5px',marginLeft:'0px',marginRight:'5px',boxShadow:'inset 0px 0px 11px -3px #999' }, styles.li]} >
                            <Text  style={{color:'#ffa602',fontSize:'18px',fontWeight:'600',textTransform:'uppercase'}}>{humanizeNumber(data.amountOs)}</Text>
                            <Text  style={{color:'rgba(123, 130, 149,0.7)',fontWeight:'500'}}>My Outstanding</Text></View>
        <View style={[{flex: 1,alignItems:'center',justifyContent:'center',height: 100,  backgroundColor: '#fff',borderRadius: '10px', marginTop:'5px',marginRight:'0px',marginLeft:'5px',boxShadow:'inset 0px 0px 11px -3px #999'}, styles.li]} >
                            <Text  style={{color:'#ffa602',fontSize:'18px',fontWeight:'600',textTransform:'uppercase'}}>
                                {parseFloat(data.blendedYield).toFixed(2)} <span>%</span>
                            </Text>
                            <Text  style={{color:'rgba(123, 130, 149,0.7)',fontWeight:'500'}}>Blended Yield</Text></View>
      </View>

                        </div>
      </View>
    );

  
}
HomeScreen.navigationOptions = ({ navigation }) => {return {
  headerBackground: (
    <Image
      style={{
        width: '45%',
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: 10,
        marginTop: -10,
      }}
      source={require('../assets/images/cred-logo-primary.png')}
    />
  ),
  headerStyle: {
    // backgroundColor: '#7ae88c'
    backgroundColor:'#fff' 
  },
  headerTitleStyle: {
    color: '#fff',
    fontWeight:500,
  },
  headerRight: () => (
    <TouchableOpacity style={styles.logoutButton} onPress={async () => {await AsyncStorage.clear();
      navigation.navigate('Auth');}}>
      <Text style={{color:'#fff',fontWeight:'500'}}>Logout</Text>
    </TouchableOpacity>
  ),
}};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#5478de',
    minHeight:'calc(100vh - 64px)',
    padding:'15px',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#ffa602',
    marginRight: 10,
    paddingTop:5, 
    paddingRight:12,
    paddingLeft:12,
    paddingBottom:5,
    overflow: 'hidden',
    color:'#fff',
    lineHeight:16,
    display:'flex',
    alignItems:'center'
  }
});
