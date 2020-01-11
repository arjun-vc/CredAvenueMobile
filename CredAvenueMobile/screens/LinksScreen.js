import React, {useState, useEffect} from 'react';
import { StyleSheet, Dimensions, View, AsyncStorage } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import _get from 'lodash/get';
import humps from 'humps'
import LiveScreen from './LiveScreen'

 
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);
export default function LinksScreen() {
  const [index, setindex] = useState(0);

  const [authData, setAuthData] = useState({});
  const [transList, setTransList] = useState([]);
  const [routes, setroutes] = useState([
    { key: 'new', title: 'New Offers' },
    { key: 'missed', title: 'Missed Deals' },
    {key: 'live', title: 'Live Deals'},
    {key: 'settled', title: 'My Portfolio'},
  ]);

  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(async () => {
    const data = await AsyncStorage.getItem('userToken');
    setAuthData(JSON.parse(data));
  }, []);

  useEffect(() => {
    const groupHeader = {};
    groupHeader['Current-Entity-Id'] = authData.entity_id;
    groupHeader['Current-User-Id'] = authData.id;
    groupHeader['Current-Group'] = 'investor';
  
    fetch(`http://transaction-api.vivriti.in:3000/transactions?page=1&items_per_page=50&actor=investor&tab=${routes[index].key}&`, {headers: groupHeader})
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
        setTransList(_get(humps.camelizeKeys(myJson), 'transactions', []))
    })
    .catch((error) => {
      console.error(error);
    });
    
  }, [authData, index]);
const FirstRoute = () => (
  <LiveScreen transList={transList} />
);
  return (
    <TabView
        navigationState={{index, routes}}
        renderScene={SceneMap({
          new: FirstRoute,
          missed: FirstRoute,
          live: FirstRoute,
          settled: FirstRoute,
        })}
        onIndexChange={index => setindex(index )}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
  );
}

LinksScreen.navigationOptions = {
  title: 'Transactions',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
