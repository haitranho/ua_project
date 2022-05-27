import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Touchable,
  Image,
} from "react-native";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/core";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const LoginScreen = () => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  /**
   * Handle the user login using the inputted email and password,
   * then navigate to the record screen upon a successful authentication.
   */
  const handleSignIn = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        userCredentials.user.updateProfile({
            displayName: username
        });
        navigation.navigate("Login");
        return () => {
            setEmail("");
            setPassword("");
            setUsername("");
        }
      })
      .catch((error) => alert(error.message)); // print alert for failure
  };

  const back = () => {
      navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.welcome}>Login To Modio</Text> */}
      <TextInput
        style={styles.input}
        label="Username"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        label="Email"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      

      {/* Button View */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={back}>
          {/* Doesn't do anything right now */}
          {/* Need to implement the sign up page for this button to work */}
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userBtn} onPress={handleSignIn}>
          {/* Doesn't do anything right now */}
          {/* Need to implement the sign up page for this button to work */}
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    color: "black",
    margin: 10,
  },
  input: {
    width: "90%",
    backgroundColor: "lightgrey",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "92%",
  },
  userBtn: {
    backgroundColor: "#409e39",
    padding: 15,
    width: "47%",
    borderRadius: 10,
  },
  backBtn: {
    backgroundColor: "grey",
    padding: 15,
    width: "47%",
    borderRadius: 10,
  },
  btnText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default LoginScreen;