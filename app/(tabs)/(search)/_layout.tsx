import {useColorScheme} from "@/components/useColorScheme";
import {useTranslation} from "react-i18next";
import React from "react";
import {Stack} from "expo-router";

export default function SearchLayout() {
    const colorScheme = useColorScheme();
    const {t} = useTranslation();

    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{
                              title: `${t('Search')}`,
                          }}
            />
            <Stack.Screen name="category/[category]" options={{
                title: `${t('Category')}`,
            }}/>
            <Stack.Screen name="search/[text]" options={{
                title: `${t('Search')}`,
            }}/>
            <Stack.Screen name="users/[id]" options={{
                title: `${t('Profile')}`,
            }}/>
        </Stack>
    )
}