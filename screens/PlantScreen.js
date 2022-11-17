import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { database } from "../utils/firebase";
import { ref, remove, update, onValue } from "firebase/database";
import { Button, Text, Image, Icon, Input } from "react-native-elements";
import { getAuth } from "firebase/auth";
import { setTimer, formatTime, deleteImageFromStorage } from "../utils/utils";

export default function PlantScreen({ route, navigation }) {
  const [prog, setProg] = useState(0);
  const [plantName, setPlantName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const { plant } = route.params;
  const user = getAuth().currentUser;
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    setProg(plant.progress);
    setTimeLeft(formatTime(plant.timeAfterInterval));
  }, []);

  const handleEditName = () => {
    setPlantName(plant.plantName);
    setEditingName(true);
  };

  const updateName = () => {
    update(ref(database, `plants/${user.uid}/${plant.key}`), {
      plantName,
    });
    plant.plantName = plantName;
    setEditingName(false);
  };

  const handleReset = (plant) => {
    const timeAfterInterval = setTimer(plant.waterInterval);
    update(ref(database, `plants/${user.uid}/${plant.key}`), {
      timeAfterInterval,
      progress: 1,
    });
    setTimeLeft(formatTime(timeAfterInterval));
    setProg(1);
  };

  const showAlert = (plant) => {
    Alert.alert(
      "Delete plant?",
      `Plant ${plant.plantName} will be deleted permanently.`,
      [
        {
          text: "cancel",
        },
        { text: "delete", onPress: () => handleDelete(plant) },
      ]
    );
  };

  const handleDelete = (plant) => {
    deleteImageFromStorage(plant.imageUrl);
    remove(ref(database, `plants/${user.uid}/${plant.key}`));
    navigation.navigate("Root");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/gggrain.png")}
        resizeMode="stretch"
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image source={{ uri: plant.imageUrl }} style={styles.image} />
        <View style={styles.plantNameContainer}>
          {editingName ? (
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
              <Icon type="feather" name="map-pin" size={14} color="white" />{" "}
              {plant.location}
            </Text>
            <Text style={styles.text}>
              <Icon type="feather" name="droplet" size={14} color="white" />{" "}
              {plant.waterInterval === 1 ? (
                <Text style={styles.text}>Water every day</Text>
              ) : (
                <Text style={styles.text}>
                  Water every {plant.waterInterval} days
                </Text>
              )}
            </Text>
            <Text style={styles.text}>
              <Icon type="feather" name="clock" size={14} color="white" />{" "}
              {timeLeft}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <Progress.Circle
              size={Dimensions.get("window").width * 0.45}
              progress={prog}
              thickness={8}
              strokeCap="round"
              fill="transparent"
              color="#4bd2db"
              unfilledColor="#1b1c1c"
              borderWidth={0}
              showsText
            />
            <Text onPress={() => handleReset(plant)} style={styles.reset}>
              Reset
            </Text>
          </View>
        </View>

        <Button
          title="Delete"
          buttonStyle={{ backgroundColor: "#1b1c1c" }}
          containerStyle={styles.deleteBtn}
          titleStyle={{ color: "#fadcb9" }}
          onPress={() => showAlert(plant)}
        />
      </ImageBackground>
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
    height: Dimensions.get("window").height * 0.55,
    display: "flex",
    flexDirection: "row",
    marginBottom: 70,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  textContainer: {
    display: "flex",
    flex: 1,
    paddingTop: 20,
  },
  progressContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  text: {
    marginBottom: 5,
    color: "#fadcb9",
  },
  reset: {
    position: "relative",
    bottom: 60,
    color: "#fadcb9",
  },
  deleteBtn: {
    position: "relative",
    bottom: 180,
  },
});
