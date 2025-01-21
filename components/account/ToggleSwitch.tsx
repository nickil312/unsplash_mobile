import {Button, Pressable, SectionList, Text, TouchableOpacity, TouchableWithoutFeedback,StyleSheet, useColorScheme, View} from "react-native";

import {AccountLikes} from "../Pages/AccountLikes";
import {AccountCollections} from "../Pages/AccountCollections";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {logout} from "@/globalRedux/users/slice";
import AccountPhotos from "@/components/account/AccountPhotos";


export default function ToggleSwitch () {
    const {api_url, data} = useSelector((state: RootState) => state.users);

    const [userLogIn, setUserLogIn] = useState(false)
    useEffect(() => {
        if (data !== null){
            setUserLogIn(true)
        }
    },[data])
    const {t} = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const currentTheme = useColorScheme()
    const [changeThemes, setChangeThemes] = useState("Photos")



    const OnClickLogout = async () => {
        dispatch(logout());
        await SecureStore.deleteItemAsync('token')
    }

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: '10%',
            marginLeft: '10%',
        },
        chan: {
            marginTop: 5,
            borderBottomWidth: 2,
            borderBottomColor: 'grey',
            borderStyle: 'solid',
            // fontSize:14,
            // width: 'fit-content',
            // flex: 1, // Это позволит кнопкам занимать равное пространство
            alignItems: 'center', // Центрируем кнопку по горизонтали
        },
    });

    return (
        <>
            <View className="flex flex-row items-center justify-between w-full  ">
                <View style={styles.container}>
                    <View style={styles.chan}>
                        <Button
                            color={currentTheme === "dark" ? 'white' : "black"}
                            title={t('Photos')}
                            onPress={() => setChangeThemes("Photos")}
                        />
                    </View>
                    <View style={styles.chan}>
                        <Button
                            color={currentTheme === "dark" ? 'white' : "black"}
                            title={t('Likes')}
                            onPress={() => setChangeThemes("Likes")}
                        />
                    </View>
                    <View style={styles.chan}>
                        <Button
                            color={currentTheme === "dark" ? 'white' : "black"}
                            title={t('Collections')}
                            onPress={() => setChangeThemes("Collections")}
                        />
                    </View>
                </View>
            </View>
            <View className={"color-red-500 mt-4"}>
                <Button color="red" title={t('Logout')} onPress={() => OnClickLogout()}/>
            </View>

            {
                changeThemes === "Photos" ?
                    <AccountPhotos id={"123123"}/> : changeThemes === "Likes" ?
                        <Text>Likes</Text> : changeThemes === "Collections" ? <Text>Collections</Text> :
                            <Text>Ошибка</Text>
            }
        </>)

}

