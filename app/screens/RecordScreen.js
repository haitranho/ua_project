import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import { store } from "../../firebase";
// import Sound from "react-native-sound";

export default function RecordScreen() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [uri, setURI] = useState("");

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setURI(recording.getURI());
    setRecordings(updatedRecordings);
    console.log(recording.getURI());
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

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
      .child("audiofile.m4a")
      .put(blob)
      .then(() => {
        console.log("Succesfully saved");
        // Navigate out to another window later
      })
      .catch((e) => console.log("uploading image error =>", e));
  };

  /*const getRecording = async () => {
    store
      .ref("audiofile.m4a")
      .getDownloadURL()
      .then(function(url) {
        console.log(url);
        const track = new Sound(url, null, (e) => {
          if (e) {
            console.log('error loading track:', e)
          } else {
            track.play()
          }
        });
      });
  }*/

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      {/* <Button
        title="Get Recording"
        onPress={getRecording}
      /> */}
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
  button: {
    margin: 16,
  },
});
