import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Audio } from "expo-av";
import { store } from "../../firebase";
import axios from "axios";

import Sound from "react-native-sound";

export default function RecordScreen() {
  // Holds current recording
  const [recording, setRecording] = React.useState();
  // Holds past recordings
  const [recordings, setRecordings] = React.useState([]);
  // Error message
  const [message, setMessage] = React.useState("");
  const [uri, setURI] = useState("");

  // sound state for original audio
  const [originalURL, setOriginalURL] = React.useState();

  const overlayBothURLs = async (url1, url2) => {
    await axios
      .put("http://127.0.0.1:5000/audio", {
        audioURL1: url1,
        audioURL2: url2,
      })
      .then(() => {
        console.log("Overlayed both audio");
      });
  };

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
        recording.setOnRecordingStatusUpdate();

        // Play sound when recording --- NOT CURRENTLY WORKING FOR SOME REASON
        playSound();
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
  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button
            style={styles.button}
            onPress={uploadRecording}
            title="Save"
          ></Button>
        </View>
      );
    });
  }

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

  const getRecording = async () => {
    store // Gets file from firebase
      .ref("recording.wav")
      .getDownloadURL()
      .then(async function (url) {
        console.log(url);
        const sound = new Audio.Sound();
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
          }); // Sets up phone to play properly
          const load_status = await sound.loadAsync({ uri: url }, {}, true); // Downloads url taken from firebase
          console.log(load_status);
          const status = await sound.playAsync(); //
          console.log(status);
          //await sound.unloadAsync();
        } catch (error) {
          console.log(error);
        }
      });
  };

  /**
   *  This is a test function for the people working on communicating from the frontend to backend
   *  It will grab the URLs of the two files we are trying to overlap from Firebase
   *  The current goal is to transfer this over to the Python backend so it can pull the files
   *  and then merge it
   */
  const getURL = async () => {
    const instrumentalRef = store.ref("instrumental.wav");
    const voiceRef = store.ref("recording.wav");
    const instrumentalURL = await instrumentalRef.getDownloadURL();
    const recordingURL = await voiceRef.getDownloadURL();
    console.log("instrumental.wav URL: ", instrumentalURL);
    console.log("recording.wav URL: ", recordingURL);

    overlayBothURLs(instrumentalURL.toString(), recordingURL.toString());
  };

  /**
   *  Attempted to create a function that played the instrumental given the reference.
   *  It gets the download URL, uses a useState to set the originalURL and creates a sound object
   *  I attempt to call this function in startRecording, not entirely sure if I called it in the right place.
   */
  async function playSound() {
    // console.log('Loading Sound');
    const instrumentalRef = store.ref("instrumental.wav");
    const instrumentalURL = await instrumentalRef.getDownloadURL();
    setOriginalURL(instrumentalURL);

    const sound = new Sound(originalURL, null, (error) => {
      if (error) {
        // do something
        console.log("there an error");
      }
      // play when loaded
      sound.play();
    });
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
        <Image
          source={
            recording
              ? require("../../assets/recordingmic.png")
              : require("../../assets/startrecordingmic.png")
          }
          style={{
            width: 120,
            height: 200,
            marginTop: -170,
            marginLeft: 20,
            position: "relative",
          }}
        />
        <Image
          source={
            recording
              ? require("../../assets/stopbutton.png")
              : require("../../assets/recordbutton.png")
          }
          style={{
            width: 50,
            height: 60,
            marginBottom: 50,
            marginTop: 30,
            marginLeft: 55,
            position: "relative",
          }}
        />
      </TouchableOpacity>
      <Button title="Get Recording" onPress={getRecording} />
      <Button title="Upload modified track" onPress={getURL} />
      {getRecordingLines()} 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1C22",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
    color: "#DEE1E9",
    backgroundColor: "#25262C",
    padding: 10,
  },
  button: {
    margin: 16,
  },
});
