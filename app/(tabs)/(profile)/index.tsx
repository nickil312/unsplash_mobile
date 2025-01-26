import {Button, RefreshControl, ScrollView, StyleSheet} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import {Text, View} from '@/components/Themed';
import {Link, Redirect, router} from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {logout} from "@/globalRedux/users/slice";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import {fetchAuthMe} from "@/globalRedux/users/asyncActions";
import {AccountSkeleton} from "@/components/account/AccountSkeleton";
import {CircleImage} from "@/components/account/CircleImage";
import ToggleSwitch from "@/components/account/ToggleSwitch";
import {useColorScheme} from "@/components/useColorScheme";

interface City {
    id: string;
    label: { en: string; ru: string };
}

export const work: City[] = [
    {
        id: 'Wedding',
        label: {en: 'Wedding', ru: 'Свадьба'},

    },
    {
        id: 'Food',
        label: {en: 'Food', ru: 'Еда'},

    },
    {
        id: 'Product',
        label: {en: 'Product', ru: 'Товар'},

    },
    {
        id: 'Lifestyle',
        label: {en: 'Lifestyle', ru: 'Стиль жизни'},

    },
    {
        id: 'Portrait',
        label: {en: 'Portrait', ru: 'Портрет'},

    },
    {
        id: 'Boudoir',
        label: {en: 'Boudoir', ru: 'Будуар'},

    },
    {
        id: 'Real_Estate',
        label: {en: 'Real Estate', ru: 'Недвиж.'},

    },
    {
        id: 'Marketing_&_Social Media',
        label: {en: 'Marketing & Social Media', ru: 'Маркетинг и соц. сети'},

    },
    {
        id: 'Newborn',
        label: {en: 'Newborn', ru: 'Дети'},
    },
    {
        id: 'Fashion',
        label: {en: 'Fashion', ru: 'Мода'},
    },
    {
        id: 'Event',
        label: {en: 'Event', ru: 'Событие'},
    },
    {
        id: 'Travel',
        label: {en: 'Travel', ru: 'Путеш.'},
    },

]
export const Cities: City[] = [
    {
        id: 'New_York_City',
        label: {en: 'New York City, USA', ru: 'Нью Йорк, США'},

    },
    {
        id: 'San_Francisco',
        label: {en: 'San Francisco, USA', ru: 'Сан Франциско, США'},

    },
    {
        id: 'Montreal',
        label: {en: 'Montreal, Canada', ru: 'Монреаль, Канада'},

    },
    {
        id: 'Paris',
        label: {en: 'Paris, France', ru: 'Париж, Франция'},

    },
    {
        id: 'Los_Angeles',
        label: {en: 'Los Angeles, USA', ru: 'Лос Анджелес, США'},

    },
    {
        id: 'Boston',
        label: {en: 'Boston, USA', ru: 'Бостон, США'},

    },
    {
        id: 'Vancouver',
        label: {en: 'Vancouver, Canada', ru: 'Ванкувер, Канада'},

    },
    {
        id: 'Berlin',
        label: {en: 'Berlin, Germany', ru: 'Берлин, Германия'},

    },
    {
        id: 'Chicago',
        label: {en: 'Chicago, USA', ru: 'Чикаго, США'},

    },
    {
        id: 'Toronto',
        label: {en: 'Toronto, Canada', ru: 'Торонто, Канада'},

    },
    {
        id: 'London',
        label: {en: 'London, UK', ru: 'Лондон, НК'},

    },
    {
        id: 'Tokyo',
        label: {en: 'Tokyo, Japan', ru: 'Токио, Япония'},

    }
];
import i18next from "@/i18n";

