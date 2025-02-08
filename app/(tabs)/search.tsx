import {StyleSheet, TextInput} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/globalRedux/store";
import {clearUsersWithSearchCount} from "@/globalRedux/users/slice";
import {fetchAllPostsWithSearch} from "@/globalRedux/posts/asyncActions";

export default function SearchScreen() {
  const [value, setValue] = useState(''); // Состояние для хранения значения ввода
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = () => {
    dispatch(clearUsersWithSearchCount());
    dispatch(fetchAllPostsWithSearch({
      searchtext: value, // Используем значение из состояния
      page: 0,
      role_id: 0,
      category: "",
      posttype: "photos",
      orientation: null,
      license: null,
      limit: null,
      sort: null
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput placeholder="search test"
                 value={value} // Привязываем значение поля ввода к состоянию
                 onChangeText={setValue} // Обновляем состояние при изменении текста
                 onSubmitEditing={handleSearch} // Вызываем функцию поиска при отправке
                 style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }} // Пример стилей

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
