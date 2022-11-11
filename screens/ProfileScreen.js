import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Text } from "react-native-elements";

export default function ProfileScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text>ProfileScreen</Text>
        <Text>{user.email}</Text>
        <Text>{user.uid}</Text>
        <Button title="Log out" onPress={() => signOut(auth)} />
      </View>
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
    backgroundColor: "white",
    flex: 1,
    marginTop: 45,
  },
});
