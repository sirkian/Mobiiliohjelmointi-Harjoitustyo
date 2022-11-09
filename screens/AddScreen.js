import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Input, Button, Slider, Text } from "react-native-elements";
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
  let imageUrl;

  const getImageUrl = (url) => {
    imageUrl = url;
  };

  const handleSave = () => {
    const timeAfterInterval = setTimer(waterInterval);
    if (plantName.length > 0) {
      push(ref(database, `plants/${user.uid}/`), {
        plantName,
        location,
        waterInterval,
        timeAfterInterval,
        progress: 1,
        imageUrl,
      });
    }
    setSaved(true);
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
      <UploadComponent func={getImageUrl} saved={saved} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({});
