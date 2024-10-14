import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {useTodos} from './TodoContext';

const TodoList: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const {lists, addTodo, updateTodo, deleteTodo} = useTodos();
  const [input, setInput] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);
  const listId = route.params.listId;

  const currentList = lists.find(list => list.id === listId);

  useEffect(() => {
    if (route.params?.todo) {
      const {todo} = route.params;
      setInput(todo.title);
      setCurrentTodoId(todo.id);
      setEditMode(true);
    }
  }, [route.params]);

  const addOrUpdateTodo = () => {
    if (editMode && currentTodoId) {
      updateTodo(listId, currentTodoId, input);
      setEditMode(false);
      setCurrentTodoId(null);
    } else if (input.trim() !== '') {
      const newTodo = {
        id: Date.now().toString(),
        title: input,
        date: new Date().toLocaleDateString(),
      };
      addTodo(listId, newTodo);
    } else {
      Alert.alert('Input Error', 'Please enter a valid todo');
    }
    setInput('');
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.todoItem}>
      <Text style={styles.todoText}>{item.title}</Text>
      <View style={styles.buttonGroup}>
        <Button
          title="Edit"
          onPress={() => {
            setInput(item.title);
            setCurrentTodoId(item.id);
            setEditMode(true);
          }}
        />
        <Button
          title="Delete"
          onPress={() => deleteTodo(listId, item.id)}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentList?.title} Todos</Text>
      <TextInput
        style={styles.input}
        placeholder="Todo title"
        value={input}
        onChangeText={setInput}
      />
      <Button
        title={editMode ? 'Update Todo' : 'Add Todo'}
        onPress={addOrUpdateTodo}
      />
      <FlatList
        data={currentList?.todos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.todoList}
      />
      <Button title="Back to Lists" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#282c34',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#61dafb',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  todoList: {
    width: '100%',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TodoList;
