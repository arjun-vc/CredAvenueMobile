import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Button,
  AsyncStorage
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
      <ThemeContext.Provider value={getTheme(uiTheme)}>
        <View style={styles.container}>
        <ListItem
        divider
        centerElement={<Avatar icon="person" iconColor="blue" />}
        onPress={() => {}}
      />
      </View>
      </ThemeContext.Provider>
    );

  
}
HomeScreen.navigationOptions = ({ navigation }) => {return {
  title: 'Dashboard',
  headerRight: () => (
    <Button
      onPress={async () => {await AsyncStorage.clear();
        navigation.navigate('Auth');}}
      title="Logout"
      color="red"
    />
  ),
}};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
