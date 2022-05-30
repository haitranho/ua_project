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
import { auth, store, db } from "../../firebase";
import { useNavigation } from "@react-navigation/core";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { Audio } from "expo-av";

const UploadScreen = ({ route }) => {
  // States
  const [songName, setSongName] = useState("");
  const [genre, setGenre] = useState("");
  const navigation = useNavigation();
  const [modiefiedAudio, setModifiedAudio] = React.useState(); // original audio sound object
  const { url, userID, dateCreated } = route.params; // Meta data for song upload

  /* *
   * Loads the originalAudio as soon as the component renders
   * Before hitting the record button to listen to the audio/record... watch
   * the console to make sure the audio has loaded first. There's a status message once the
   * original audio is loaded from Firebase. Even with the useEffect, its not quite as instant
   * as the RecordScreen loading
   */
  useEffect(() => {
    store // Gets file from firebase
      .ref("audio/overlayed_audio.wav")
      .getDownloadURL()
      .then(async function (url) {
        console.log(url);
        const modified = new Audio.Sound();
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: true,
          }); // Sets up phone to play properly
          const load_status = await modified.loadAsync({ uri: url }, {}, false); // Downloads url taken from firebase
          setModifiedAudio(modified); // Using the useState function to set the originalAudio state
          console.log("Loading Status: ", load_status);
        } catch (error) {
          console.log(error);
        }
      });
  }, [setModifiedAudio]);

  playModified = async () => {
    const status = await modiefiedAudio.playAsync(); // Play the originalAudio as soon as the user hits the record button
    console.log("Starting status: ", status);
  };

  const postRecording = () => {
    // Create meta data and upload it here
    const songData = {
      username: auth.currentUser.displayName,
      url: url,
      title: songName,
      genre: genre,
      dateCreated: dateCreated,
    };

    // Upload the meta data to the audio collection in Firebase DB
    db.collection("audio")
      .doc(songName)
      .set(songData)
      .then(() => {
        console.log("collection added!");
        navigation.navigate("Discover");
      });
  };

  const discard = () => {
    // navigation.navigate("Record2");
    navigation.navigate("Record2", {
      songUrl: "",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        label="songName"
        placeholder="Song Name"
        value={songName}
        onChangeText={setSongName}
      />
      <TextInput
        style={styles.input}
        label="genre"
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      {/* Button View */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={discard}>
          {/* Doesn't do anything right now */}
          {/* Need to implement the sign up page for this button to work */}
          <Text style={styles.btnText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userBtn} onPress={playModified}>
          {/* Doesn't do anything right now */}
          {/* Need to implement the sign up page for this button to work */}
          <Text style={styles.btnText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userBtn} onPress={postRecording}>
          <Text style={styles.btnText}>Post</Text>
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
    width: "30%",
    borderRadius: 10,
  },
  backBtn: {
    backgroundColor: "grey",
    padding: 15,
    width: "30%",
    borderRadius: 10,
  },
  btnText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default UploadScreen;
