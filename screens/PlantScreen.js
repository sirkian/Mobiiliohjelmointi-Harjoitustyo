import { StyleSheet, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { database } from "../utils/firebase";
import { ref, remove } from "firebase/database";
import { Button, Text } from "react-native-elements";
import { getAuth } from "firebase/auth";

export default function PlantScreen({ route, navigation }) {
  const [prog, setProg] = useState(0);
  const { plant } = route.params;
  const user = getAuth().currentUser;

  useEffect(() => {
    setProg(plant.progress);
  }, []);

  const showAlert = (plant) => {
    Alert.alert(
      "Delete plant?",
      `Plant ${plant.plantName} will be deleted permanently.`,
      [
        {
          text: "cancel",
          style: "cancel",
        },
        { text: "delete", onPress: () => handleDelete(plant) },
      ]
    );
  };

  const handleDelete = (plant) => {
    remove(ref(database, `plants/${user.uid}/${plant.key}`));
    navigation.navigate("Root");
  };

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
      <Button title="Delete" onPress={() => showAlert(plant)} />
    </View>
  );
}

const styles = StyleSheet.create({});
