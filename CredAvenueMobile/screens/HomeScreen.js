import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Button,
  AsyncStorage,
  Text,TouchableOpacity,Image,
} from 'react-native';
import { COLOR, ThemeContext, getTheme, ListItem, Avatar } from 'react-native-material-ui';

const uiTheme = {
  palette: {
    primaryColor: COLOR.green500,
  },
  toolbar: {
    container: {
      height: 50,
    },
  },
};

const HomeScreen = (props)=> {
  useEffect(() => {
    fetch(`http://transaction-api.vivriti.in:3000/transactions/investor_dashboard_stats`)
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      console.log(myJson);
    });
    
  }, []);
  

    return (
      // <ThemeContext.Provider value={getTheme(uiTheme)}>
      //   <View style={styles.container}>
      //   <ListItem
      //   divider
      //   centerElement={<Avatar icon="person" iconColor="blue" />}
      //   onPress={() => {}}
      // />
      // </View>
      // </ThemeContext.Provider>\
      <View style={styles.container}>
        <Text style={{fontSize:'16px',marginLeft:'10px',marginTop:'10px',fontWeight:'600',color:'#fff',textDecorationLine:'underline'}}>DashBoard</Text>
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
      source={require('../assets/images/cred-logo-darkbg.png')}
    />
  ),
  headerStyle: {
    // backgroundColor: '#7ae88c'
    backgroundImage: 'linear-gradient(to right, #80ec88 , #5fd4a3)'
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
    minHeight:'calc(100vh - 64px)'
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
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
