import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getProgress, getTimeDiff } from "../utils";
import * as Progress from "react-native-progress";
import { database } from "../firebase";
import { ref, update } from "firebase/database";

export default function PlantScreen({ route, navigation }) {
  const [prog, setProg] = useState(0);
  const { plant } = route.params;

  useEffect(() => {
    setProg(plant.progress);
  }, []);

  return (
    <View>
      <Text>PlantScreen</Text>
      <Text>{plant.plantName}</Text>
      <Text>{plant.location}</Text>
      <Text>{plant.progress}</Text>
      <Progress.Circle
        size={200}
        progress={prog}
        thickness={8}
        strokeCap="round"
        fill="transparent"
        unfilledColor="lightgrey"
        borderWidth={0}
        showsText
      />
    </View>
  );
}

const styles = StyleSheet.create({});
