import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import React, { useState } from "react";
import firebase from "../utils/firebase";

const auth = firebase.auth();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  console.log(email, password);

  const handleSignup = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
  };

  return (
    <View>
      <Text>SignupScreen</Text>
      <Input
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Input
        placeholder="Password"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button onPress={handleSignup} title="Register" />
      <Text onPress={() => navigation.navigate("Welcome")}>
        Already an user? Sign in.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
