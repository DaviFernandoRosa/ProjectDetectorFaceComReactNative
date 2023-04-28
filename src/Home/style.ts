import { StyleSheet } from "react-native";
import { color } from "react-native-reanimated";

export const styles = StyleSheet.create({
    container: {
      flexGrow: 1, 
    },
    camera: {
        flex: 1,
        
      },
      title: {
       fontSize: 20,
       textAlign: "center",
       fontStyle:"italic"
      },
      
      sleepyText: {
        fontSize: 20,
        textAlign: "center",
        fontStyle:"italic",
        color: 'red',
        padding: 40
       },
       
       smilinText: {
        fontSize: 20,
        textAlign: "center",
        fontStyle:"italic",
        color: 'green',
        padding: 40
       },
       
       flashingText: {
        fontSize: 20,
        textAlign: "center",
        fontStyle:"italic",
        color: 'blue',
        padding: 40
       },

       cryingText: {
        fontSize: 20,
        textAlign: "center",
        fontStyle:"italic",
        color: 'black',
        padding: 40
       },
       
       
  });