export default function TabOneScreen() {
    const {api_url, data} = useSelector((state: RootState) => state.users);
    // console.log(data)
    const dispatch = useDispatch<AppDispatch>(); // Вызов функции через переменную
    const {t} = useTranslation(); // Вызов функции перевода текста

    const [userLogIn, setUserLogIn] = useState(false)
    // const isLoadingAccount = status === 'loading'
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadingData, setIsLoadingData] = useState(false)


    const currentTheme = useColorScheme();

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "row",
            backgroundColor: currentTheme === 'dark' ? 'black' : '#F2F2F2',
            height: 150,
        },
        datacontainer: {
            display: "flex",
            flexDirection: "column",
            backgroundColor: currentTheme === 'dark' ? 'black' : '#F2F2F2',
            width: "60%",
            padding: 4,
            paddingLeft: 8,
            gap: 4
        },
        data: {
            backgroundColor: currentTheme === 'dark' ? 'black' : '#F2F2F2',
        },
        dataCitiesWork: {
            backgroundColor: currentTheme === 'dark' ? 'black' : '#F2F2F2',
            padding: 8,
        },
        mainContainer: {
            display: "flex",
            flexDirection: "column",
        },
        hireButton: {
            backgroundColor: "blue",
            padding: 4,
            color: "white",
        }
    });

    const OnClickLogout = async () => {
        dispatch(logout());
        // await SecureStore.deleteItemAsync('token')
        router.replace('/(tabs)/(profile)/login')
    }

    useEffect(() => {
        // console.log("language t",t)
        // console.log("i18next t",i18next.language)

        if (data !== null) {
            setUserLogIn(true)
        } else {
            setUserLogIn(false)
        }
    }, [data])

    const onRefresh = useCallback(async () => {
        setIsLoading(true);
        setTimeout(async () => {
            dispatch(fetchAuthMe())
            setUserLogIn(true)

            setIsLoading(false);
        }, 2000);
    }, []);

    if (data === null && SecureStore.getItemAsync('token') === null) {
        return <Redirect href="/(tabs)/(profile)/login"/>;
    } else {
        return (
            <ScrollView refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>
            }>
                {

                    isLoadingData === true ? (
                        <>

                            <View style={{backgroundColor: "", height: 200}}>
                                {/*<AccountSkeleton style={{marginLeft: 15, marginTop: 15}}/>*/}
                                <Text>asdasd</Text>

                            </View>
                            {/*<ToggleSwitch />*/}
                        </>


                    ) : (
                        userLogIn === true && data !== null ? (
                            <>
                                <View style={styles.mainContainer}>


                                    {/*backgroundColor: "#F2F2F2"*/}
                                    <View style={styles.container}>
                                        <CircleImage img={data.avatarurl} api_url={api_url}/>
                                        <View style={styles.datacontainer}>
                                            <Text
                                                className={"ml-4 mt-4 dark:color-white color-black"}>{data.fullname}</Text>
                                            {

                                                ((data.location !== null) && data.location) && (
                                                    <View className={"ml-4 mt-4 dark:color-white color-black"}
                                                          style={styles.data}>
                                                        <Text>
                                                            {data.location}
                                                        </Text>
                                                    </View>
                                                )

                                            }
                                            {
                                                ((data.hirevalue !== null) && data.hirevalue) && (
                                                    <View className={"ml-4 mt-4 dark:color-white color-black"}
                                                          style={styles.data}>
                                                        <Text>
                                                            Available for hire
                                                        </Text>
                                                    </View>
                                                )
                                            }

                                            {/*{*/}
                                            {/*    ((data.hirevalue !== null) && data.hirevalue) && (*/}
                                            {/*        // style={styles.hireButton}*/}
                                            {/*        <View className={"w-full bg-blue-200"}>*/}
                                            {/*            <Text>*/}
                                            {/*                Hire*/}
                                            {/*            </Text>*/}
                                            {/*        </View>*/}

                                            {/*    )*/}
                                            {/*}*/}
                                        </View>

                                    </View>
                                    {

                                        data.cities !== null ? (
                                            <View style={styles.dataCitiesWork}>

                                                <Text className={"ml-4 dark:color-white color-black"}>

                                                    {data.cities.map((cityId) => {
                                                        const matchingCity = Cities.find((city) => city.id === cityId);
                                                        return matchingCity ? (i18next.language === 'en' ? matchingCity.label.en : matchingCity.label.ru) : cityId;
                                                    }).join(', ')}

                                                </Text>
                                            </View>
                                        ) : (
                                            <></>
                                        )

                                    }
                                    {

                                        data.work !== null ? (
                                            <View style={styles.dataCitiesWork}>

                                                <Text className={"ml-4 dark:color-white color-black"}>

                                                    {data.work.map((cityId) => {
                                                        const matchingCity = work.find((city) => city.id === cityId);
                                                        return matchingCity ? (i18next.language === 'en' ? matchingCity.label.en : matchingCity.label.ru) : cityId;
                                                    }).join(', ')}

                                                </Text>
                                            </View>
                                        ) : (
                                            <></>
                                        )

                                    }
                                    {
                                        ((data.bio !== null) && data.bio) && (
                                            <View style={styles.dataCitiesWork}>

                                                <View className={"ml-4 mt-4 dark:color-white color-black"}
                                                      style={styles.data}>
                                                    <Text>
                                                        {
                                                            data.bio
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    }

                                </View>
                                <ToggleSwitch/>
                                {/*<View style={styles.container}>*/}

                                {/*    <Text style={styles.title}>Profile index</Text>*/}
                                {/*    <Link href="/register">register</Link>*/}
                                {/*    <Link href="/login">login</Link>*/}
                                {/*    <Text>{data.fullname}</Text>*/}
                                {/*    <Link href="/(tabs)/(profile)/details/1">View details - 1</Link>*/}

                                {/*    <Button color="red" title={t('Logout')} onPress={() => OnClickLogout()}/>*/}
                                {/*    <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>*/}
                                {/*    /!*<EditScreenInfo path="app/(tabs)/index.tsx" />*!/*/}
                                {/*</View>*/}
                            </>


                        ) : (
                            <Text>нет инетп(сервера)</Text>
                            // <Redirect href="/(tabs)/(profile)/login"/>
                            // <Regist navigation={navigation}/>
                        )
                    )
                }


            </ScrollView>

        );
    }
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
