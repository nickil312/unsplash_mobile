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

export default function TabOneScreen() {
    const {api_url, data} = useSelector((state: RootState) => state.users);
  // console.log(data)
    const dispatch = useDispatch<AppDispatch>(); // Вызов функции через переменную
    const {t} = useTranslation(); // Вызов функции перевода текста

    const [userLogIn, setUserLogIn] = useState(false)
    // const isLoadingAccount = status === 'loading'
    const [isLoading, setIsLoading] = useState(false);

    const [isLoadingData, setIsLoadingData] = useState(false)
    const OnClickLogout = async () => {
        dispatch(logout());
        // await SecureStore.deleteItemAsync('token')
        router.replace('/(tabs)/(profile)/login')
    }

    useEffect(() => {
        if (data !== null){
            setUserLogIn(true)
        }
        else{
            setUserLogIn(false)
        }
    },[data])

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

                            <View style={{backgroundColor: "#808080", height: 200}}>
                                {/*<AccountSkeleton style={{marginLeft: 15, marginTop: 15}}/>*/}
                                <Text>asdasd</Text>

                            </View>
                            {/*<ToggleSwitch />*/}
                        </>


                    ) : (
                        userLogIn === true && data !== null ? (
                            <>

                                <View style={{backgroundColor: "#F2F2F2", height: 200}}>
                                    <CircleImage img={data.avatarurl} api_url={api_url}/>

                                    <Text className={"ml-4 mt-4 dark:color-white color-black"}>{data.fullname}</Text>
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
                            <Redirect href="/(tabs)/(profile)/login"/>
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
