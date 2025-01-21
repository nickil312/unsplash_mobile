import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, router, Tabs} from 'expo-router';
import {Pressable} from 'react-native';
import {Entypo, Ionicons} from "@expo/vector-icons";

import Colors from '@/constants/Colors';
import {useColorScheme} from '@/components/useColorScheme';
import {useClientOnlyValue} from '@/components/useClientOnlyValue';
import {useTranslation} from "react-i18next";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const {t} = useTranslation();

    return (
        <Tabs
            screenOptions={({route}) => ({
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: useClientOnlyValue(false, false),
                tabBarActiveTintColor: colorScheme === "dark" ? 'white' : "black",
                tabBarInactiveTintColor: 'gray',
            })}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: `${t('Home')}`,
                    tabBarIcon: ({color}) => <Ionicons name="image" size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({color}) => <Ionicons name="search" size={25} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({color}) => <Ionicons name="person-circle-outline" size={25} color={color}/>,
                }}
            />
        </Tabs>
    );
}