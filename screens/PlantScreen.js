import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getTimeDiff, getProgress } from "../utils";
import * as Progress from "react-native-progress";
import { database } from "../firebase";
import { ref, update } from "firebase/database";

export default function PlantScreen({ route, navigation }) {
  const [progress, setProgress] = useState(1);
  const { plant } = route.params;
  const timeLeft = getTimeDiff(plant.timeAfterInterval);

  useEffect(() => {
    setProgress(getProgress(timeLeft, plant.waterInterval));
    handleUpdate();
  }, []);

  const handleUpdate = () => {
    update(ref(database, "/plants/" + plant.key + "/"), { progress });
    console.log(progress);
  };

  return (
    <View>
      <Text>PlantScreen</Text>
      <Text>{plant.plantName}</Text>
      <Text>{plant.location}</Text>
      <Progress.Circle
        size={200}
        progress={progress}
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
