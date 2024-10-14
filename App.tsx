import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {TodoProvider} from './screens/TodoContext'; 
import TodoList from './screens/TodoList'; 
import ListOverview from './screens/ListOverview';


const Stack = createStackNavigator();
const App = () => {
  return (
    <TodoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ListOverview">
          <Stack.Screen name="ListOverview" component={ListOverview} />
          <Stack.Screen name="TodoList" component={TodoList} />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
};

export default App;
