import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import {ChatCreateForm} from "@/globalRedux/chats/types";
import {Controller, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useRouter} from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Constants from "expo-constants";
import {CircleImage} from "@/components/account/CircleImage";
import {fetchCreateChat} from "@/globalRedux/chats/asyncActions";
import * as SecureStore from "expo-secure-store";
import {FormData} from "@/app/(tabs)/(insert)/create";
import {fetchChangeProfileImg} from "@/globalRedux/users/asyncActions";

export default function CreateChat() {
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const [image, setImage] = useState(null);
    const {t} = useTranslation();
    const currentTheme = useColorScheme() // Считывание темы телефона
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const router = useRouter();
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

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        control,
        formState: {errors, isValid},

    } = useForm<ChatCreateForm>({
        defaultValues: {
            isTechSup: false,
            chat_image: '',


        },
    });
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

        }
    };
    const ChangeImage = async () => {
        // if(imageIsJussed) {
            if (data !== null) {

                // setloading(true);
                // Alert.alert(1);
                console.log("imageChouse")
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

                // const datasend = {
                //     email: data.email,
                //     avatarurl: responseData.compressedUrl
                // }
                console.log("responseData",responseData)
                setImage(responseData.compressedUrl);
                console.log("image",image)

                // console.log("datasend",datasend)

                // Alert.alert(3);
                //
                // console.log(">?>?>?>?>>?>?>?>?>?>?>")
                // console.log(datasend)
                // console.log(">?>?>?>?>>?>?>?>?>?>?>")

                // const res = await dispatch(fetchChangeProfileImg(datasend))
                // console.log(res)
                // setloading(false);
                // Alert.alert(4);
            }
        // }
        // else{
        //     Alert.alert(t("ImageNotJused"),t("ChooseImageInCircle"))
        // }
    }

    const onSubmit = async (values) => {
        if (values.chatName === ' ') {
            Alert.alert("Please enter a valid fullName");
        }
        const lineBreaks = (values.description.match(/\n/g) || []).length; // Считаем количество переносов строки
        if (lineBreaks > 5) {
            Alert.alert("Description cannot contain more than 5 line breaks.");
            return; // Выход из функции, если условие не выполнено
        }

        // Проверка на максимальную длину bio
        if (values.description.length > 250) {
            Alert.alert("Description cannot exceed 250 characters.");
            return; // Выход из функции, если условие не выполнено
        } else {
            console.log(values)
            if (data !== null) {
                console.log("image",image)
                // if (image) {
                //     console.log("image proshel")
                //     const formData = new FormData();
                //
                //     formData.append('image', {
                //         uri: image[0].uri,
                //         name: image[0].originalname,
                //         type: 'image/jpeg'
                //     });
                //     // console.log("formData",formData)
                //     const userToken = await SecureStore.getItemAsync('token');
                //     // console.log(userToken)
                //     const response = await fetch(`${api_url}/upload`, {
                //         method: 'POST',
                //         headers: {
                //             'Authorization': `Bearer ${userToken}`,
                //             'Content-Type': 'multipart/form-data'
                //         },
                //         body: formData
                //     });
                //
                //     const responseData = await response.json();
                //     console.log("responseData",responseData);
                //     values.chat_image = responseData.compressedUrl;
                //     console.log("image added",values.chat_image)
                //     dispatch(fetchCreateChat({
                //         _id: data._id,
                //         userId: "",
                //         chatName: values.chatName,
                //         isTechSup: isEnabled,
                //         description: values.description,
                //         chat_image: values.chat_image,
                //         isGroup: true
                //     }))
                //         .then((response) => {
                //             console.log(response)
                //             if (response.meta.requestStatus === 'rejected') {
                //                 // setError(true);
                //                 // console.log("Request failed")
                //                 // setSendResponseErrorImage(true)
                //             } else if (response.meta.requestStatus === 'fulfilled') {
                //                 // console.log("Request fulfilled")
                //                 // setSuccessDataChange(true);
                //                 // router.push(`/${lang}`);
                //                 // setSuccessImageChange(true)
                //             }
                //             // handle success response
                //         })
                //         .catch((error) => {
                //             console.log(error)
                //             // setSendDataChange(true);
                //         })
                //
                // }else {

                console.log("image added or not",values.chat_image)
                console.log("create chat")
                dispatch(fetchCreateChat({
                    _id: data._id,
                    userId: "",
                    chatName: values.chatName,
                    isTechSup: isEnabled,
                    description: values.description,
                    chat_image: image !== null ? image : '',
                    isGroup: true
                }))
                    .then((response) => {
                        console.log(response)
                        if (response.meta.requestStatus === 'rejected') {
                            // setError(true);
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
                        // setSendDataChange(true);
                    })
                // }
            }
        }

    }
    return (
        <ScrollView>
            <View style={styles.userCard}>
                {/*{*/}
                {/*    data !== null ? (*/}
                <View onTouchEndCapture={() => pickImage()}>
                    {
                        image !== null ? (
                            // <CircleImage img={image[0].uri}/>
                            // <PostImage source={{uri: image[0].uri}}/>
                            <View style={styles.container2}>
                                <Image
                                    style={styles.image}
                                    source={{uri: image[0].uri}}
                                />
                            </View>

                        ) : (
                            <CircleImage img="uploads/down/Extra%20Large%20300x300.jpg" api_url={api_url}/>
                        )
                    }
                </View>
                <Button color={currentTheme === "dark" ? "#FFF" : "#000"}
                        title={t("Change Profile Photo")}  onPress={() => ChangeImage()}/>
            </View>
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
                    name="chatName"
                    rules={{required: true, maxLength: 20}}
                />
                <Text style={styles.label}>{t('Bio')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('Bio')}
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
                <Text style={styles.label}>{t('Messaging')}</Text>
                <Switch
                    style={{marginTop: 20}}
                    // trackColor={{false: '#767577', true: '#d2d2d2'}}
                    // thumbColor={isEnabled ? 'rgba(37,36,36,0.81)' : '#f4f3f4'}
                    // ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                <View style={styles.button}>
                    <Button
                        disabled={!isValid}
                        color="black"
                        title={t('Change Profile Data')}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </View>
        </ScrollView>
    )
}