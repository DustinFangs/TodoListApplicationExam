import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useTodos} from './TodoContext';

const ListOverview: React.FC<{navigation: any}> = ({navigation}) => {
  const {lists, addList, updateList} = useTodos();
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 8;

  const handleAddOrUpdateList = () => {
    if (editingListId) {
      updateList(editingListId, input); 
      setEditingListId(null); 
    } else if (input.trim() !== '') {
      const newList = {
        id: Date.now().toString(),
        title: input,
        todos: [],
      };
      addList(newList);
    }
    setInput('');
  };

  const handleEditList = (id: string, title: string) => {
    setEditingListId(id);
    setInput(title);
  };

  const filteredLists = lists.filter(list =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredLists.length / itemsPerPage);

  const paginatedLists = filteredLists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.listItem}>
      <Text style={styles.listText}>{item.title}</Text>
      <View style={styles.buttonGroup}>
        <Button
          title="Edit"
          onPress={() => handleEditList(item.id, item.title)}
        />
        <Button
          title="View Todos"
          onPress={() => navigation.navigate('TodoList', {listId: item.id})}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Todo Lists</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a list"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Title or Name"
        value={input}
        onChangeText={setInput}
      />
      <Button
        title={editingListId ? 'Update List' : 'Add List'}
        onPress={handleAddOrUpdateList}
      />

      <FlatList
        data={paginatedLists}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      <View style={styles.paginationContainer}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </View>
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
  list: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  pageInfo: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ListOverview;
