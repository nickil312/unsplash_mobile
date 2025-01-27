import {ActivityIndicator, Alert, Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useColorScheme} from "@/components/useColorScheme";
import {CircleImage} from "@/components/account/CircleImage";
import {useTranslation} from "react-i18next";
import i18next from "../../../i18n";
import * as SecureStore from "expo-secure-store";
import {useState} from "react";
import {fetchChangeProfileImg} from "@/globalRedux/users/asyncActions";
import * as ImagePicker from "expo-image-picker";
import {Link} from "expo-router";

export default function Settings(){
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const currentTheme = useColorScheme();
    const {t} = useTranslation(); // Вызов функции перевода текста
    const [loading, setloading] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const [image, setImage] = useState(null);
    const [imageIsJussed, setImageIsJussed] = useState(null);

    const styles = StyleSheet.create({
        userCard: {
            backgroundColor: 'grey', // Цвет фона остается одинаковым для обоих тем
            flexDirection: 'column',
            marginLeft: 15,
            marginRight: 15,
            borderRadius: 8,
            height: 180,
            marginTop: 45,
            borderWidth: 3,
            borderColor: 'grey', // Цвет границы остается одинаковым для обоих тем
            borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center', // Используйте alignItems вместо justify-items
        },
        editProfileList: {
            marginTop: 30,
            marginLeft: 15,
            marginRight: 15,
            backgroundColor: 'grey', // Цвет фона остается одинаковым для обоих тем
            borderWidth: 3,
            borderColor: 'grey', // Цвет границы остается одинаковым для обоих тем
            borderRadius: 8,
        },
        editProfileText: {
            marginTop: 5,
            marginLeft: 10,
            fontSize: 18,
            color: currentTheme === "dark" ? "#FFF" : "#000", // Цвет текста в зависимости от темы
            marginBottom: 5,
        },
        editProfileView: {
            borderBottomRightRadius: 1,
            borderBottomLeftRadius: 1,
            // Вы можете добавить дополнительные стили для нижней границы, если это необходимо
        },
        container: {
            marginLeft: 15,
            marginTop: 15,
            width: 125,
            height: 125,
            borderRadius: 60,
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: '100%',
        },
    });
    const changelng = async (lng:string) => {
        i18next.changeLanguage(lng);
        await SecureStore.setItemAsync(`language`, lng);
        // console.log(`language_${data._id}`)
        // const lang = await SecureStore.getItemAsync(`language_${data._id}`)
        // console.log(`language_${data._id}`)
        // console.log(lang)
    }
    const ChangeImage = async () => {
        if(imageIsJussed) {
            if (data !== null) {

                setloading(true);
                // Alert.alert(1);

                const formData = new FormData();

                formData.append('image', {
                    uri: image[0].uri,
                    name: image[0].originalname,
                    type: 'image/jpeg'
                });
                const userToken = await SecureStore.getItemAsync('token');
                // console.log(userToken)
                const response = await fetch(`${api_url}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    body: formData
                });
                // Alert.alert(2);
                // console.log("sending fuick sdfsdfsd")
                const responseData = await response.json();
                // console.log(">?>?>?>?>>?>?>?>?>?>?>")
                // console.log(responseData)
                // console.log(">?>?>?>?>>?>?>?>?>?>?>")

                const datasend = {
                    email: data.email,
                    avatarurl: responseData.compressedUrl
                }
                // console.log("datasend",datasend)

                // Alert.alert(3);
                //
                // console.log(">?>?>?>?>>?>?>?>?>?>?>")
                // console.log(datasend)
                // console.log(">?>?>?>?>>?>?>?>?>?>?>")

                const res = await dispatch(fetchChangeProfileImg(datasend))
                // console.log(res)
                setloading(false);
                // Alert.alert(4);
            }
        }
        else{
            Alert.alert(t("ImageNotJused"),t("ChooseImageInCircle"))
        }
    }
    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {

            const big_im = result.assets

            // console.log(result)
            // console.log(big_im)
            const originalname = big_im[0].uri.substring(big_im[0].uri.lastIndexOf("/") + 1);
            big_im[0].originalname = `${originalname}`
            setImage(big_im);
            setImageIsJussed(true);
            // console.log("big_im",big_im)
        }
        else{
            setImageIsJussed(false);
        }
        // console.log(image[0].uri)

    };
    if (loading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',

            }}>
                <ActivityIndicator size="large"/>
                <Text style={{
                    color: currentTheme === "dark" ? "#FFF" : "#000",
                    marginTop: 15,
                }}>{t("Updating avatar image")}</Text>
            </View>
        )
    }
    return(
        <SafeAreaView style={{flex: 1}}>
            <ScrollView>


                <View>
                    {
                        data !== null ? (
                            <>
                                <View style={styles.userCard}>
                                    {/*{*/}
                                    {/*    data !== null ? (*/}
                                    <View onTouchEndCapture={() => pickImage()}>
                                        {
                                            image !== null ? (
                                                // <CircleImage img={image[0].uri}/>
                                                // <PostImage source={{uri: image[0].uri}}/>
                                                <View style={styles.container}>
                                                    <Image
                                                        style={styles.image}
                                                        source={{ uri: image[0].uri }}
                                                    />
                                                </View>

                                            ) : (
                                                <CircleImage img={data.avatarurl} api_url={api_url}/>
                                            )
                                        }
                                    </View>

                                    {/*    ) : (*/}
                                    {/*        <FontAwesome style={{*/}
                                    {/*            marginLeft: 145*/}
                                    {/*        }} name={currentTheme === "dark" ? 'user-circle-o' : "user-circle"} size={70}*/}
                                    {/*                     color="black"/>*/}
                                    {/*    )*/}
                                    {/*}*/}


                                    <Button color={currentTheme === "dark" ? "#FFF" : "#000"}
                                            title={t("Change Profile Photo")}  onPress={() => ChangeImage()}/>
                                {/*    style={{*/}
                                {/*    marginTop: 5,*/}
                                {/*    marginLeft: 110,*/}
                                {/*}}*/}
                                </View>
                                <View style={styles.editProfileList}>
                                    <View style={styles.editProfileView}>

                                        <Link href="/(tabs)/(profile)/profilesettings" style={styles.editProfileText}   >
                                            {t("Edit Profile")}

                                        </Link>
                                        <Link href="/(tabs)/(profile)/hire" style={styles.editProfileText}  >
                                            {t("Hiring")}
                                        </Link>
                                        <Text style={styles.editProfileText}  >
                                            {t("DownloadHistory")}
                                        </Text>
                                        <Text style={styles.editProfileText}  >
                                            {t("Change Password")}
                                        </Text>


                                        <Text style={styles.editProfileText}>
                                            {t("Select language")}
                                        </Text>
                                        <Button color={currentTheme === "dark" ? 'white' : 'black'} title={"en"}
                                                onPress={() => changelng("en")}/>
                                        <Button color={currentTheme === "dark" ? 'white' : 'black'} title={"rus"}
                                                onPress={() => changelng("rus")}/>

                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.editProfileList}>
                                    <View style={styles.editProfileView}>
                                        <View style={styles.editProfileText}>
                                            {t("Select language")}
                                        </View>
                                        <Button color={currentTheme === "dark" ? 'white' : 'black'} title={"en"}
                                                onPress={() => changelng("en")}/>
                                        <Button color={currentTheme === "dark" ? 'white' : 'black'} title={"rus"}
                                                onPress={() => changelng("rus")}/>
                                    </View>
                                </View>
                            </>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>

    )

}