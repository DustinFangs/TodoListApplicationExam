import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SplashScreen: React.FC = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Dashboard');
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Todo List Application</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', 
  },
  text: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
