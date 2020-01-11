import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View, Dimensions } from 'react-native';
import _get from 'lodash/get';
import humps from 'humps'
import COLORS from '../constants/ChartColors'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
const TransScreen = (props) => {
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
    
  return (
    <ScrollView style={styles.container}>
     {/* <View style={{ height: 'auto' }}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>{_get(item, 'clientName')}</Text>
        <Text style={{ textAlign: 'center', color: 'skyblue' }}>{_get(item, 'dealName')}</Text>
        <Text style={{ textAlign: 'center', color: 'red' }}>{_get(item, 'transactionType')}</Text>
    </View> */}
    <View>
        <Text>Pool Summary</Text>
        <Text>Top State Concentration</Text>
        {_get(details, 'poolSummary.consolidatedPoolInfo.state') && <PieChart
            data={_get(details, 'poolSummary.consolidatedPoolInfo.state', []).map((data, index) => ({...data, color: COLORS[COLORS.length - 1-index],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15}))}
    width={Dimensions.get('window').width}
            height="220"
            accessor="principal"
            backgroundColor="transparent"
            paddingLeft="0"
            chartConfig={chartConfig}
            />}
        <Text>Top District Concentration</Text>
        {_get(details, 'poolSummary.consolidatedPoolInfo.district') && <BarChart  data={{
  labels: _get(details, 'poolSummary.consolidatedPoolInfo.district', []).map((data) => data.name),
  datasets: [
    {
      data: _get(details, 'poolSummary.consolidatedPoolInfo.district', []).map((data) => data.percent)
    }
  ]
}} width={Dimensions.get('window').width} height={220} style={styles.graphStyle}
yAxisLabel={'$'} chartConfig={chartConfig} verticalLabelRotation={30} />}
    </View>
    </ScrollView>
  );
}

TransScreen.navigationOptions = (props) => {
return ({
    headerRight: () => <Text>{_get(JSON.parse(props.navigation.getParam('item', '')), 'transactionType', '')}</Text>,
  title: _get(JSON.parse(props.navigation.getParam('item', '')), 'dealName', 'Details'),
})};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  graphStyle: {
      backgroundColor: '#fff',
  }
});

export default TransScreen;
