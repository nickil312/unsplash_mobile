import {Button, ScrollView, StyleSheet, Text, useColorScheme, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import AccountPhotos from "@/components/account/AccountPhotos";
import AccountLikes from "@/components/account/AccountLikes";
import {AccountCollections} from "@/components/account/AccountCollections";
import {useLocalSearchParams} from "expo-router";
import AccountPhotosView from "@/components/account/anotherUserProf/AccountPhotosView";
import AccountLikesView from "@/components/account/anotherUserProf/AccountLikesView";
import {AccountCollectionsView} from "@/components/account/anotherUserProf/AccountCollectionsView";

export default function ToggleView(){
    const { id } = useLocalSearchParams();

    const {items, status} = useSelector((state: RootState) => state.posts.posts_another_user);
    const dispatch = useDispatch<AppDispatch>();
    const currentTheme = useColorScheme()
    const [changeThemes, setChangeThemes] = useState("Photos")
    const {t} = useTranslation();
    console.log("toggle view id ",id)
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


    return(
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
            <View style={{marginTop:10}}></View>
            {
                changeThemes === "Photos" ?
                    <AccountPhotosView/> : changeThemes === "Likes" ?
                        <AccountLikesView/> : changeThemes === "Collections" ? <AccountCollectionsView/> :
                            <Text>Ошибка</Text>
            }
            {/*<Text>сделать отдельные компоненты для фото лайки и коллекции</Text>*/}
        </>
    )
}