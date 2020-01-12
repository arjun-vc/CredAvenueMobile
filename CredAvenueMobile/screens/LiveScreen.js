import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity
} from "react-native";
import _get from "lodash/get";
import { withNavigation } from "react-navigation";

class TransScreen extends React.Component {
  renderList = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("TransactionDetails", {item: JSON.stringify(item)});
        }}
      >
        <View
          style={{
            height: "auto",
            backgroundColor: "#fff",
            boxShadow: "rgb(153, 153, 153) 0px 0px 11px -3px inset",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "3px"
          }}
        >
          <Text
            style={{
              color: "#ffa602",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              marginBottom: 5
            }}
          >
            {_get(item, "clientName")}
          </Text>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                color: "rgba(123, 130, 149,0.7)",
                fontWeight: "500"
              }}
            >
              {_get(item, "dealName")}
            </Text>
            <Text
              style={{
                color: "#a8adbc",
                borderRadius: "3px",
                lineHeight: "12px",
                marginLeft: "auto",
                backgroundColor: "#f1f5f9",
                paddingTop: "3px",
                fontSize: "12px",
                paddingRight: "5px",
                paddingBottom: "3px",
                paddingLeft: "5px"
              }}
            >
              {_get(item, "transactionType")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { transList } = this.props;

    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={transList}
          renderItem={this.renderList}
          contentContainerStyle={{ padding: 10 }}
        />
      </ScrollView>
    );
  }
}

TransScreen.navigationOptions = {
  title: "Links"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#5478de"
  }
});

export default withNavigation(TransScreen);
