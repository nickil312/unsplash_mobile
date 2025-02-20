import {
    Button,
    Pressable,
    SectionList,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    useColorScheme,
    View
} from "react-native";

import {AccountCollections} from "../account/AccountCollections";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {logout} from "@/globalRedux/users/slice";
import AccountPhotos from "@/components/account/AccountPhotos";
import AccountLikes from "@/components/account/AccountLikes";
import {useRouter} from "expo-router";


export default function ToggleSwitch() {
    const {api_url, data} = useSelector((state: RootState) => state.users);

    const [userLogIn, setUserLogIn] = useState(false)
    useEffect(() => {
        if (data !== null) {
            setUserLogIn(true)
        }
    }, [data])
    const {t} = useTranslation();

    const dispatch = useDispatch<AppDispatch>();
    const currentTheme = useColorScheme()
    const [changeThemes, setChangeThemes] = useState("Photos")
    const router = useRouter();

    const OnClickLogout = async () => {
        dispatch(logout());
        await SecureStore.deleteItemAsync('token')
        router.push('/(tabs)/(profile)/login')

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
        exit:{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }
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
            <View className={"color-red-500 mt-4"} style={styles.exit}>

                    <Button color="red" title={t('Logout')} onPress={() => OnClickLogout()}/>

            </View>

            {
                changeThemes === "Photos" ?
                    <AccountPhotos/> : changeThemes === "Likes" ?
                        <AccountLikes/> : changeThemes === "Collections" ? <AccountCollections/> :
                            <Text>Ошибка</Text>
            }
        </>)

}

