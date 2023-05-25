import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera'
import { styles } from './style';
import * as FaceDetector from 'expo-face-detector'
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Audio } from 'expo-av';


export function Home() {
  const [faceDetected, setFaceDetected] = useState(false)
  const [permission, requesPermission] = Camera.useCameraPermissions()
  const [message , setMessage] = useState('')


  const playAlertSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alerta.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Erro ao reproduzir o alerta sonoro:', error);
    }
  };


  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })

  function handleFacesDetected({ faces }: FaceDetectionResult) {
    const face = faces[0] as any

    if (face) {
      setFaceDetected(true)
      const { size, origin } = face.bounds

      const mouthOpening = face.mouthOpenProbability;
      //  console.log(face)

      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y
      }
      setFaceDetected(true)

      if (face.smilingProbability > 0.5) {
        setMessage('sorrindo!!😀')
      }
      else if (face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability < 0.5) {
        setMessage('piscando!!😉')
      }
      else if (face.leftEyeOpenProbability < 0.2 && face.rightEyeOpenProbability < 0.2) {
        setMessage('cochilando!!😴')
        playAlertSound()
      }
      else {
        setMessage('serio!!😐')
      }
    }
    else {
      setFaceDetected(false)
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX: faceValues.value.x },
      { translateY: faceValues.value.y },
    ],
    borderColor: 'blue',
    borderWidth: 6
  }))

  useEffect(() => {
    requesPermission();
  }, [])

  if (!permission?.granted) {
    return;
  }

  return (
    <View style={styles.container}>
      {
        faceDetected &&
        <Animated.View style={animatedStyle} />
      }
      <Camera
        style={styles.camera}
        type={CameraType.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />

      <Text style={styles.title} >DETECTOR DE FACE</Text>

        <Text style={styles.smilinText}>Você esta {message} </Text>
      
    </View>
  );
}


