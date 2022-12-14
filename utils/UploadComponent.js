import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Button, Icon, Image } from "react-native-elements";
import Firebase from "./firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import uuid from "uuid";

const storage = getStorage(Firebase);

export default function UploadComponent(props) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed to open camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (image !== null) {
        const uploadUrl = await uploadImage(image.uri);
        setImage(uploadUrl);
        setIsUploaded(true);
      }
    } catch (err) {
      Alert.alert("Upload failed!", err.message);
    }
    setUploading(false);
  };

  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (err) => {
        console.log("uploadImage failed", err);
        reject(new TypeError("Network request failed!"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, uuid.v4());
    const result = await uploadBytes(fileRef, blob);
    blob.close();
    return await getDownloadURL(fileRef);
  };

  if (isUploaded) {
    props.func(image);
  }

  useEffect(() => {
    if (props.saved) {
      setImage(null);
      setIsUploaded(false);
    }
  }, [props.saved]);

  return (
    <View style={styles.container}>
      {isUploaded ? (
        <View>
          <Image style={styles.image} source={{ uri: image }} />
          <Icon
            reverse
            type="feather"
            name="check-circle"
            color="green"
            size={iconSize}
            containerStyle={styles.icon}
          />
        </View>
      ) : (
        <View>
          {image !== null ? (
            <Image style={styles.image} source={{ uri: image.uri }} />
          ) : (
            <>
              <Button
                onPress={pickImage}
                title="PICK IMAGE"
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
              />
              <Button
                onPress={openCamera}
                title="OPEN CAMERA"
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
              />
            </>
          )}
          {!uploading && image !== null && (
            <View style={styles.iconView}>
              <Icon
                reverse
                color="rgba(54, 156, 81, 0.8)"
                type="feather"
                name="check"
                onPress={handleUpload}
                containerStyle={styles.iconContainer}
              />
              <Icon
                reverse
                color="rgba(0, 0, 0, 0.6)"
                type="feather"
                name="x"
                onPress={() => setImage(null)}
                containerStyle={styles.iconContainer}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const iconSize = 28;
const darkGreen = "#0b2613";
const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: 340,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  image: {
    height: 200,
    width: 340,
    borderRadius: 5,
  },
  iconView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: -66,
  },
  iconContainer: {
    positition: "absolute",
    bottom: 80,
  },
  icon: {
    position: "absolute",
    bottom: 100 - iconSize,
    left: 160 - iconSize,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    marginTop: 10,
  },
  buttonTitle: {
    color: darkGreen,
    marginLeft: 5,
    fontSize: 16,
  },
});
