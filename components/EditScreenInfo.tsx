import React, {useState} from 'react';
import {Button, StyleSheet, TextInput} from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';
import {useColorScheme} from "@/components/useColorScheme";
import {Appearance} from 'react-native';
import {useTranslation} from "react-i18next";
import i18next from '../i18n';
import * as SecureStore from 'expo-secure-store';
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/globalRedux/store";
import { clearUsersWithSearchCount } from '@/globalRedux/users/slice';
import {fetchAllPostsWithSearch} from "@/globalRedux/posts/asyncActions";
import {Link} from "expo-router";

export default function EditScreenInfo({ path }: { path: string }) {
  const colorScheme = Appearance.getColorScheme();
  // const setcolorScheme = Appearance.setColorScheme(colorScheme);
  // if (colorScheme === 'dark') {
  //   // Use dark color scheme
  // }
  const {t} = useTranslation();





  const changelng = async (lng:string) => {
    await i18next.changeLanguage(lng);
    await SecureStore.setItemAsync(`language`, lng);
    // console.log(`language_${data._id}`)
    // const lang = await SecureStore.getItemAsync(`language_${data._id}`)
    // console.log(`language_${data._id}`)
    console.log(lng)
  }
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
    <View>
      <View style={styles.getStartedContainer}>
        <TextInput placeholder="search test"
        value={value} // Привязываем значение поля ввода к состоянию
        onChangeText={setValue} // Обновляем состояние при изменении текста
        onSubmitEditing={handleSearch} // Вызываем функцию поиска при отправке
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }} // Пример стилей

        />
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Text>
        <Link href="/details/1">View details - 1</Link>
        <Link href="/details/2">View details - 2</Link>
        <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
          {colorScheme}
        </Text>
        <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
          {t('authTitle')}
        </Text>
        <Button color={colorScheme === "dark" ? 'white' : 'dark'} title={"rus"}
                onPress={() => changelng("rus")}/>
        <Button color={colorScheme === "dark" ? 'white' : 'dark'} title={"en"}
                onPress={() => changelng("en")}/>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor={Colors.dark.lightText}>
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
