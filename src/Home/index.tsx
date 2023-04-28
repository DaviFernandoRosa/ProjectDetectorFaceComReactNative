import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera'
import  { styles } from './style';
import * as FaceDetector from 'expo-face-detector'
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export  function Home() {
const [faceDetected, setFaceDetected]= useState(false)
const [permission, requesPermission] = Camera.useCameraPermissions()
const [sleepy, setSleepy] = useState(false);
const [smilin, setSmilin] = useState(false);
const [flashing, setFlashing] = useState(false)
const [crying, setCrying] = useState(false);

const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0
})

function handleFacesDetected({faces}: FaceDetectionResult){
    const face = faces[0] as any

    if(face){
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
            setSmilin(true);
            setSleepy(false)
            setFlashing(false)
            setCrying(false);
         }
         else if(face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability < 0.5){
            setFlashing(true)
            setSmilin(false);
            setSleepy(false)
            setCrying(false);
         }
         else if(face.leftEyeOpenProbability < 0.2 && face.rightEyeOpenProbability < 0.2){
            setCrying(true);
            setFlashing(false)
            setSmilin(false);
            setSleepy(false)
         }
         else{
             setSleepy(true)
             setSmilin(false);
             setFlashing(false)
             setCrying(false);
         }
         
         
    }
    else{
             setFaceDetected(false)
        }
}

const animatedStyle = useAnimatedStyle(()=> ({
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

useEffect(()=>{
  requesPermission();
},[])

if(!permission?.granted){
    return;
}

  return (
    <View style={styles.container}>
        {
          faceDetected &&
          <Animated.View style={animatedStyle}/> 
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
         
          {
           smilin &&
           <Text style={styles.smilinText}>Você esta sorrindo!!😀</Text>
          }

          {
           sleepy && 
           <Text style={styles.sleepyText}>Você esta serio.😐</Text>
          }

          {
           flashing &&    
           <Text style={styles.flashingText}>Você esta piscando.😉</Text>
          }

          {
           crying &&    
           <Text style={styles.cryingText}>Você esta dormindo.😴</Text>
          }

    </View>
  );
}


