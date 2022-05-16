import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import { useNavigation } from "@react-navigation/core";
import { store } from "../../firebase";
import { Audio } from "expo-av";

export default function DiscoveryScreen2() {
  const navigation = useNavigation();
  const [originalAudio, setOriginalAudio] = React.useState();
  const [originalAudioUrl, setOriginalAudioUrl] = React.useState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    store // Gets file from firebase
      .ref("instrumental.wav")
      .getDownloadURL()
      .then(async function (url) {
        console.log(url);
        setOriginalAudioUrl(url); // save the Url for other functions
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

   function modify() {
    // const originalAudioRef = store.ref("audio/overlayed_audio.wav");
    // const overlayURL = await overlayRef.getDownloadURL();
    navigation.navigate("Record2", {
      songUrl: originalAudioUrl.toString(),
    });
  }

  const playAudio = async () => {
    const status = await originalAudio.playAsync(); // Play the originalAudio as soon as the user hits the record button
    setIsPlaying(true);
    console.log("Starting status: ", status);
  };

  const pauseAudio = async () => {
    const status = await originalAudio.stopAsync(); // Play the originalAudio as soon as the user hits the record button
    setIsPlaying(false);
    console.log("Starting status: ", status);
  };

  // const handleAudioPlayPause = async () => {
  //   // It will pause our audio
  //   if (isPlaying[0]) {
  //     const status = await originalAudio.pauseAsync();
  //     // isPlaying[0] = false;
  //     setIsPlaying(true);
  //     // return setPlaybackStatus(status);
  //   }
  //   // It will resume our audio
  //   if (!isPlaying[0]) {
  //     const status = await originalAudio.playAsync();
  //     setIsPlaying(false);
  //     // isPlaying[0] = true;
  //     // return setPlaybackStatus(status);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.rectRow}>
        <Image
          style={styles.skipBack}
          source={require("../../assets/skip_back.png")}
        />
        <TouchableOpacity onPress={modify}>
          <Image
            style={styles.modify}
            source={require("../../assets/modify.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={isPlaying ? pauseAudio : playAudio}>
          <Image
            style={styles.playPause}
            source={
              isPlaying
                ? require("../../assets/pause.png")
                : require("../../assets/play.png")
            }
          />
        </TouchableOpacity>
        <Image
          style={styles.share}
          source={require("../../assets/share.png")}
        />
        <Image
          style={styles.skipForward}
          source={require("../../assets/skip_forward.png")}
        />
      </View>
      <View style={styles.rect5}></View>
      <Svg viewBox="0 0 50 50" style={styles.ellipse}>
        <Ellipse
          stroke="rgba(230, 230, 230,1)"
          strokeWidth={0}
          fill="lightcoral"
          cx={25}
          cy={25}
          rx={25}
          ry={25}
        ></Ellipse>
      </Svg>
      <View style={styles.ellipse1Row}>
        <Svg viewBox="0 0 50 50" style={styles.ellipse1}>
          <Ellipse
            stroke="rgba(230, 230, 230,1)"
            strokeWidth={0}
            fill="lightskyblue"
            cx={25}
            cy={25}
            rx={25}
            ry={25}
          ></Ellipse>
        </Svg>
        <Text style={styles.username}>hella_hai</Text>
      </View>
      <Text style={styles.lastModifiedBy}>Last Modified By:</Text>
      <Text style={styles.loremIpsum}></Text>
      <View style={styles.scrollArea}>
        <ScrollView
          horizontal={false}
          contentContainerStyle={styles.scrollArea_contentContainerStyle}
        >
          <View style={styles.rect6}></View>
          <View style={styles.ellipse2Row}>
            <Svg viewBox="0 0 50 50" style={styles.ellipse2}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="lightgreen"
                cx={25}
                cy={25}
                rx={25}
                ry={25}
              ></Ellipse>
            </Svg>
            <Text style={styles.username1}>jempact</Text>
          </View>
          <View style={styles.ellipse3Row}>
            <Svg viewBox="0 0 50 50" style={styles.ellipse3}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="lightyellow"
                cx={25}
                cy={25}
                rx={25}
                ry={25}
              ></Ellipse>
            </Svg>
            <Text style={styles.username2}>coleslaw</Text>
          </View>
          <View style={styles.ellipse5Row}>
            <Svg viewBox="0 0 50 50" style={styles.ellipse5}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="mediumaquamarine"
                cx={25}
                cy={25}
                rx={25}
                ry={25}
              ></Ellipse>
            </Svg>
            <Text style={styles.username4}>ash_cash</Text>
          </View>
          <View style={styles.ellipse4Row}>
            <Svg viewBox="0 0 50 50" style={styles.ellipse4}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="pink"
                cx={25}
                cy={25}
                rx={25}
                ry={25}
              ></Ellipse>
            </Svg>
            <Text style={styles.username3}>chris_mas</Text>
          </View>
        </ScrollView>
      </View>
      <Text style={styles.collaborators}>Collaborators:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBack: {
    width: 65,
    height: 65,
  },
  modify: {
    width: 65,
    height: 65,
  },
  playPause: {
    width: 65,
    height: 65,
  },
  share: {
    width: 65,
    height: 65,
  },
  skipForward: {
    width: 65,
    height: 65,
  },
  rectRow: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 730,
    marginLeft: 13,
    marginRight: 12,
  },
  rect5: {
    width: 200,
    height: 200,
    backgroundColor: "#E6E6E6",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 5,
    },
    elevation: 60,
    shadowOpacity: 1,
    shadowRadius: 20,
    overflow: "visible",
    marginTop: -637,
    marginLeft: 95,
  },
  ellipse: {
    width: 50,
    height: 50,
    marginTop: -292,
    marginLeft: 13,
  },
  ellipse1: {
    width: 50,
    height: 50,
  },
  username: {
    fontFamily: "Futura",
    color: "#121212",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 12,
  },
  ellipse1Row: {
    height: 50,
    flexDirection: "row",
    marginTop: 329,
    marginLeft: 13,
    marginRight: 209,
  },
  lastModifiedBy: {
    fontFamily: "Futura-Bold",
    color: "#121212",
    marginTop: -80,
    marginLeft: 13,
  },
  loremIpsum: {
    color: "#121212",
    marginTop: -304,
    marginLeft: 287,
  },
  scrollArea: {
    width: 350,
    height: 170,
    marginTop: 401,
    marginLeft: 13,
  },
  scrollArea_contentContainerStyle: {
    height: 300,
    width: 350,
  },
  rect6: {
    width: 50,
    height: 50,
    backgroundColor: "#E6E6E6",
    marginTop: -465,
    marginLeft: 300,
  },
  ellipse2: {
    width: 50,
    height: 50,
  },
  username1: {
    fontFamily: "Futura",
    color: "#121212",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 13,
  },
  ellipse2Row: {
    height: 50,
    flexDirection: "row",
    marginTop: 415,
    marginRight: 197,
  },
  ellipse3: {
    width: 50,
    height: 50,
  },
  username2: {
    fontFamily: "Futura",
    color: "#121212",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 12,
  },
  ellipse3Row: {
    height: 50,
    flexDirection: "row",
    marginTop: 9,
    marginRight: 197,
  },
  ellipse5: {
    width: 50,
    height: 50,
  },
  username4: {
    fontFamily: "Futura",
    color: "#121212",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 12,
  },
  ellipse5Row: {
    height: 50,
    flexDirection: "row",
    marginTop: 10,
    marginRight: 197,
  },
  ellipse4: {
    width: 50,
    height: 50,
  },
  username3: {
    fontFamily: "Futura",
    color: "#121212",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 13,
  },
  ellipse4Row: {
    height: 50,
    flexDirection: "row",
    marginTop: 8,
    marginRight: 197,
  },
  collaborators: {
    fontFamily: "Futura-Bold",
    color: "#121212",
    marginTop: -200,
    marginLeft: 13,
  },
});
