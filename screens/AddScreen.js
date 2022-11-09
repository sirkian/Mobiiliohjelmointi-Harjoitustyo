import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
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
    if (plantName.length > 0 && imageUrl.length > 0) {
      push(ref(database, `plants/${user.uid}/`), {
        plantName,
        location,
        waterInterval,
        timeAfterInterval,
        progress: 1,
        imageUrl,
      });
      setSaved(true);
      Alert.alert(null, `${plantName} added!.`, [
        { text: "ok", onPress: () => navigation.navigate("Home") },
      ]);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.header}>Add a new plant!</Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Name"
              onChangeText={(text) => setPlantName(text)}
              value={plantName}
            />
            <Input
              placeholder="Location / room"
              onChangeText={(text) => setLocation(text)}
              value={location}
            />
            <View style={{ width: "70%", left: 50 }}>
              {waterInterval > 1 ? (
                <Text>Water every {waterInterval} days</Text>
              ) : (
                <Text>Water every day</Text>
              )}
              <Slider
                value={waterInterval}
                onValueChange={(value) => setWaterInterval(value)}
                minimumValue={1}
                maximumValue={14}
                step={1}
                trackStyle={{ height: 4 }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: "grey" }}
              />
            </View>
          </View>
          <UploadComponent func={getImageUrl} saved={saved} />
          <View style={styles.saveContainer}>
            <Icon type="feather" name="save" reverse onPress={handleSave} />
            <Text style={styles.text} onPress={() => setSaved(true)}>
              Clear
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const semiTransparent = "rgba(255, 255, 255, 0.15)";
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#0b2613",
    justifyContent: "space-around",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    color: "white",
    textAlign: "center",
    marginVertical: 15,
  },
  inputContainer: {
    backgroundColor: semiTransparent,
    width: 340,
    borderRadius: 5,
    height: "35%",
    marginBottom: 10,
  },
  saveContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    height: 100,
    marginTop: 8,
  },
  text: {
    color: "red",
    fontSize: 16,
  },
});
