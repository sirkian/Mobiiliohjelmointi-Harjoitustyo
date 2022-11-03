import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "react-native-elements";

export default function ProfileScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <View>
      <Text>ProfileScreen</Text>
      <Text>{user.email}</Text>
      <Text>{user.uid}</Text>
      <Button title="Log out" onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({});
