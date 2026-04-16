import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();


//question data
//Question 1: "4" 
//Question 2: "Red" and "Yellow"
//Question 3: "True"
const DATA = [
 {
  prompt: "What is 2 + 2?",
  type: "multiple-choice",
  choices: ["1", "2", "3", "4"],
  correct: 3,
 },
 {
  prompt: "What colors make orange?",
  type: "multiple-answer",
  choices: ["Red", "Blue", "Yellow"],
  correct: [0, 2],
 },
 {
  prompt: "Does todays day of the week end in the letter y?",
  type: "true-false",
  choices: ["True", "False"],
  correct: 0,
 },
];


//question pages
function Question({ navigation, route, }) {
 const { data, index, score } = route.params;
 const question = data[index];
 const [selected, setSelected] = useState(
  question.type === "multiple-answer" ? [] : null
 );
 const handleSelect = (i) => {
  if (question.type === "multiple-answer") {
   if (selected.includes(i)) {
    setSelected(selected.filter((x) => x !== i));
    } else {
     setSelected([...selected, i]);
    }
  } else {
   setSelected(i);
  };
 }

 const questionType = () => {
  if (question.type === "multiple-answer") {
   if(!Array.isArray(selected)) return false;
   return (
    selected.length === question.correct.length &&
    selected.every((val) => question.correct.includes(val))
   );
  }
  return selected === question.correct;
 };


 //next button
 const handleNext = () => {
  const isCorrect = questionType();
  const newScore = isCorrect ? score + 1 : score;


  //correct tracker
  const results = route.params.results || [];
  const updatedResults = [
    ...results,
    { index, correct: isCorrect },
  ];


  //page navigator + score tracker
  if (index + 1 < data.length) {
   navigation.push("Question", {
    data,
    index: index + 1,
    score: newScore,
    results: updatedResults,
   });
  } else {
   navigation.navigate("Summary", {
    score: newScore,
    total: data.length,
    results: updatedResults,
   });
  }
 };
 

 //question interaction
 return (
  <View style={styles.container}>
   <Text style={styles.prompt}>{question.prompt}</Text>

   {question.choices.map((choice, i) => {
    const isSelected = Array.isArray(selected)
     ? selected.includes(i)
     : selected === i;
    return (
     <Pressable style={[
       styles.choice,
       isSelected && styles.selectedChoice,]}
      key={i}
      onPress={() => handleSelect(i)}
     >
      <Text style={styles.choices}>{choice}</Text>
     </Pressable>
    );
   })}  
   
   <Button 
    title="Next Question"
    onPress={handleNext}
    disabled={
     question.type === "multiple-answer"
     ? selected.length === 0
     : selected === null
    }
   />
  </View>
 );
}


//summary page
function Summary({ route }) {
 const { score, total, results } = route.params;

 let message = ""
 
 if (score ===3) {
 message = "Good Job!";
 } else {
 message = "Try Again";
 }
 
 return (
  <View>
   <Text style={styles.summaryH}>Your Score:</Text>
   <Text style={styles.summaryS}>{score} / {total}</Text>
   <Text style={styles.summaryP}>{message}</Text>
   <View>
    {results.map((r, i) => (
     <Text key={i} style={styles.summaryR}>
      Question {r.index + 1}: {r.correct ? "Correct" : "Wrong"}
     </Text>
    ))}
   </View>
  </View>
 );
}


//interactable content
export default function App() {
 return (
  <NavigationContainer>
   <Stack.Navigator>

    <Stack.Screen
     name="Question"
     component={Question}
     initialParams={{ data: DATA, index: 0, score: 0, results: [] }}
    />

    <Stack.Screen 
     name="Summary" 
     component={Summary}
    />

   </Stack.Navigator>
  </NavigationContainer>
 );
}


//stylesheet
const styles = StyleSheet.create({
 container: {
  padding: 20,
 },

 prompt: {
  fontSize: 30,
  marginBottom: 20,
 },

 choices: {
  fontSize: 20,
 },

 choice: {
  padding: 10,
  borderWidth: 3,
  borderColor: "#838383",
  borderRadius: 10,
  marginBottom: 10,
  backgroundColor: "white",
 },

 selectedChoice: {
  backgroundColor: "#afdcef",
 },

 summaryH: {
  fontSize: 50,
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'center',
 },

 summaryP: {
  fontSize: 25,
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 25,
 },

 summaryR: {
  fontSize: 20,
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 5,
 },

 summaryS: {
  fontSize: 25,
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 0,
 }
});