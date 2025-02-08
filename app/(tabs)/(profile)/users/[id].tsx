import {ScrollView, StyleSheet, Text} from "react-native";
import {Link, useLocalSearchParams} from "expo-router";
import React, {useEffect} from "react";
import {useColorScheme} from "@/components/useColorScheme";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useTranslation} from "react-i18next";
import {fetchGetUserDataAndDataAnotherUser} from "@/globalRedux/users/asyncActions";
import {Status} from "@/globalRedux/posts/types";
import {View} from "@/components/Themed";
import {CircleImage} from "@/components/account/CircleImage";
import i18next from "@/i18n";
import ToggleSwitch from "@/components/account/ToggleSwitch";
import {Cities, work} from "@/app/(tabs)/(profile)";
import ToggleView from "@/components/account/ToggleView";

export default function PostDetail(){
    const {api_url} = useSelector((state: RootState) => state.users);
    // const {items, status} = useSelector((state: RootState) => state.posts.posts_another_user);
    const {items, status} = useSelector((state: RootState) => state.users.data_another_user);

    const dispatch = useDispatch<AppDispatch>(); // Вызов функции через переменную
    const {t} = useTranslation(); // Вызов функции перевода текста

    const { id } = useLocalSearchParams();
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
            paddingLeft: 16,
            gap: 4,
            top:15
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
    useEffect(() => {

        dispatch(fetchGetUserDataAndDataAnotherUser({
            _id: id
        }))

    }, [])
    return(
        <ScrollView>
            {
                status === Status.LOADING ? (
                    <Text>loading</Text>
                ) : (
                    items !== null ? (


                    <>
                        <View style={styles.mainContainer}>


                            {/*backgroundColor: "#F2F2F2"*/}
                            <View style={styles.container}>
                                <CircleImage img={items.avatarurl} api_url={api_url}/>
                                <View style={styles.datacontainer}>
                                    <Text
                                        className={"ml-4 mt-4 dark:color-white color-black"}>{items.fullname}</Text>
                                    {

                                        ((items.location !== null) && items.location) && (
                                            <View className={"ml-4 mt-4 dark:color-white color-black"}
                                                  style={styles.data}>
                                                <Text>
                                                    {items.location}
                                                </Text>
                                            </View>
                                        )

                                    }
                                    {
                                        ((items.hirevalue !== null) && items.hirevalue) && (
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

                                items.hirevalue && items.cities !== null ? (
                                    <View style={styles.dataCitiesWork}>

                                        <Text className={"ml-4 dark:color-white color-black"}>

                                            {items.cities.map((cityId) => {
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

                                items.hirevalue && items.work !== null ? (
                                    <View style={styles.dataCitiesWork}>

                                        <Text className={"ml-4 dark:color-white color-black"}>

                                            {items.work.map((cityId) => {
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
                                ((items.bio !== null) && items.bio) && (
                                    <View style={styles.dataCitiesWork}>

                                        <View className={"ml-4 mt-4 dark:color-white color-black"}
                                              style={styles.data}>
                                            <Text>
                                                {
                                                    items.bio
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                )
                            }

                        </View>
                        <ToggleView/>

                    </>
                    ) : (
                        <Text>Danni net idi v popu</Text>
                    )
                )
            }
        {/*<Text>*/}
        {/*    Detail - {id}*/}
        {/*</Text>*/}
        {/*    <Link href="/details/1">View details - 1</Link>*/}
        {/*    <Link href="/details/2">View details - 2</Link>*/}

        </ScrollView>
    )
}