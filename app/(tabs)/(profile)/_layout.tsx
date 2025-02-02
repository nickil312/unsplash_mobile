import {Link, Stack} from 'expo-router';
import {Pressable} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import React from "react";
import {useColorScheme} from "@/components/useColorScheme";
import {useTranslation} from "react-i18next";
import {Ionicons} from "@expo/vector-icons";
import changePassword from "@/app/(tabs)/(profile)/changepassword";

export default function ProfileLayout() {
    const colorScheme = useColorScheme();
    const {t} = useTranslation();

    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{
                              title: `${t('Profile')}`,
                              headerRight: () => (
                                  <Link href="/(tabs)/(profile)/settings" asChild>
                                      <Pressable>
                                          {({ pressed }) => (
                                              <Ionicons name="settings-outline" style={{
                                              }} size={24} color={colorScheme === "dark" ? 'white' : "black"}/>
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
            <Stack.Screen name="details/[id]" options={{
                title: `${t('Photo')}`,
            }}/>
            <Stack.Screen name="users/[id]" options={{
                title: `${t('Profile')}`,
            }}/>
            <Stack.Screen name="settings" options={{
                title: `${t('Settings')}`,
            }}/>
            <Stack.Screen name="profilesettings" options={{
                title: `${t('Profile data')}`
            }}/>
            <Stack.Screen name="hire" options={{
                title: `${t('Hiring')}`
            }}/>
            <Stack.Screen name="downloadHistory" options={{
                title: `${t('DownloadHistory')}`
            }}/>
            <Stack.Screen name="collectionsmodal/[id]" options={{
                title: `${t('Collections')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="addtocollection/[id]" options={{
                title: `${t('Collections')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="changePassword" options={{
                title: `${t('Change Password')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="details/statistics/[id]" options={{
                title: `${t('Photo')}`,
                // presentation: "modal"
            }}/>

        </Stack>
    );
}
