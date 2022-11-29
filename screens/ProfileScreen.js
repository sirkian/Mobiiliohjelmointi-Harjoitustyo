import { StyleSheet, View, ImageBackground } from "react-native";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Text } from "react-native-elements";

export default function ProfileScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/gggrain.png")}
        resizeMode="stretch"
        style={{ width: "100%", height: "100%", marginTop: 45 }}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.text}>{user.email}</Text>
          <Button
            buttonStyle={{ backgroundColor: "transparent" }}
            title="Log out"
            onPress={() => signOut(auth)}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  innerContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  text: {
    color: "#fadcb9",
    fontWeight: "bold",
    marginTop: 150,
    marginBottom: 5,
  },
});
