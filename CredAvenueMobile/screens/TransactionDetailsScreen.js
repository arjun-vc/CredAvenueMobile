import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View
} from "react-native";
import _get from "lodash/get";

class TransactionDetailsScreen extends React.Component {
  render() {
   const { navigation } = this.props;
    console.log(navigation);
    return (
      <View style={{ height: "auto" }}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          {JSON.stringify(navigation.getParam("clientName", "NO-ID"))}
        </Text>
        <Text style={{ textAlign: "center", color: "skyblue" }}>
          {JSON.stringify(navigation.getParam("dealName", "NO-ID"))}
        </Text>
        <Text style={{ textAlign: "center", color: "red" }}>
          {JSON.stringify(navigation.getParam("transactionState", "NO-ID"))}
        </Text>
        <Text style={{ textAlign: "center" }}>
          Asset Class -{" "}
          {JSON.stringify(navigation.getParam("assetClass", "NO-ID"))}
        </Text>
        <Text style={{ textAlign: "center" }}>
          Bid - {JSON.stringify(navigation.getParam("hasBid", "NO-ID"))}
        </Text>
        <Text>
          {JSON.stringify(navigation.getParam("transactionType", "NO-ID"))}
        </Text>
        <Text>
          Amount -{" "}
          {JSON.stringify(
            navigation.getParam("humanizedIssuanceSize", "NO-ID")
          )}
        </Text>
        <Text>
          PoolType - {JSON.stringify(navigation.getParam("poolType", "NO-ID"))}
        </Text>
      </View>
    );
  }
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