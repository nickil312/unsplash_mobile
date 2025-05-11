import {
    View,
    Text,
    Image,
    StyleSheet,
    useColorScheme,
    ScrollView,
    TouchableOpacity,
    RefreshControl
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useRouter} from "expo-router";
import React, {useContext, useEffect, useState} from "react";
import {WebsocketContext} from "@/app/websocket_provider";
import {fetchAllChats} from "@/globalRedux/chats/asyncActions";
import {clearAllChatsForExit, crearChatOldMessages, saveChat_info} from "@/globalRedux/chats/slice";
import {Status} from "@/globalRedux/posts/types";
import {truncateText} from "@/components/func/truncateText";
import i18next from "@/i18n";
import {MaterialIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

export default function AllRooms() {
    const dispatch = useDispatch<AppDispatch>();
    const {items, status} = useSelector((state: RootState) => state.chats.chatsAll);
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const router = useRouter()
    const currentTheme = useColorScheme() // Считывание темы телефона
    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation();

    const {setConn} = useContext(WebsocketContext)
    useEffect(() => {
        LoadChats();
    }, [data]);

    const LoadChats = () => {
        if (data !== null) {

            dispatch(fetchAllChats({
                _id: data._id
            }))
            dispatch(crearChatOldMessages());

        } else {
            dispatch(clearAllChatsForExit())
        }

    }

    const joinRoom = (roomId: string) => {
        if (data !== null) {
            console.log("id есть", data._id)
            // const ws = new WebSocket(
            //     `ws://localhost:8080/ws/joinRoom/${roomId}?userId=${data._id}&username=${data.fullname}&avatarUrl=${data.avatarurl}`
            // )
            const ws = new WebSocket(
                `ws://213.171.27.173:5555/ws/joinRoom/${roomId}?userId=${data._id}&username=${data.fullname}&avatarUrl=${data.avatarurl}`
            )
            // ws.onopen = () =>{
            //     console.log("Connection opened");
            //
            // }
            // ws.onclose = () => {
            //     console.log("Connection closed");
            //     setTimeout(() => joinRoom(roomId), 5000);
            // };
            //
            // ws.onerror = (error) => {
            //     console.error("WebSocket error observed:", error);
            // };
            if (ws.OPEN) {
                setConn(ws)
                // dispatch(saveChat_info({
                //     chatId: roomId,
                // }))
                // router.push(`/${lang}/chats/${roomId}`)
                // Находим объект чата с id === roomId
                const chatInfo = items.find(item => item.chatId === roomId);

                if (chatInfo) {
                    dispatch(saveChat_info(chatInfo)); // Передаем найденный объект
                    router.push(`/chats/${roomId}`);
                } else {
                    console.log("Чат не найден");
                }
                // return
            }
        }
        console.log("id нет",)
    }

    const styles = StyleSheet.create({
        noChatsText: {
            flex: 1,
            marginTop: 12,
            fontSize: 24,
            textAlign: 'center',
        },
        gridContainer: {
            flexDirection: 'column',
            marginTop: 4
        },
        chatItem: {
            width: '100%', // Adjust width for mobile
            marginBottom: 12,
            paddingRight: 8,
        },
        chatRow: {
            flexDirection: 'row',
            width: '100%',
        },
        userAva: {
            width: 64,
            height: 64,
            borderRadius: 32,
            marginRight: 8,
            marginLeft: 8,
        },
        chatDetails: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? "white" : "black",
            flex: 1,
            paddingBottom: 8, // Добавлено для отступа
        },
        chatHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        chatName: {
            fontWeight: 'bold',
            color: currentTheme === "dark" ? "white" : "black",
            flexShrink: 1,
            fontSize: 16, // Добавлено для размера шрифта
        },
        groupIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 8, // Изменено на marginLeft для отступа
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            display: 'flex', // Изменено на 'flex' для отображения
        },
        userName: {
            fontSize: 12,
            marginLeft: 8,
            color: currentTheme === "dark" ? "white" : "black"
        },
        messageInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        messageText: {
            fontSize: 14, // Добавлено для размера шрифта
            color: currentTheme === "dark" ? "white" : "black", // Цвет текста
        },
        messageDate: {
            fontSize: 12, // Размер шрифта для даты
            color: '#999', // Цвет текста для даты
        },
    });
    return (
        <>

            {
                data === null ? (
                    <Text style={styles.noChatsText}>
                        {t('You need to register/login')}
                    </Text>
                ) : status === Status.SUCCESS && items.length === 0 ? (
                    <Text style={styles.noChatsText}>
                        Нет чатов
                    </Text>
                ) : status === Status.SUCCESS && items.length > 0 ? (

                    <ScrollView style={styles.gridContainer} refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={LoadChats}/>
                    }>
                        <TouchableOpacity onPress={() => router.push('/chats/create')}>
                            <View style={{marginTop: 4, marginBottom: 8, padding: 4}}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    color: currentTheme === "dark" ? 'white' : 'black'
                                }}>{t('Create group chat')}</Text>
                            </View>
                        </TouchableOpacity>
                        {items.map((post) => (
                            // <View key={post.chatId} style={styles.chatItem} onTouchEndCapture={() => joinRoom(post.chatId)}>
                            <TouchableOpacity key={post.chatId} style={styles.chatItem}
                                              onPress={() => joinRoom(post.chatId)}>

                                <View style={styles.chatRow}>
                                    <Image style={styles.userAva} source={{uri: `${api_url}/${post.chat_image}`}}/>
                                    <View style={styles.chatDetails}>
                                        <View style={styles.chatHeader}>
                                            <Text style={styles.chatName}>{truncateText(post.chatName, 24)}</Text>
                                            <View style={styles.groupIndicator}>
                                                {post.isGroup && <MaterialIcons name="groups" size={24}
                                                                                color={currentTheme === "dark" ? "white" : "black"}/>}
                                                {!post.isGroup && <MaterialIcons name="group" size={24}
                                                                                 color={currentTheme === "dark" ? "white" : "black"}/>}
                                                {post.isTechSup &&
                                                    <MaterialIcons style={{marginLeft: 4}} name="support-agent"
                                                                   size={24}
                                                                   color={currentTheme === "dark" ? "white" : "black"}/>}
                                            </View>
                                        </View>
                                        <View style={styles.userInfo}>
                                            {post.avatarUrl && (
                                                <>
                                                    <Image style={styles.avatar}
                                                           source={{uri: `${api_url}/${post.avatarUrl}`}}/>
                                                    <Text
                                                        style={styles.userName}>{truncateText(post.fullName, 15)}</Text>
                                                </>
                                            )}
                                        </View>
                                        <View style={styles.messageInfo}>
                                            {post.msg && post.msgCrt && post.msgUsId && (
                                                <>
                                                    <Text style={styles.messageText}>{truncateText(post.msg, 22)}</Text>
                                                    <Text style={styles.messageDate}>
                                                        {(() => {
                                                            const messageDate = new Date(post.msgCrt);
                                                            const today = new Date();
                                                            if (messageDate.getFullYear() === today.getFullYear() &&
                                                                messageDate.getMonth() === today.getMonth() &&
                                                                messageDate.getDate() === today.getDate()) {
                                                                return messageDate.toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                });
                                                            } else {
                                                                return new Intl.DateTimeFormat(i18next.language, {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit'
                                                                }).format(messageDate);
                                                            }
                                                        })()}
                                                    </Text>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <Text>loading</Text>
                )}
        </>
    );
};


