import {Button, Image, ScrollView, StyleSheet, Switch, Text, TextInput, useColorScheme, View} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import {ChatChangeDetail} from "@/globalRedux/chats/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import React, {useEffect, useState} from "react";
import {fetchChatDetail, fetchChatDetailChange} from "@/globalRedux/chats/asyncActions";
import {CircleImage} from "@/components/account/CircleImage";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import {useTranslation} from "react-i18next";
import {FormData} from "@/app/(tabs)/(insert)/create";
import * as SecureStore from "expo-secure-store";

export default function UpdateChat(){
    const {id} = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const {chat_detail} = useSelector((state: RootState) => state.chats);
    const {api_url} = useSelector((state: RootState) => state.users);
    const router = useRouter();
    const currentTheme = useColorScheme()
    const [chatIcon, setChatIcon] = useState('');
    const {t} = useTranslation();

    const styles = StyleSheet.create({
        label: {
            color: currentTheme === "dark" ? 'white' : 'black',
            marginLeft: 0,
            marginTop: 15,
            marginBottom: -10
        },
        button: {
            marginTop: 40,
            height: 40,
            backgroundColor: '#d2d2d2',
            borderRadius: 4,
            width: '100%',
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingTop: Constants.statusBarHeight,
            padding: 8,
            backgroundColor: '#0e101c',
        },
        input: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? 'white' : 'black',
            borderBottomStyle: 'solid',
            color: currentTheme === "dark" ? 'white' : 'black',
            height: 40,
            width: '100%',
            padding: 10,
            borderRadius: 4,

        },
        dropdown: {
            // margin: 8,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            width: 200,
            elevation: 2,
        },

        placeholderStyle: {
            fontSize: 16,
        },
        selectedTextStyle: {
            fontSize: 16,
            marginLeft: 2,
        },
        switch: {
            marginRight: 8,
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
        },
        userCard: {
            // backgroundColor: 'grey', // Цвет фона остается одинаковым для обоих тем
            flexDirection: 'column',
            marginLeft: 15,
            marginRight: 15,
            borderRadius: 8,
            height: 180,
            marginTop: 45,
            // borderWidth: 3,
            // borderColor: 'grey', // Цвет границы остается одинаковым для обоих тем
            // borderStyle: 'dashed',
            justifyContent: 'center',
            alignItems: 'center', // Используйте alignItems вместо justify-items
        },
        container2: {
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
        inputBio: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? 'white' : 'black',
            borderBottomStyle: 'solid',
            height: 120,
            width: '100%',
            padding: 10,
            marginTop: 6,
            borderRadius: 4,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
    });
    // const pickImage = async () => {
    //         let result = await ImagePicker.launchImageLibraryAsync({
    //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //             allowsEditing: true,
    //             aspect: [1, 1],
    //             quality: 1,
    //         });
    //
    //         if (!result.canceled) {
    //
    //             const big_im = result.assets
    //
    //             // console.log(result)
    //             // console.log(big_im)
    //             const originalname = big_im[0].uri.substring(big_im[0].uri.lastIndexOf("/") + 1);
    //             big_im[0].originalname = `${originalname}`
    //             setChatIcon(big_im[0].uri);
    //             console.log("big_im",big_im[0].uri)
    //             console.log("big_im origname",big_im[0].originalname)
    //             const formData = new FormData();
    //             console.log("formData",formData)
    //             formData.append('image', {
    //                 uri: image[0].uri,
    //                 name: image[0].originalname,
    //                 type: 'image/jpeg'
    //             });
    //             console.log("formData",formData)
    //             const userToken = await SecureStore.getItemAsync('token');
    //             const response = await fetch(`${api_url}/upload`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Authorization': `Bearer ${userToken}`,
    //                     'Content-Type': 'multipart/form-data'
    //                 },
    //                 body: formData
    //             });
    //
    //             const responseData = await response.json();
    //             console.log("responseData",responseData);
    //         }
    //     };

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        control,
        formState: {errors, isValid},

    } = useForm<ChatChangeDetail>({
        defaultValues: {},
    });
    const onSubmit = handleSubmit((values) => {
        console.log(values)
        if (chat_detail !== null) {
            dispatch(fetchChatDetailChange({
                id: id,
                name: values.name,
                description: values.description
            }))
                // {

                // }
                .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        // console.log("Request failed")
                        // setSendResponseErrorImage(true)
                    } else if (response.meta.requestStatus === 'fulfilled') {
                        // console.log("Request fulfilled")
                        // setSuccessDataChange(true);
                        // router.push(`/${lang}`);
                        // setSuccessImageChange(true)
                    }
                    // handle success response
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    })

    useEffect(() => {
        if (id !== null) {

            dispatch(fetchChatDetail({
                chatId: id
            }))
        }
    }, [])

    useEffect(() => {

        if (chat_detail !== null) {
            // console.log(2)
            setValue("name", chat_detail.chatName);
            setValue("description", chat_detail.description);
            setValue('id', id)
        }
        // console.log(1)
    }, [chat_detail])

    return(
        chat_detail !== null ? (


        <ScrollView>
            {/*<View style={styles.userCard}>*/}
            {/*    {*/}
            {/*        data !== null ? (*/}
            {/*    <View*/}
            {/*        onTouchEndCapture={() => pickImage()}*/}
            {/*    >*/}
            {/*        /!*{*!/*/}
            {/*        /!*    image !== null ? (*!/*/}
            {/*        /!*        // <CircleImage img={image[0].uri}/>*!/*/}
            {/*        /!*        // <PostImage source={{uri: image[0].uri}}/>*!/*/}
            {/*                <View style={styles.container2}>*/}
            {/*                    <Image*/}
            {/*                        style={styles.image}*/}
            {/*                        source={{uri: `${chatIcon ? `${chatIcon}` : `${api_url}/${chat_detail.chat_image}`}`}}*/}
            {/*                    />*/}
            {/*                </View>*/}
            {/*    */}
            {/*        /!*    // ) : (*!/*/}
            {/*        /!*    //     <CircleImage img="uploads/down/Extra%20Large%20300x300.jpg" api_url={api_url}/>*!/*/}
            {/*        /!*    // )*!/*/}
            {/*        /!*}*!/*/}
            {/*    </View>*/}
            {/*    <Button color={currentTheme === "dark" ? "#FFF" : "#000"}*/}
            {/*            title={t("Change Profile Photo")}  onPress={() => ChangeImage()}/>*/}
            {/*</View>*/}
            <View style={{padding: 15}}>
                <Text style={styles.label}>{t('Title')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('Name')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="name"
                    rules={{required: true, maxLength: 20}}
                />
                <Text style={styles.label}>{t('Description')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('Description')}
                            style={styles.inputBio}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            multiline={true}
                            numberOfLines={5}
                            maxLength={250}
                        />
                    )}
                    name="description"
                    rules={{
                        required: false,
                        maxLength: {
                            value: 250,
                            message: 'Максимум 250 символов',
                        },
                    }}
                />

                <View style={styles.button}>
                    <Button
                        disabled={!isValid}
                        color="black"
                        title={t('Create group chat')}
                        onPress={() =>onSubmit()}
                    />
                </View>
            </View>
        </ScrollView>
        ): (
            <Text>Loading</Text>
        )
    )
}