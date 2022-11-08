import { StyleSheet, View, Dimensions } from "react-native";
import React, { useState } from "react";
import firebase from "../utils/firebase";
import { Button, Image, Input, Text } from "react-native-elements";

const auth = firebase.auth();

export default function WelcomeScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");

  const handleLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setEmailError("");
      setPwdError("");
      if (err.code === "auth/invalid-email") {
        setEmailError("Email address is badly formatted.");
      } else if (err.code === "auth/user-not-found") {
        setEmailError("No user found.");
      } else if (err.code === "auth/wrong-password") {
        setPwdError("Invalid password.");
      } else {
        setPwdError(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.loginImage}
          source={require("../placeholder.jpg")}
        />
      </View>
      <View style={styles.loginContainer}>
        <Input
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          value={email}
          leftIcon={{
            type: "feather",
            name: "at-sign",
            size: 22,
            color: "grey",
          }}
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          errorMessage={emailError}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
          value={password}
          leftIcon={{
            type: "feather",
            name: "lock",
            size: 22,
            color: "grey",
          }}
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          errorMessage={pwdError}
        />
        <Button
          type="clear"
          title="Login"
          onPress={handleLogin}
          titleStyle={{ color: "#0b2613" }}
          containerStyle={styles.button}
        />
        <Text style={styles.text} onPress={() => navigation.navigate("Signup")}>
          Not registered yet? Sign up here.
        </Text>
      </View>
    </View>
  );
}

const semiTransparent = "rgba(255, 255, 255, 0.6)";
export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0b2613",
  },
  loginImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.75,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  loginContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    width: "80%",
    padding: 50,
    borderRadius: 10,
    position: "relative",
    bottom: 340,
    borderRadius: 20,
  },
  inputContainer: {
    backgroundColor: semiTransparent,
    borderRadius: 10,
    marginBottom: 15,
    width: 250,
  },
  input: {
    color: "black",
  },
  text: {
    color: "#f7f7f7",
    marginTop: 30,
    fontSize: 12,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: semiTransparent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
