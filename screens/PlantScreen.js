import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getTimeDiff, getTimePerc } from "../utils";

export default function PlantScreen({ route, navigation }) {
  const { plant } = route.params;
  const timeLeft = getTimeDiff(plant.timeAfterInterval);
  const percents = getTimePerc(timeLeft, plant.waterInterval);

  console.log("Time left ms: ", timeLeft);
  console.log("%: ", percents);

  return (
    <View>
      <Text>PlantScreen</Text>
      <Text>{plant.plantName}</Text>
      <Text>{plant.location}</Text>
      <Text>{plant.waterIntervalInHrs}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
