import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/core";

export default function DesignedRecordScreen() {
  const navigation = useNavigation();

  const back = () => {
    navigation.navigate("Login");
  }

  const post = () => {
    navigation.navigate("Upload");
  }

  return (
    <View style={styles.container}>
      <View style={styles.rectRow}>
        <TouchableOpacity onPress={back}>
          <Image style={styles.back} source={require("../../assets/backButton.png")}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.post} onPress={post}>
          <Text style={styles.btnText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cover}>
        <Image style={{width: 100, height: 100}} source={require("../../assets/musicNote.png")}/>
      </View>
      <Text style={styles.songName}>Song Name</Text>
      <Image style={styles.add} source={require("../../assets/combine.png")}/>
      <TouchableOpacity style={styles.recordButton}>
        <Image style={{width: 125, height: 125}} source={require("../../assets/notRecording.png")}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    marginLeft: 260
  },
  rectRow: {
    height: 50,
    flexDirection: "row",
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10
  },
  cover: {
    width: 175,
    height: 175,
    backgroundColor: "#E6E6E6",
    marginTop: 66,
    marginLeft: 100,
    justifyContent: "center",
    padding: 35
  },
  songName: {
    color: "#121212",
    marginTop: 15,
    marginLeft: 151
  },
  add: {
    width: 80,
    height: 80,
    marginTop: 38,
    marginLeft: 148
  },
  recordButton: {
    width: 125,
    height: 125,
    marginTop: 51,
    marginLeft: 125
  }
});
