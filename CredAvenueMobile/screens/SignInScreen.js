import * as React from 'react';
import {
  Button,
  View,
  AsyncStorage,
  StyleSheet,
  TextInput,Text,Image,
} from 'react-native';
import humps from 'humps';
import _get from 'lodash/get';
export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userName: '', password: ''};
  }
    static navigationOptions = {
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
        backgroundColor: '#fff'
      },
      headerTitleStyle: {
        color: '#fff',
        fontWeight:500,
      },
    };
  
    render() {
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 20,fontWeight: 600,color:'#fff',marginBottom:15}}>Welcome to CredAvenue</Text>
          <Text style={{fontSize: 15,fontWeight: 500,color:'#fff',marginBottom:15}}>Please Sign in to continue</Text>
          <TextInput
          style={{height: 40,backgroundColor:'#fff',padding:10,marginBottom:15,width:250}}
          placeholder="Username"
          onChangeText={(userName) => this.setState({userName})}
          value={this.state.text}
        />
        <TextInput
          style={{height: 40,backgroundColor:'#fff',padding:10,marginBottom:15,width:250}}
          placeholder="Password"
          onChangeText={(password) => this.setState({password})}
          value={this.state.text}
        />
        
          <Button title="Sign in!" onPress={this._signInAsync} color="rgb(59, 63, 220)"/>
        </View>
      );
    }
  
    _signInAsync = () => {
      fetch(`http://transaction-api.vivriti.in:3000/users/authenticate?email=${this.state.userName}`).then((response) => {
        return response.json();
      })
      .then((myJson) => {
        AsyncStorage.setItem('userToken', JSON.stringify(myJson), () => {this.props.navigation.navigate('Main')});
      })
      .catch((error) => {
        console.error(error);
      });
      
    };
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#5478de',
      minHeight: 'calc(100vh - 64px)'
    },
    welcomeImage: {
      width: 100,
      height: 80,
      resizeMode: 'contain',
      marginTop: 3,
      marginLeft: -10,
    },
  });
  