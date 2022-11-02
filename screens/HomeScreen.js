import { ScrollView, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Tile, Text } from "react-native-elements";

export default function HomeScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const tileWidth = Dimensions.get("window").width * 0.8;
  const tileHeight = Dimensions.get("window").height * 0.2;

  useEffect(() => {
    const plantsRef = ref(database, "plants/");
    onValue(plantsRef, (snapshot) => {
      const data = snapshot.val();
      const plants = data
        ? Object.keys(data).map((key) => ({ key, ...data[key] }))
        : [];
      console.log(plants);
      setPlants(plants);
    });
  }, []);

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
                featured
                containerStyle={{ marginBottom: 10, borderRadius: 5 }}
                width={tileWidth}
                height={tileHeight}
                onPress={() => navigation.navigate("Plant", { plant })}
              ></Tile>
            ))
          ) : (
            <Text>Nothing in here yet.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
