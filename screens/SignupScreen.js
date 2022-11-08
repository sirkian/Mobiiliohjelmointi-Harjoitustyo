import { View } from "react-native";
import { Button, Input, Text, Image } from "react-native-elements";
import React, { useState } from "react";
import firebase from "../utils/firebase";
import { styles } from "./WelcomeScreen";

const auth = firebase.auth();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");

  const handleSignup = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err) {
      setEmailError("");
      setPwdError("");
      if (err.code === "auth/invalid-email") {
        setEmailError("Email address is badly formatted.");
      } else if (err.code === "auth/email-already-in-use") {
        setEmailError("User already exists with this email.");
      } else if (err.code === "auth/weak-password") {
        setPwdError("Password should be at least 6 characters.");
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
          title="Register"
          onPress={handleSignup}
          titleStyle={{ color: "#0b2613" }}
          containerStyle={styles.button}
        />
        <Text
          style={styles.text}
          onPress={() => navigation.navigate("Welcome")}
        >
          Already an user? Sign in.
        </Text>
      </View>
    </View>
  );
}
