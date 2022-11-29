import {
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Input, Button, Slider, Text, Icon } from "react-native-elements";
import { setTimer } from "../utils/utils";
import { database } from "../utils/firebase";
import { ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import UploadComponent from "../utils/UploadComponent";

export default function AddScreen({ navigation }) {
  const [plantName, setPlantName] = useState("");
  const [location, setLocation] = useState("");
  const [waterInterval, setWaterInterval] = useState(1);
  const [saved, setSaved] = useState(false);
  const user = getAuth().currentUser;
  let imageUrl = "";

  const getImageUrl = (url) => {
    imageUrl = url;
  };

  const handleSave = () => {
    const timeAfterInterval = setTimer(waterInterval);
    if (plantName.length === 0) {
      Alert.alert("Please add a name for the plant");
      return;
    }
    if (imageUrl.length === 0) {
      Alert.alert("Add an image first!");
      return;
    }
    try {
      push(ref(database, `plants/${user.uid}/`), {
        plantName,
        location,
        waterInterval,
        timeAfterInterval,
        progress: 1,
        imageUrl,
      });
      setSaved(true);
      Alert.alert(null, `${plantName} added!`, [
        { text: "ok", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (saved) {
      setPlantName("");
      setLocation("");
      setWaterInterval(1);
      imageUrl = "";
      setSaved(false);
    }
  }, [saved]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/pexels-adrian-mohammad-1224158.jpg")}
        resizeMode="cover"
        style={styles.imageBg}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.heading}>Add a new plant!</Text>
              <Input
                style={styles.input}
                placeholder="Name"
                onChangeText={(text) => setPlantName(text)}
                value={plantName}
              />
              <Input
                style={styles.input}
                placeholder="Location / room"
                onChangeText={(text) => setLocation(text)}
                value={location}
              />
              <View style={{ width: "70%", left: 50 }}>
                {waterInterval > 1 ? (
                  <Text style={styles.text}>
                    Water every {waterInterval} days
                  </Text>
                ) : (
                  <Text style={styles.text}>Water every day</Text>
                )}
                <Slider
                  value={waterInterval}
                  onValueChange={(value) => setWaterInterval(value)}
                  minimumValue={1}
                  maximumValue={14}
                  step={1}
                  trackStyle={{ height: 5 }}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: "transparent",
                  }}
                  thumbProps={{
                    children: (
                      <Icon
                        name="droplet"
                        type="feather"
                        size={15}
                        reverse
                        containerStyle={{ right: 15, bottom: 15 }}
                        color="#278c8c"
                      />
                    ),
                  }}
                />
              </View>
            </View>
            <UploadComponent func={getImageUrl} saved={saved} />
            <View style={styles.saveContainer}>
              <Button
                title="Save"
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
                onPress={handleSave}
                icon={
                  <Icon
                    type="feather"
                    name="save"
                    size={16}
                    color={darkGreen}
                  />
                }
              />
              <Button
                title="Clear"
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
                onPress={() => setSaved(true)}
                icon={
                  <Icon type="feather" name="x" size={16} color={darkGreen} />
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
}

const semiTransparent = "rgba(255, 255, 255, 0.8)";
const darkGreen = "#0b2613";
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    display: "flex",
  },
  imageBg: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height + 20,
    marginTop: 45,
  },
  innerContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    paddingBottom: 60,
  },
  heading: {
    fontSize: 28,
    color: darkGreen,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25,
    fontFamily: "serif",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: semiTransparent,
    width: 340,
    borderRadius: 5,
    marginTop: 50,
    marginBottom: 10,
    paddingHorizontal: 35,
    paddingTop: 10,
    paddingBottom: 20,
    position: "relative",
  },
  input: {
    marginBottom: 5,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 5,
  },
  saveContainer: {
    width: 340,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row-reverse",
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: semiTransparent,
    marginTop: 20,
  },
  buttonTitle: {
    fontFamily: "serif",
    fontWeight: "bold",
    color: darkGreen,
    marginLeft: 10,
    fontSize: 16,
  },
});
