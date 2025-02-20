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
            <Stack.Screen name="collectionsmodal/[id]" options={{
                title: `${t('Collections')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="addtocollection/[id]" options={{
                title: `${t('Collections')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="details/[id]" options={{
                title: `${t('Photo')}`,
            }}/>
            <Stack.Screen name="details/statistics/[id]" options={{
                title: `${t('Photo')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="details/update/[id]" options={{
                title: `${t('Photo')}`,
                // presentation: "modal"
            }}/>
            <Stack.Screen name="details/report/[id]" options={{
                title: `${t('Create Report')}`,
                presentation: "modal"
            }}/>
            <Stack.Screen name="details/ban/[id]" options={{
                title: `${t('Ban Post')}`,
                presentation: "modal"
            }}/>
        </Stack>
    )
}