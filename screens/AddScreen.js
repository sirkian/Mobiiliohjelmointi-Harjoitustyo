import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { database } from "../utils/firebase";
import { push, ref } from "firebase/database";
import { Input, Button, Slider, Text } from "react-native-elements";
import { setTimer } from "../utils/utils";
import { getAuth } from "firebase/auth";

export default function AddScreen() {
  const [plantName, setPlantName] = useState("");
  const [location, setLocation] = useState("");
  const [waterInterval, setWaterInterval] = useState(1);
  const user = getAuth().currentUser;

  const handleSave = () => {
    const timeAfterInterval = setTimer(waterInterval);
    if (plantName.length > 0) {
      push(ref(database, `plants/${user.uid}/`), {
        plantName,
        location,
        waterInterval,
        timeAfterInterval,
        progress: 1,
      });
    }
    restoreState();
  };

  const restoreState = () => {
    setPlantName("");
    setLocation("");
    setWaterInterval(1);
  };

  return (
    <View>
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
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({});
