import * as React from 'react';
import {
  Button,
  View,
  AsyncStorage,
  StyleSheet,
  TextInput
} from 'react-native';
export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userName: '', password: ''};
  }
    static navigationOptions = {
      title: 'Please sign in',
    };
  
    render() {
      return (
        <View style={styles.container}>
          <TextInput
          style={{height: 40}}
          placeholder="Username"
          onChangeText={(userName) => this.setState({userName})}
          value={this.state.text}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Password"
          onChangeText={(password) => this.setState({password})}
          value={this.state.text}
        />
        
          <Button title="Sign in!" onPress={this._signInAsync} />
        </View>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('Main');
    };
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  