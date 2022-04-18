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

export default function DiscoveryScreen() {

    const [playing, setPlaying] = React.useState();

    async function play() {
        setPlaying(true);
        console.log("Play");
    }

    async function pause() {
        setPlaying(undefined);
        console.log("Pause");
    }

    return (
        <View style={styles.container}>
            <View>
                <Image
                    source={ require("../../assets/album_cover.png") }
                    style={{
                        width: 200,
                        height: 200,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#000000",
                        shadowColor: "#000000",
                        shadowOffset: {width: -2, height: 4},
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                    }}
                />
            </View>
            <View style={[styles.container, {
                flexDirection: "row",
                alignContent: "space-around"
            }]}>
                <View style={styles.container}>
                    <Image
                        source={ require("../../assets/skip_back.png") }
                        style={{
                            width: 100,
                            height: 100,
                            justifyContent: "center",
                            bottom: -150,
                        }}
                    />
                </View>
                <View style={styles.container}>
                    <Image
                        source={ require("../../assets/modify.png") }
                        style={{
                            width: 65,
                            height: 65,
                            justifyContent: "center",
                            bottom: -150,
                        }}
                    />
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={playing ? pause : play}>
                    <Image
                        source={ playing ? require("../../assets/pause.png") : require("../../assets/play.png") }
                        style={{
                            width: 100,
                            height: 100,
                            justifyContent: "center",
                            bottom: -150,
                        }}
                    />
                    </TouchableOpacity>
                    <StatusBar style="auto" />
                </View>
                <View style={styles.container}>
                    <Image
                        source={ require("../../assets/share.png") }
                        style={{
                            width: 65,
                            height: 65,
                            justifyContent: "center",
                            bottom: -150,
                        }}
                    />
                </View>
                <View style={styles.container}>
                    <Image
                        source={ require("../../assets/skip_forward.png") }
                        style={{
                            width: 100,
                            height: 100,
                            justifyContent: "center",
                            bottom: -150,
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
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