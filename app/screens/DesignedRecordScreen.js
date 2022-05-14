import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

import { Audio } from "expo-av";
import { auth, store } from "../../firebase";
import axios from "axios";

export default function DesignedRecordScreen() {
  const [recording, setRecording] = React.useState(); // Holds current recording
  const [recordings, setRecordings] = React.useState([]); // Holds past recordings
  const [message, setMessage] = React.useState(""); // Error message
  const [uri, setURI] = useState(""); // Sets the URI of the audio recording
  const [originalAudio, setOriginalAudio] = React.useState(); // original audio sound object
  const [originalOverlayAudio, setOverlayAudio] = React.useState(); // original audio sound object
  const [originalURL, setOriginalURL] = React.useState(); // original audio url
  const navigation = useNavigation();

  // Navigation stuff
  const back = () => {
    navigation.navigate("Login");
  };

  /**
   * Playback function after the user has finished listening
   */

  /* *
   * This function will over lay the user's voice over the audio to be modified
   * and then send the meta data for the upload to the UploadScreen so that the data
   * can be uploaded to Firebase db.
   */
  async function post() {
    // get the URL of the overlayed audio
    const overlayRef = store.ref("audio/overlayed_audio.wav");
    const overlayURL = await overlayRef.getDownloadURL();
    // console.log("The overlay url is: ");
    // console.log(overlayURL.toString());

    // Navigate to the Upload screen
    navigation.navigate("Upload", {
      url: overlayURL.toString(),
      userID: auth.currentUser.uid,
    });
  }

  /* *
   * Loads the originalAudio as soon as the component renders
   * Before hitting the record button to listen to the audio/record... watch
   * the console to make sure the audio has loaded first. There's a status message once the
   * original audio is loaded from Firebase. Even with the useEffect, its not quite as instant
   * as the RecordScreen loading
   */
  useEffect(() => {
    store // Gets file from firebase
      .ref("instrumental.wav")
      .getDownloadURL()
      .then(async function (url) {
        console.log(url);
        const original = new Audio.Sound();
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: true,
          }); // Sets up phone to play properly
          const load_status = await original.loadAsync({ uri: url }, {}, false); // Downloads url taken from firebase
          setOriginalAudio(original); // Using the useState function to set the originalAudio state
          console.log("Loading Status: ", load_status);
          // await originalAudio.playAsync();
        } catch (error) {
          console.log(error);
        }
      });
  }, [setOriginalAudio]);

  // Recording stuff
  const overlayBothURLs = async (url1, url2) => {
    await axios
      .put("http://127.0.0.1:5000/audio", {
        audioURL1: url1,
        audioURL2: url2,
      })
      .then(() => {
        console.log("Overlayed both audio");
      });
    getOverlayLines();
  };

  function getOverlayLines() {
    store
      .ref("audio/overlayed_audio.wav")
      .getDownloadURL()
      .then(async function (url) {
        console.log(url);
        const overlayAudio = new Audio.Sound();
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: true,
          }); // Sets up phone to play properly
          const load_status = await overlayAudio.loadAsync(
            { uri: url },
            {},
            false
          ); // Downloads url taken from firebase
          setOverlayAudio(overlayAudio); // Using the useState function to set the originalAudio state
          // <Button
          //   style={styles.button}
          //   onPress={() => overlayAudio.replayAsync()}
          //   title="Play"
          // ></Button>;
          // console.log("Loading Status: ", load_status);
          const status = await overlayAudio.playAsync(); // Play the originalAudio as soon as the user hits the record button
          <view>
            <Button
              style={styles.button}
              onPress={() => overlayAudio.replayAsync()}
              title="Play"
            ></Button>
          </view>;
          // console.log("Loading Status: ", load_status);
          console.log("Starting status: ", status);
          // await originalAudio.playAsync();
        } catch (error) {
          console.log(error);
        }
      });
  }

  // return recordings.map((recordingLine, index) => {
  //   return (
  //     <View key={index} style={styles.row}>
  //       <Text style={styles.fill}>
  //         Recording {index + 1} - {recordingLine.duration}
  //       </Text>
  //       <Button
  //         style={styles.button}
  //         onPress={() => recordingLine.sound.replayAsync()}
  //         title="Play"
  //       ></Button>
  //       <Button
  //         style={styles.button}
  //         onPress={uploadRecording}
  //         title="Save"
  //       ></Button>
  //     </View>
  //   );
  // });
  // }

  // Start recording function
  async function startRecording() {
    try {
      // Request access to mic
      const permission = await Audio.requestPermissionsAsync();
      // Access to mic
      if (permission.status === "granted") {
        // Allow recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync({
          isMeteringEnabled: true,
          android: {
            extension: ".m4a",
            outputFormat:
              Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_THREE_GPP,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".wav",
            audioFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 176400,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        });
        const status = await originalAudio.playAsync(); // Play the originalAudio as soon as the user hits the record button
        console.log("Starting status: ", status);
        recording.setOnRecordingStatusUpdate();
        // const status = await originalAudio.playAsync(); // Play the originalAudio as soon as the user hits the record button
        // console.log("Starting status: ", status);
        await recording.startAsync();
        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
      // Denied access
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  // Stop recording function
  async function stopRecording() {
    const stopStatus = await originalAudio.stopAsync(); // First, stop the audio of the instrumental from playing
    console.log("Stopping status: ", stopStatus);
    setRecording(undefined);
    // Stops the recording and from memory
    await recording.stopAndUnloadAsync();

    // Get existing recordings
    let updatedRecordings = [...recordings];
    // New Sound object to play back the recording and status of the Sound object
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setURI(recording.getURI());
    // Add array of recordings
    setRecordings(updatedRecordings);
    console.log(recording.getURI());

    // Some temporary functionality for now. Gonna upload the recording as soon as the user stops the recording
    await uploadRecording();

    // Overlay audio
    const instrumentalRef = store.ref("instrumental.wav");
    const voiceRef = store.ref("recording.wav");
    const instrumentalURL = await instrumentalRef.getDownloadURL();
    const recordingURL = await voiceRef.getDownloadURL();
    console.log("instrumental.wav URL: ", instrumentalURL);
    console.log("recording.wav URL: ", recordingURL);
    await overlayBothURLs(instrumentalURL.toString(), recordingURL.toString());
  }

  // Duration of the recording
  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  // Get recording lines and have them displayed
  // function getRecordingLines() {
  //   return recordings.map((recordingLine, index) => {
  //     return (
  //       <View key={index} style={styles.row}>
  //         <Text style={styles.fill}>
  //           Recording {index + 1} - {recordingLine.duration}
  //         </Text>
  //         <Button
  //           style={styles.button}
  //           onPress={() => recordingLine.sound.replayAsync()}
  //           title="Play"
  //         ></Button>
  //         <Button
  //           style={styles.button}
  //           onPress={uploadRecording}
  //           title="Save"
  //         ></Button>
  //       </View>
  //     );
  //   });
  // }

  const uploadRecording = async () => {
    const response = await fetch(uri);
    const blob = await response.blob();

    /* Save the audio recording into Storage and using the recording's uri */
    store
      .ref()
      .child("recording.wav")
      .put(blob)
      .then(() => {
        console.log("Succesfully saved");
        // Navigate out to another window later
      })
      .catch((e) => console.log("uploading image error =>", e));
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectRow}>
        <TouchableOpacity onPress={back}>
          <Image
            style={styles.back}
            source={require("../../assets/backButton.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.post} onPress={post}>
          <Text style={styles.btnText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cover}>
        <Image
          style={{ width: 100, height: 100 }}
          source={require("../../assets/musicNote.png")}
        />
      </View>
      <Text style={styles.songName}>Song Name</Text>
      <Image style={styles.add} source={require("../../assets/combine.png")} />
      <TouchableOpacity
        style={styles.recordButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Image
          style={{ width: 125, height: 125 }}
          source={
            recording
              ? require("../../assets/recording.png")
              : require("../../assets/notRecording.png")
          }
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    width: 50,
    height: 50,
  },
  post: {
    width: 60,
    height: 50,
    backgroundColor: "#409e39",
    padding: 15,
    borderRadius: 10,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 260,
  },
  rectRow: {
    height: 50,
    flexDirection: "row",
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  cover: {
    width: 175,
    height: 175,
    backgroundColor: "#E6E6E6",
    marginTop: 66,
    marginLeft: 100,
    justifyContent: "center",
    padding: 35,
  },
  songName: {
    color: "#121212",
    marginTop: 15,
    marginLeft: 151,
  },
  add: {
    width: 80,
    height: 80,
    marginTop: 38,
    marginLeft: 148,
  },
  recordButton: {
    width: 125,
    height: 125,
    marginTop: 51,
    marginLeft: 125,
  },
});
