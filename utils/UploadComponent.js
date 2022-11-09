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
    console.log(result);
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
          <Image
            style={{
              height: 300,
              width: 400,
            }}
            source={{ uri: image }}
          />
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
            <Image
              style={{ width: 100, height: 100 }}
              source={{ uri: image.uri }}
            />
          ) : (
            <Button onPress={pickImage} title="PICK IMAGE" />
          )}
          {!uploading && image !== null && (
            <>
              <Button title="UPLOAD" onPress={handleUpload} />
              <Button title="CANCEL" onPress={() => setImage(null)} />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const iconSize = 28;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    backgroundColor: "grey",
  },
  icon: {
    position: "absolute",
    bottom: 150 - iconSize,
    left: 200 - iconSize,
  },
});
