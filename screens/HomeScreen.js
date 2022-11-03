import { ScrollView, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue, update } from "firebase/database";
import { Tile, Text } from "react-native-elements";
import * as Progress from "react-native-progress";
import { getTimeDiff, getProgress } from "../utils";

export default function HomeScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const tileWidth = Dimensions.get("window").width * 0.8;
  const tileHeight = Dimensions.get("window").height * 0.2;

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = () => {
    handleUpdate();
    const plantsRef = ref(database, "plants/");
    onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      const plants = data
        ? Object.keys(data).map((key) => ({ key, ...data[key] }))
        : [];
      setPlants(plants);
    });
  };

  const handleUpdate = () => {
    if (plants.length > 0) {
      plants.forEach((plant) => {
        const timeDiff = getTimeDiff(plant.timeAfterInterval);
        const progress = getProgress(timeDiff, plant.waterInterval);
        update(ref(database, "/plants/" + plant.key + "/"), { progress });
        console.log("FOREACH PROGG", progress);
      });
    }
  };

  return (
    <View>
      <ScrollView>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {plants.length > 0 ? (
            plants.map((plant) => (
              <Tile
                key={plant.key}
                imageSrc={require("../placeholder.jpg")}
                title={plant.plantName}
                caption={
                  <Progress.Bar
                    progress={plant.progress}
                    width={200}
                    borderWidth={5}
                    borderColor="rgba(255, 255, 255, 0.25)"
                    unfilledColor="rgba(255, 255, 255, 0.4)"
                  />
                }
                featured
                containerStyle={{ marginBottom: 10 }}
                width={tileWidth}
                height={tileHeight}
                onPress={() => navigation.navigate("Plant", { plant })}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "red",
                    height: 200,
                    width: 200,
                  }}
                >
                  <Text>test</Text>
                </View>
              </Tile>
            ))
          ) : (
            <Text>Nothing in here yet. Go ahead and add a plant.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
