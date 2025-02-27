import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useContext, useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    FlatList,
    useColorScheme,
    TouchableOpacity,
    ScrollView
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {WebsocketContext} from "@/app/websocket_provider";
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import axios from '../../../../chat_axios'
import {Messages} from "@/globalRedux/chats/types";
import {fetchOld_Messages} from "@/globalRedux/chats/asyncActions";
import {crearChatOldMessages} from "@/globalRedux/chats/slice";
import {Status} from "@/globalRedux/posts/types";
import MessageCard from "@/components/chats/MessageCard";
import {Feather} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

export type Message = {
    content: string
    createdAt: string
    _id: string
    fullname: string
    avatarUrl: string
    room_id: string
    type: 'recv' | 'self'
    edit: boolean
    id: string
    deleted: boolean
}
export default function Chat() {
    const {id} = useLocalSearchParams();
    const [messages, setMessage] = useState<Array<Message>>([])
    const {conn} = useContext(WebsocketContext)
    const [users, setUsers] = useState<Array<{ fullname: string, _id: string }>>([])
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingMessageContent, setEditingMessageContent] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const currentTheme = useColorScheme() // Считывание темы телефона
    const {t} = useTranslation(); // Вызов функции перевода текста
    const {chat_info} = useSelector((state: RootState) => state.chats);

    const styles = StyleSheet.create({
        container: {
            flex: 1,

        },
        messagesList: {
            paddingBottom: 10,
        },
        messageContainer: {
            marginBottom: 10,
            padding: 10,

        },
        messageText: {
            fontSize: 16,
            color: currentTheme === "dark" ? "white" : "black",
        },
        messageInfo: {
            fontSize: 12,
            color: '#888',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5, // Закругление для контейнера
            overflow: 'hidden', // Чтобы закругление работало
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,

        },
        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5, // Закругление для текстового поля
            padding: 10,
            marginRight: 10, // Отступ между текстовым полем и кнопкой
        },
        sendButton: {
            width: 40, // Ширина кнопки
            height: 40, // Высота кнопки
            justifyContent: 'center', // Центрируем содержимое
            alignItems: 'center', // Центрируем содержимое
        },
        container2: {
            flexGrow: 1,
            maxHeight: '100%', // Установите максимальную высоту
        },
        centered: {
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            color: 'red',
        },
    });

    useEffect(() => {
        if (conn === null) {
            router.dismissTo(`/`)
            return
        }

        // const roomId = conn.url.split('/')[5]
        async function getUsers() {
            try {
                const res = await axios.get(`/ws/getClients/${id}`, {
                    headers: {'Content-Type': 'application/json'},
                });
                console.log(res.data); // Выводим данные в консоль
                setUsers(res.data); // Устанавливаем пользователей
            } catch (e) {
                console.error(e);
            }
        }

        getUsers()
    }, [])
    const [isConnected, setIsConnected] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {

        if (conn === null) {
            router.push('/')
            return
        }


        conn.onopen = () => {
            // setIsConnected(true);
            setHasError(false); // Сброс ошибки при успешном подключении
            console.log("Connection opened ________");
        };
        console.log("____ale onopen mimo", conn)
        conn.onclose = () => {
            setIsConnected(false);
            console.log("Connection closed ________");
        };

        conn.onerror = (error) => {
            setHasError(true);
            console.log("WebSocket error observed: ________", error);
        };

        conn.onmessage = (message) => {
            const m: Message = JSON.parse(message.data);
            console.log("m ___________ ", m)
            // Убедитесь, что fullname присутствует в сообщении
            if (m.content === 'A new user has joined the room') {
                setUsers((prevUsers) => [...prevUsers, {fullname: m.fullname, _id: m._id}]);
            }

            if (m.content === 'user left the chat') {
                setUsers((prevUsers) => prevUsers.filter((user) => user.fullname !== m.fullname));
                setMessage((prevMessages) => [...prevMessages, m]);
                return;
            }
            if (data !== null) {

                // Устанавливаем тип сообщения и fullname
                m.type = data?._id === m._id ? 'self' : 'recv';
                const date = new Date();
                m.createdAt = date.toISOString();
            }
            if (m.deleted) {
                setMessage((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== m.id) // Удаляем сообщение из состояния
                );
                setAllMessages((prevAllMessages) =>
                    prevAllMessages.filter((msg) => msg.id !== m.id) // Удаляем сообщение из состояния
                );
            } else if (m.edit) {
                setMessage((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === m.id ? {...msg, content: m.content, edit: true} : msg
                    )
                );
                setAllMessages((prevAllMessages) =>
                    prevAllMessages.map((msg) =>
                        msg.id === m.id ? {...msg, content: m.content, edit: true} : msg
                    )
                );
            } else {
                setMessage((prevMessages) => [...prevMessages, m]);
            }
            // setMessage((prevMessages) => [...prevMessages, m]);
        };

    }, [messageInput, messages, conn, users])

    const sendMessage = () => {
        if (!messageInput.trim()) return;
        if (conn === null) {
            router.push('/')
            return
        }

//тут придется id генерить
        const messageContent = messageInput;
        if (editingMessageId === null) {

            const messageId = uuidv4().substring(0, 24);
            const message = {
                content: messageContent,
                id: messageId, // Use a unique ID for new messages
                edit: false, // Set the edit flag if editing
                deleted: false,
            };

            // Send the message through the WebSocket connection
            conn.send(JSON.stringify(message));
        } else {
            const message = {
                content: messageContent,
                id: editingMessageId, // Use a unique ID for new messages
                edit: true, // Set the edit flag if editing
                deleted: false
            };
            conn.send(JSON.stringify(message));

// Обновляем сообщение в allMessages
            setAllMessages((prevAllMessages) =>
                prevAllMessages.map((msg) =>
                    msg.id === editingMessageId ? {...msg, content: messageContent, edit: true} : msg
                )
            );
        }
        // conn.send(textarea.current.value)


        setMessageInput('')
        setEditingMessageId(null); // Reset editing state after sending
        setEditingMessageContent("");
    }
    const editMessage = (message) => {
        // console.log("edit button")
        // if (textarea.current !== null) {
        console.log("edit button done")

        setEditingMessageId(message.id);
        setEditingMessageContent(message.content);

        setMessageInput(message.content)
        //  = message.content; // Заполняем текстовое поле содержимым сообщения
        // }
    };
    const deleteMessage = (id: string) => {
        console.log("delete button")
        if (conn === null) {
            router.push('/')
            return
        }
        console.log("deleted mess _______ id", id)
        setDeleteId(id);
        // if(deleteId !== null){
        const message = {
            id: id, // Use a unique ID for new messages
            deleted: true,
            content: "deleted message",
            edit: false, // Set the edit flag if editing
        };
        conn.send(JSON.stringify(message));

        setAllMessages((prevAllMessages) => prevAllMessages.filter((msg) => msg.id !== id));

        // }
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Предотвращаем переход на новую строку
            sendMessage();
        }
    };

    // __________________________
    const {items, status} = useSelector((state: RootState) => state.chats.chat_old_Messages);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1); // Состояние для хранения номера страницы
    const [allMessages, setAllMessages] = useState<Messages[]>(items); // Состояние для хранения всех сообщений

    const loadingMoreRef = useRef(false); // Используем useRef для отслеживания состояния загрузки

    useEffect(() => {
        if (data !== null) {
            dispatch(fetchOld_Messages({
                chatId: id,
                page: page.toString()
            }))
        }
        console.log(page)
    }, [data, page]);

    useEffect(() => {
        console.log(items)
        // if (!textarea.current?.value) {
        //     console.log("textarea null",textarea.current)
        // }
        //
        // if(textarea.current !== null){
        //
        // console.log("textarea",textarea.current.value)
        // }
        if (items === null && status === Status.SUCCESS) {
            dispatch(crearChatOldMessages());
        } else {
            // Обновляем состояние allMessages при изменении items, если items не пустой и является массивом
            if (items !== null && Array.isArray(items) && items.length > 0) {
                // Проверяем, если roomId первого элемента не равен id
                if (items[0].roomId !== id) {
                    dispatch(crearChatOldMessages());

                } else {

                    setAllMessages((prevMessages) => {
                        // Проверяем, чтобы избежать дублирования
                        const newMessages = items.filter(item => !prevMessages.some(prev => prev.id === item.id));
                        return [...newMessages, ...prevMessages];
                    });
                }
            }
        }
    }, [items, id])


    return (
        <View style={styles.container}>
            {
                chat_info !== null ? (
                    <TouchableOpacity
                        onPress={() => router.push(`/chats/detail/${id}`)}
                    >
                        <View style={[styles.headerContainer, {backgroundColor: currentTheme === "dark" ? "#121212" : "#FFFFFF"}]}>

                            <Text style={{color:currentTheme === "dark" ? "white" : "black"}}>
                                {
                                    chat_info.chatName
                                }
                            </Text>
                        </View>

                    </TouchableOpacity>
                ) : (
                    <></>
                )
            }

            <ScrollView
                keyboardShouldPersistTaps="handled" // Чтобы клавиатура не закрывала поле ввода
                style={styles.container2}
                // onScroll={handleScroll}
                scrollEventThrottle={16} // Для более плавной прокрутки
            >
                <Button color={currentTheme === "dark" ? 'white' : "black"} title={t('loadMore')}
                        onPress={() => setPage((prevPage) => prevPage + 1)}/>
                {status === Status.LOADING ? (
                    <View style={styles.centered}>
                        <Text>Загрузка...</Text>
                    </View>
                ) : status === Status.ERROR ? (
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>Произошла ошибка при загрузке сообщений.</Text>
                    </View>
                ) : status === Status.SUCCESS && (!items || items.length === 0) && (!allMessages || allMessages.length === 0) ? (
                    <View style={styles.centered}>
                        <Text>Сообщений нет</Text>
                    </View>
                ) : allMessages && allMessages.length > 0 ? (
                    allMessages.map((message) => (
                        <MessageCard
                            key={message.id}
                            id={message.id}
                            _id={message._id}
                            self={data !== null && message._id === data._id}
                            edit={message.edit}
                            content={message.content}
                            fullname={message.fullname}
                            createdAt={message.createdAt}
                            avatarUrl={message.avatarUrl}
                            roomId={message.roomId}
                            api_url={api_url}
                            onEdit={() => editMessage(message)}
                            onDelete={() => deleteMessage(message.id)}
                        />
                    ))
                ) : (
                    <View style={styles.centered}>
                        <Text>Неизвестный статус</Text>
                    </View>
                )}
                {
                    messages.length > 0 ? (
                        messages.map((item) => (
                            <MessageCard
                                key={item.id}
                                fullname={item.fullname}
                                avatarUrl={item.avatarUrl}
                                _id={item._id}
                                id={item.id}
                                roomId={item.room_id}
                                content={item.content}
                                createdAt={item.createdAt}
                                self={data?._id === item._id} // Определяем, является ли сообщение от текущего пользователя
                                api_url={api_url}
                                onEdit={() => console.log("Edit message", item.id)} // Замените на вашу логику редактирования
                                onDelete={() => console.log("Delete message", item.id)} // Замените на вашу логику удаления
                                edit={item.edit} // Передаем флаг редактирования
                            />
                        ))
                    ) : (
                        <></>
                    )
                }
            </ScrollView>
            {/*<FlatList*/}
            {/*    data={messages}*/}
            {/*    renderItem={renderMessage}*/}
            {/*    keyExtractor={(item) => item.id}*/}
            {/*    contentContainerStyle={styles.messagesList}*/}

            {/*    // inverted // Чтобы новые сообщения отображались внизу*/}
            {/*/>*/}
            <View style={[styles.inputContainer, {backgroundColor: currentTheme === "dark" ? "#121212" : "#FFFFFF"}]}>
                <TextInput
                    style={[styles.input, {backgroundColor: currentTheme === "dark" ? "#1E1E1E" : "#F5F5F5"}]}
                    value={messageInput}
                    onChangeText={setMessageInput}
                    placeholder="Введите сообщение..."
                    placeholderTextColor={currentTheme === "dark" ? "#B0B0B0" : "#888888"} // Цвет текста подсказки
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Feather name="send" size={24} color={currentTheme === "dark" ? "#FFFFFF" : "#000000"}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}