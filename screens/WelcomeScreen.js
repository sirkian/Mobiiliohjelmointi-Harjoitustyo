import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import firebase from "../utils/firebase";
import { ErrorMsg } from "../utils/errorMsg";
import { Button, Input, Text } from "react-native-elements";

const auth = firebase.auth();

export default function WelcomeScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View>
      <Text>Welcome</Text>
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
      {error ? <ErrorMsg error={error} visible={true} /> : null}
      <Button onPress={handleLogin} title="Login" />
      <Text onPress={() => navigation.navigate("Signup")}>
        Not registered yet? Sign up here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
