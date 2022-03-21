import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./components/Header";
import Input from "./components/Input";
import Todo from "./components/Todo";
import { FlatList } from "react-native";

export default function App() {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (newTodo) => {
    const tmpTodoList = [...todoList];
    tmpTodoList.push(newTodo);
    setTodoList(tmpTodoList);
  };

  const deleteTodo = (indexTodo) => {
    const tmpTodoList = [...todoList];
    tmpTodoList.splice(indexTodo, 1);
    setTodoList(tmpTodoList);
  };

  const getTodos = () => {
    AsyncStorage.getItem("todoList").then((jsonTodoList) => {
      const todos = JSON.parse(jsonTodoList || "[]");
      setTodoList(todos);
    });
  };

  const saveTodo = () => {
    AsyncStorage.setItem("todoList", JSON.stringify(todoList))
      .then(() => {
        console.log("Save OK !");
      })
      .catch((err) => {
        console.log("ERROR !! " + err.message);
      });
  };

  const updateTodoDone = (indexTodo) => {
    const tmpTodoList = [...todoList];
    tmpTodoList[indexTodo].done = !tmpTodoList[indexTodo].done;
    setTodoList(tmpTodoList);
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    saveTodo();
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header></Header>
      </View>
      <View>
        <Input addTodo={addTodo}></Input>
      </View>
      <View style={styles.todolistContainer}>
        <FlatList
          data={todoList}
          renderItem={({ item, index }) => (
            <Todo
              nameTodo={item.name}
              todoDone={item.done}
              indexTodo={index}
              deleteTodo={deleteTodo}
              updateTodoDone={updateTodoDone}
            ></Todo>
          )}
        ></FlatList>
      </View>
      <StatusBar hidden={true} style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    flex: 1,
    backgroundColor: "#0074D9",
  },
  inputContainer: {
    flex: 2,
  },
  todolistContainer: {
    flex: 5,
    backgroundColor: "#AAAAAA",
  },
});
