import {
  ScrollView,
  View,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../utils/firebase";
import { ref, onValue, update } from "firebase/database";
import { Tile, Text } from "react-native-elements";
import * as Progress from "react-native-progress";
import { getTimeDiff, getProgress } from "../utils/utils";
import { getAuth } from "firebase/auth";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const tileWidth = Dimensions.get("window").width * 0.8;
  const tileHeight = Dimensions.get("window").height * 0.2;
  const user = getAuth().currentUser;

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const fetchPlants = () => {
    const plantsRef = ref(database, `plants/${user.uid}/`);
    onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      const plants = data
        ? Object.keys(data).map((key) => ({ key, ...data[key] }))
        : [];
      setPlants(plants);
    });
  };

  useEffect(() => {
    if (plants.length !== 0) {
      handleUpdate();
    }
  }, [plants.length]);

  const handleUpdate = () => {
    try {
      plants.forEach((plant) => {
        const timeDiff = getTimeDiff(plant.timeAfterInterval);
        let progress = getProgress(timeDiff, plant.waterInterval);
        if (progress < 0.1) progress = 0;
        update(ref(database, `plants/${user.uid}/${plant.key}`), { progress });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = (plant) => {
    handleUpdate();
    navigation.navigate("Plant", { plant });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/gggrain.png")}
        resizeMode="stretch"
        style={{ width: "100%", height: "100%", marginTop: 45 }}
      >
        <StatusBar style="light" />
        <ScrollView>
          <View style={styles.scrollContainer}>
            {plants.length > 0 ? (
              plants.map((plant) => (
                <Tile
                  featured
                  key={plant.key}
                  imageSrc={{ uri: plant.imageUrl }}
                  title={plant.plantName}
                  titleStyle={styles.tileTitle}
                  caption={
                    <Progress.Bar
                      progress={plant.progress}
                      width={200}
                      height={8}
                      borderWidth={2}
                      borderColor="rgba(0, 0, 0, 0.5)"
                      unfilledColor="rgba(255, 255, 255, 0.7)"
                    />
                  }
                  containerStyle={{ marginBottom: 10 }}
                  imageProps={{
                    resizeMode: "cover",
                    transition: true,
                    borderRadius: 5,
                  }}
                  width={tileWidth}
                  height={tileHeight}
                  onPress={() => navigate(plant)}
                />
              ))
            ) : (
              <View style={{ height: Dimensions.get("window").height }}>
                <Text style={styles.text}>
                  Nothing in here yet. Go ahead and add a plant.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141414",
    marginBottom: 90,
  },
  scrollContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    paddingBottom: 60,
    paddingTop: 20,
    minHeight: Dimensions.get("window").height,
  },
  tileTitle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  text: {
    color: "#fadcb9",
    fontWeight: "bold",
    marginTop: 150,
  },
});
