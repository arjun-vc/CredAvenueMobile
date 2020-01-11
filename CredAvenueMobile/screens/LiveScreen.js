import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, Text, FlatList, View } from 'react-native';
import _get from 'lodash/get';

const TransScreen = ({transList = []}) => {
    const renderItem = ({ index, item }) => {
        return (
          <View style={{ height: 'auto' }}>
            <Text style={{ textAlign: 'center', marginBottom: 10 }}>{_get(item, 'clientName')}</Text>
            <Text style={{ textAlign: 'center', color: 'skyblue' }}>{_get(item, 'dealName')}</Text>
            <Text style={{ textAlign: 'center', color: 'red' }}>{_get(item, 'transactionType')}</Text>
          </View>
        );
      };
  return (
    <ScrollView style={styles.container}>
     <FlatList
          data={transList}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
    </ScrollView>
  );
}

TransScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

export default TransScreen;
