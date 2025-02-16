import React, {useEffect} from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, router, Tabs} from 'expo-router';
import {Pressable} from 'react-native';
import {Entypo, Ionicons} from "@expo/vector-icons";

import Colors from '@/constants/Colors';
import {useColorScheme} from '@/components/useColorScheme';
import {useClientOnlyValue} from '@/components/useClientOnlyValue';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {fetchAuthMe} from "@/globalRedux/users/asyncActions";
import * as SecureStore from "expo-secure-store";
import i18next from "@/i18n";

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

    const dispatch = useDispatch<AppDispatch>();
    const {api_url, data} = useSelector((state: RootState) => state.users);

    useEffect( () => {
        // await dispatch(fetchAuthMe());
        // // if (data !== null) {
        //
        // const lang = await SecureStore.getItemAsync(`language`)
        // console.log(lang)
        // console.log(lang)
        // if (lang !== null) {
        //     i18next.changeLanguage(lang);
        // }
        // // }
        const fetchData = async () => {
            await dispatch(fetchAuthMe());

            // const lang = await SecureStore.getItemAsync('language');
            // console.log(lang);
            // if (lang !== null) {
            //     i18next.changeLanguage(lang);
            // }
        };

        fetchData();
    }, [])
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
                name="(search)"
                options={{
                    title: `${t('Search')}`,
                    tabBarIcon: ({color}) => <Ionicons name="search" size={25} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="(add)"
                options={{
                    title: `${t('Add')}`,
                    tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={25} color={color} />,
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    title: `${t('Profile')}`,
                    tabBarIcon: ({color}) => <Ionicons name="person-circle-outline" size={25} color={color}/>,
                }}
            />
        </Tabs>
    );
}