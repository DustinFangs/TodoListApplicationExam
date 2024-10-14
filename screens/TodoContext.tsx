import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  title: string;
  date: string;
}

interface TodoList {
  id: string;
  title: string;
  todos: Todo[];
}

interface TodoContextType {
  lists: TodoList[];
  addList: (list: TodoList) => void;
  updateList: (id: string, title: string) => void;
  deleteList: (id: string) => void;
  addTodo: (listId: string, todo: Todo) => void;
  updateTodo: (listId: string, id: string, title: string) => void;
  deleteTodo: (listId: string, id: string) => void;

}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [lists, setLists] = useState<TodoList[]>([]);
  useEffect(() => {
    const fetchLists = async () => {
      const storedLists = await AsyncStorage.getItem('todoLists');
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    };
    fetchLists();
  }, []);

  const saveLists = async (lists: TodoList[]) => {
    await AsyncStorage.setItem('todoLists', JSON.stringify(lists));
  };

  const addList = async (list: TodoList) => {
    const updatedLists = [...lists, list];
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  const updateList = async (id: string, title: string) => {
    const updatedLists = lists.map(list =>
      list.id === id ? {...list, title} : list,
    );
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  const deleteList = async (id: string) => {
    const updatedLists = lists.filter(list => list.id !== id);
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  const addTodo = async (listId: string, todo: Todo) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {...list, todos: [...list.todos, todo]};
      }
      return list;
    });
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  const updateTodo = async (listId: string, id: string, title: string) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          todos: list.todos.map(todo =>
            todo.id === id ? {...todo, title} : todo,
          ),
        };
      }
      return list;
    });
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  const deleteTodo = async (listId: string, id: string) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return {...list, todos: list.todos.filter(todo => todo.id !== id)};
      }
      return list;
    });
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  return (
    <TodoContext.Provider
      value={{
        lists,
        addList,
        updateList,
        deleteList,
        addTodo,
        updateTodo,
        deleteTodo,
      }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
