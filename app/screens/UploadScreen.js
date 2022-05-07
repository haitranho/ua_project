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

const UploadScreen = () => {
  // States
  const [songName, setSongName] = useState("");
  const navigation = useNavigation();

  const postRecording = () => {
    navigation.navigate("Record2");
  };

  const discard = () => {
    navigation.navigate("Record2");
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        label="songName"
        placeholder="Song Name"
        value={songName}
        onChangeText={setSongName}
      />
      {/* Button View */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.userBtn} onPress={postRecording}>
          <Text style={styles.btnText}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userBtn} onPress={discard}>
          {/* Doesn't do anything right now */}
          {/* Need to implement the sign up page for this button to work */}
          <Text style={styles.btnText}>Discard</Text>
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

export default UploadScreen;
