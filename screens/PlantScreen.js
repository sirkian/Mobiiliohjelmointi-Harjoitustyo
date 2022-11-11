import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { database } from "../utils/firebase";
import { ref, remove, update } from "firebase/database";
import { Button, Text, Image, Icon, Input } from "react-native-elements";
import { getAuth } from "firebase/auth";
import { setTimer } from "../utils/utils";

export default function PlantScreen({ route, navigation }) {
  const [prog, setProg] = useState(0);
  const [plantName, setPlantName] = useState("");
  const [isNameEdited, setIsNameEdited] = useState(false);
  const { plant } = route.params;
  const user = getAuth().currentUser;

  useEffect(() => {
    updateProgress();
  }, []);

  const updateProgress = () => {
    setProg(plant.progress);
  };

  const handleEditName = () => {
    setPlantName(plant.plantName);
    setIsNameEdited(true);
  };

  const updateName = () => {
    update(ref(database, `plants/${user.uid}/${plant.key}`), {
      plantName,
    }).then(() => {
      Alert.alert("Sukses");
    });
    setPlantName(plant.plantName);
    setIsNameEdited(false);
  };

  const handleReset = async (plant) => {
    const timeAfterInterval = setTimer(plant.waterInterval);
    await update(ref(database, `plants/${user.uid}/${plant.key}`), {
      timeAfterInterval,
      progress: 1,
    });
    updateProgress();
  };

  const handleDelete = (plant) => {
    remove(ref(database, `plants/${user.uid}/${plant.key}`));
    navigation.navigate("Root");
  };

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

  return (
    <View style={styles.container}>
      <Image source={{ uri: plant.imageUrl }} style={styles.image} />
      <View style={styles.plantNameContainer}>
        {isNameEdited ? (
          <Input
            style={styles.plantNameInput}
            containerStyle={{ width: 300 }}
            value={plantName}
            onChangeText={(text) => setPlantName(text)}
            rightIcon={
              <Icon
                type="feather"
                name="save"
                containerStyle={{ marginLeft: 5, bottom: -3 }}
                size={20}
                color="white"
                onPress={updateName}
              />
            }
          />
        ) : (
          <Text style={styles.plantName} onPress={handleEditName}>
            {plant.plantName}
            {"  "}
            <Icon
              type="feather"
              name="edit"
              size={18}
              color="rgba(255, 255, 255, 0.65)"
            />
          </Text>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Icon type="feather" name="map-pin" size={14} color="black" />{" "}
            {plant.location}
          </Text>
          <Text style={styles.text}>
            <Icon type="feather" name="droplet" size={14} color="black" />{" "}
            {plant.waterInterval === 1 ? (
              <Text>Water every day</Text>
            ) : (
              <Text>Water every {plant.waterInterval} days</Text>
            )}
          </Text>
        </View>
        <Progress.Circle
          size={200}
          progress={prog}
          thickness={8}
          strokeCap="round"
          fill="transparent"
          color="#278c8c"
          unfilledColor="lightgrey"
          borderWidth={0}
          showsText
        />
      </View>
      <TouchableOpacity onPress={() => handleReset(plant)}>
        <Text style={styles.reset}>Reset</Text>
      </TouchableOpacity>
      <Button title="Delete" onPress={() => showAlert(plant)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    display: "flex",
    flex: 1,
    alignItems: "center",
  },
  image: {
    height: Dimensions.get("window").height * 0.45,
    width: Dimensions.get("window").width,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  plantNameContainer: {
    backgroundColor: "rgba(0,0,0,0.55)",
    position: "absolute",
    top: 140,
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginRight: 50,
  },
  plantName: {
    color: "white",
    fontSize: 28,
  },
  plantNameInput: {
    color: "white",
    fontSize: 28,
  },
  contentContainer: {
    width: Dimensions.get("window").width,
    display: "flex",
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 70,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  textContainer: {},
  text: {},
  reset: {
    position: "absolute",
    bottom: 110,
    left: 45,
    padding: 20,
    color: "#278c8c",
  },
});
