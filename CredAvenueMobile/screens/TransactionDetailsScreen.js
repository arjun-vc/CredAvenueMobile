import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View
} from "react-native";

const TransactionDetailsScreen = (item) => {
  return (
    <View style={{ height: "auto" }}>
      <Text style={{ textAlign: "center", marginBottom: 10 }}>
        {_get(item, "clientName")}
      </Text>
      <Text style={{ textAlign: "center", color: "skyblue" }}>
        {_get(item, "dealName")}
      </Text>
      <Text style={{ textAlign: "center", color: "red" }}>
        {_get(item, "transactionType")}
      </Text>
    </View>
  );
}


TransactionDetailsScreen.navigationOptions = {
  title: "TransactionDetails"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});

export default TransactionDetailsScreen;