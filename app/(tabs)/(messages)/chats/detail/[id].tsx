import {Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import {CircleImage} from "@/components/account/CircleImage";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {fetchChatDetail} from "@/globalRedux/chats/asyncActions";
import {fetchDeletePost} from "@/globalRedux/posts/asyncActions";
import {useTranslation} from "react-i18next";

export default function DetailChat() {
    const {id} = useLocalSearchParams();
    const router = useRouter()
    const {api_url} = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>(); // Вызов функции через переменную
    const {chat_detail} = useSelector((state: RootState) => state.chats);
    const currentTheme = useColorScheme() // Считывание темы телефона
    const {t} = useTranslation(); // Вызов функции перевода текста

    useEffect(() => {
        if (id !== null) {

            dispatch(fetchChatDetail({
                chatId: id
            }))
        }
    }, [])
    if (chat_detail !== null) {
        const styles = StyleSheet.create({


            button: {
                marginTop: 15,
                color: 'white',
                height: 40,
                backgroundColor: '#d0cece',
                borderRadius: 4,
                // width: 165,
                width: '47%'
            },
            ban_button: {
                marginTop: 15,
                color: 'white',
                height: 40,
                backgroundColor: '#d0cece',
                borderRadius: 4,
                width: '100%',
            },
            view: {
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            data: {
                flexDirection: 'row',
                justifyContent: "flex-start",
                alignItems: 'center',

            },
            firstItem: {
                marginTop: 15,
            },
            item: {
                marginTop: 15,
                marginLeft: 15,
            },
            separator: {
                height: 1,
                backgroundColor: 'gray',
                marginVertical: 10,
            },
            separator1: {
                marginTop: -8,
                height: 1,
                backgroundColor: 'gray',
                marginVertical: 10,
            },

        });


        return (
            <ScrollView style={{padding: 15}}>
                <View style={{flexDirection: 'row'}}>

                    <View style={{width: 125, height: 125, borderRadius: 60, overflow: 'hidden', marginRight: 15}}>
                        <Image
                            style={{height: '100%', width: '100%'}}
                            source={{uri: `${api_url}/${chat_detail.chat_image}`}}
                        />
                    </View>
                    <View style={{flexDirection: 'column'}}>


                        <Text style={{fontSize: 18, fontWeight: "bold"}}>
                            {
                                chat_detail.chatName
                            }
                        </Text>
                        <Text>
                            {
                                chat_detail.description
                            }
                        </Text>
                    </View>
                </View>
                <View style={styles.view}>

                    {/*navigation.navigate("CreatePost",{id: id})*/}
                    {/*<View style={styles.button} onTouchEndCapture={() => navigation.navigate('AddNav',{screen: 'CreatePost', params:{id: id} })}>*/}
                    {
                        chat_detail.isGroup && (

                            <View style={styles.button}
                                  onTouchEndCapture={() => {
                                      // router.push(`/chats/update/${id}`)

                                  }}
                                // onTouchEndCapture={() => navigation.navigate('ChangePost', {id: id})}
                            >
                                <Button title={t('AddUser')} color="black"/>
                            </View>
                        )
                    }
                    {
                        !chat_detail.isTechSup && (
                            <View style={styles.button}
                                  onTouchEndCapture={() => {
                                      router.push(`/chats/update/${id}`)

                                  }}
                                // onTouchEndCapture={() => navigation.navigate('ChangePost', {id: id})}
                            >
                                <Button title={t('Edit')} color="black"/>
                            </View>
                        )
                    }
                    <View style={styles.button}
                        // onTouchEndCapture={() => DeletePost()}
                    >
                        <Button title={chat_detail.isGroup ? t('Exit') : t('Delete')} onPress={() => {
                            const confirmMessage = t('Confirm Delete');

                            Alert.alert(
                                t('Подтверждение'),
                                confirmMessage, // Сообщение
                                [
                                    {
                                        text: t('Cancel'),
                                        style: "cancel"
                                    },
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            const params = {
                                                _id: id
                                            };
                                            // dispatch(fetchDeletePost(params));
                                            // router.push(`/${lang}`);
                                        }
                                    }
                                ],
                                {cancelable: false} // Не позволяет закрыть окно, нажав вне его
                            );
                        }} color="red"/>
                    </View>
                </View>
                <View style={{marginTop:15}}>

                    {chat_detail.users.map((user) => (
                        <TouchableOpacity
                            key={user.id}
                            // onPress={() => } // Замените 'User Profile' на ваш экран
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8, // В React Native нет свойства gap, используйте margin
                                marginBottom: 10,
                            }}>
                                <Image
                                    style={{
                                        borderRadius: 50, // Для круглого изображения
                                        width: 32, // Ширина аватара
                                        height: 32
                                    }}
                                    source={{uri: `${api_url}/${user.avatarUrl}`}}
                                    alt="user photo"
                                />
                                <Text style={{}}>{user.fullName}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View>
                    <Text style={{fontSize:14,color:"#767676"}}>{chat_detail.isGroup ? t('GroupChat') : t('PersonalChat')}</Text>
                    <Text style={{fontSize:14,color:"#767676"}}>{chat_detail.isTechSup && t('TechSupp') }</Text>
                </View>

            </ScrollView>
        )
    } else {
        return (
            <Text>Loading</Text>
        )
    }
}