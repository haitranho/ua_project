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

const LoginScreen = () => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  /* *
   * Navigate to record screen if someone is logged in
   * this is basically a listener on the Firebase server to check if a user had signed in
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Discover");
      }
    });
    return unsubscribe;
  }, []);

  /**
   * Handle the user login using the inputted email and password,
   * then navigate to the record screen upon a successful authentication.
   */
  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        navigation.navigate("Discover");
      })
      .catch((error) => alert(error.message)); // print alert for failure
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/new_modio_logo.png")}
      style={{width: 100, height: 100, marginBottom: 110, marginTop: 110}}/>
      {/* <Text style={styles.welcome}>Login To Modio</Text> */}
      <TextInput
        style={styles.input}
        label="Username"
        placeholder="Username or Email"
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
        <TouchableOpacity style={styles.userBtn} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userBtn}>
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
    //justifyContent: "center",
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
    width: "95%",
  },
  userBtn: {
    backgroundColor: "#409e39",
    padding: 15,
    width: "45%",
    borderRadius: 10,
  },
  btnText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default LoginScreen;
