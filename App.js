import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ButtonGroup } from "react-native-elements";

const Stack = createNativeStackNavigator();

/*
Correct Answers:
Q1: 0
Q2: [0,2]
Q3: 1
*/

const DATA = [
  {
    prompt: "This is the question...",
    type: "multiple-choice",
    choices: ["choice 1", "choice 2", "choice 3", "choice 4"],
    correct: 0,
  },
  {
    prompt: "This is another question...",
    type: "multiple-answer",
    choices: ["choice 1", "choice 2", "choice 3", "choice 4"],
    correct: [0, 2],
  },
  {
    prompt: "This is the third question...",
    type: "true-false",
    choices: ["True", "False"],
    correct: 1,
  },
];

export function Question({ navigation, route }) {
  const { data, index, answers } = route.params;
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
    }
  };

  const handleNext = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = selected;

    if (index + 1 < data.length) {
      navigation.push("Question", {
        data,
        index: index + 1,
        answers: updatedAnswers,
      });
    } else {
      navigation.replace("Summary", {
        data,
        answers: updatedAnswers,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <ButtonGroup
        testID="choices"
        vertical
        buttons={question.choices}
        onPress={handleSelect}
        selectedIndexes={
          question.type === "multiple-answer"
            ? selected
            : selected !== null
            ? [selected]
            : []
        }
      />

      <Button
        testID="next-question"
        title="Next Question"
        onPress={handleNext}
        disabled={
          selected === null ||
          (Array.isArray(selected) && selected.length === 0)
        }
      />
    </View>
  );
}

export function Summary({ route }) {
  const { data, answers } = route.params;

  let score = 0;

  const isCorrect = (q, userAnswer) => {
    if (Array.isArray(q.correct)) {
      return (
        Array.isArray(userAnswer) &&
        q.correct.length === userAnswer.length &&
        q.correct.every((c) => userAnswer.includes(c))
      );
    }
    return q.correct === userAnswer;
  };

  return (
    <ScrollView style={styles.container}>
      {data.map((q, i) => {
        const correct = isCorrect(q, answers[i]);
        if (correct) score++;

        return (
          <View key={i} style={styles.questionBlock}>
            <Text style={styles.prompt}>
              {q.prompt} ({correct ? "Correct" : "Incorrect"})
            </Text>

            {q.choices.map((choice, idx) => {
              const chosen = Array.isArray(answers[i])
                ? answers[i]?.includes(idx)
                : answers[i] === idx;

              const isAnswer = Array.isArray(q.correct)
                ? q.correct.includes(idx)
                : q.correct === idx;

              let style = {};

              if (chosen && isAnswer) {
                style = styles.bold;
              } else if (chosen && !isAnswer) {
                style = styles.strike;
              }

              return (
                <Text key={idx} style={style}>
                  {choice}
                </Text>
              );
            })}
          </View>
        );
      })}

      <Text testID="total" style={styles.total}>
        Total Score: {score}/{data.length}
      </Text>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Question">
          {(props) => (
            <Question
              {...props}
              route={{
                ...props.route,
                params: {
                  data: DATA,
                  index: 0,
                  answers: [],
                },
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Summary" component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  prompt: {
    fontSize: 18,
    marginBottom: 10,
  },
  questionBlock: {
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  strike: {
    textDecorationLine: "line-through",
  },
  total: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
});