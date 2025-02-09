import {Link, Stack} from 'expo-router';
import {Pressable} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import React, {useEffect} from "react";
import {useColorScheme} from "@/components/useColorScheme";
import {useTranslation} from "react-i18next";
import {MaterialIcons} from "@expo/vector-icons";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthMe} from "@/globalRedux/users/asyncActions";
import * as SecureStore from "expo-secure-store";
import i18next from "../../../i18n";

export default function HomeLayout() {
    const colorScheme = useColorScheme();
    const {t} = useTranslation();
    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{

                              title: `${t('Home')}`,
                              headerRight: () => (
                                  <Link href="/modal" asChild>
                                      <Pressable>
                                          {({ pressed }) => (
                                              // <FontAwesome
                                              //     name="info-circle"
                                              //     size={25}
                                              //     color={Colors[colorScheme ?? 'light'].text}
                                              //     style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                              // />
                                              <MaterialIcons name="info-outline" size={24} color={colorScheme === "dark" ? 'white':"black"}/>
                                          )}
                                      </Pressable>
                                  </Link>
                              )
                          }}
                          />
            <Stack.Screen name="details/[id]" options={{
                title: `${t('Photo')}`,
            }}/>
            <Stack.Screen name="users/[id]" options={{
                title: `${t('Profile')}`,
            }}/>
            <Stack.Screen name="addtocollection/[id]" options={{
                title: `${t('Collections')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="details/statistics/[id]" options={{
                title: `${t('Photo')}`,
                // presentation: "modal"
            }}/>
        </Stack>
    );
}
