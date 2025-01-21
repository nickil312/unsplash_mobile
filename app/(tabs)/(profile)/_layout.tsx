import {Link, Stack} from 'expo-router';
import {Pressable} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import React from "react";
import {useColorScheme} from "@/components/useColorScheme";
import {useTranslation} from "react-i18next";

export default function ProfileLayout() {
    const colorScheme = useColorScheme();
    const {t} = useTranslation();

    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{
                              title: 'Profile',
                              headerRight: () => (
                                  <Link href="/modal" asChild>
                                      <Pressable>
                                          {({ pressed }) => (
                                              <FontAwesome
                                                  name="info-circle"
                                                  size={25}
                                                  color={Colors[colorScheme ?? 'light'].text}
                                                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                              />
                                          )}
                                      </Pressable>
                                  </Link>
                              )
                          }}
            />
            <Stack.Screen name="register" options={{
                title: 'Register',
            }}/>
            <Stack.Screen name="login" options={{
                title: `${t('Authtorization')}`,
            }}/>
        </Stack>
    );
}
