import {View, Text, useColorScheme, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView} from "react-native";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import React, {useEffect, useState} from "react";
import {fetchAddUserForChat, fetchUsersForAdd} from "@/globalRedux/chats/asyncActions";
import {AntDesign, Feather} from "@expo/vector-icons";

export default function AddUser() {
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const {chat_detail, users_for_add} = useSelector((state: RootState) => state.chats);
    const [selectedCollections, setSelectedCollections] = useState<{ [key: string]: boolean }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState('');
    const [page, setPage] = useState(0);

    const {api_url, data} = useSelector((state: RootState) => (state.users))
    const styles = StyleSheet.create({

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
        paginationContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
            padding: 15
        },
        pageButton: {
            padding: 10,
            backgroundColor: currentTheme === "dark" ? '#767676' : '#d1d1d1',
            borderRadius: 5,
        },
        pageButtonText: {
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        pageIndicator: {
            fontSize: 16,
            color: currentTheme === "dark" ? 'white' : 'black',

        },
    });

    const fetchPostsSuperDuper = async () => {
        setIsLoading(true);
        const trimmedValue = value.trim(); // remove leading and trailing whitespace
        const searchValue = trimmedValue.replace(/^\s+|\s+$/g, ''); // remove leading and trailing whitespace, but preserve spaces between words

        dispatch(fetchUsersForAdd({
            searchtext: searchValue,
            page: page,
            role_id: 0,
            category: "",
            posttype: '',
            orientation: '',
            license: '',
            limit: '',
            sort: ''
        }))


        // Сдезь будут условия на какие бд делать запросы на разные переменные чтоб было нормально
        setIsLoading(false);
    }


    useEffect(() => {
        if (users_for_add.items.length > 0) {
            const initialSelectedCollections: { [key: string]: boolean } = {};

            users_for_add.items.forEach((item) => {
                // Проверяем, есть ли пользователь в chat_detail.users
                const userExists = chat_detail?.users.some(user => user.id === item._id);
                initialSelectedCollections[item._id] = userExists ? true : false;
            });

            setSelectedCollections(initialSelectedCollections);
            console.log(selectedCollections);
        }
    }, [users_for_add, chat_detail]);

    useEffect(() => {
        // window.scrollTo(0, 0);
        // console.log("use effect")
        // console.log(`${api_url}/`)
        console.log("users_for_add", users_for_add);

        fetchPostsSuperDuper();

        // console.log("usersWithSearch",usersWithSearch)
        // console.log("data load end")
    }, [page]);

    return (
        <ScrollView>
            <View style={[styles.inputContainer, {backgroundColor: currentTheme === "dark" ? "#121212" : "#FFFFFF"}]}>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: currentTheme === "dark" ? "#1E1E1E" : "#F5F5F5",
                        color: currentTheme === "dark" ? 'white' : 'black'
                    }]}
                    value={value}
                    onChangeText={setValue}
                    placeholder={t('Enter username')}
                    placeholderTextColor={currentTheme === "dark" ? "#B0B0B0" : "#888888"} // Цвет текста подсказки
                    onSubmitEditing={fetchPostsSuperDuper}
                />
                <TouchableOpacity style={styles.sendButton} onPress={fetchPostsSuperDuper}>
                    <Feather name="send" size={24} color={currentTheme === "dark" ? "#FFFFFF" : "#000000"}/>
                </TouchableOpacity>
            </View>
            {users_for_add.items.map((user) => (
                <TouchableOpacity style={{
                    padding: 15
                }} onPress={() => {
                    if (chat_detail !== null) {

                        console.log(selectedCollections);

                        // Проверяем, существует ли пользователь в chat_detail.users
                        const userExists = chat_detail?.users.some(u => u.id === user._id);

                        // Проверяем, существует ли пользователь в selectedCollections
                        if (selectedCollections[user._id]) {
                            console.log(`Пользователь с ID ${user._id} уже добавлен.`);
                            return; // Выходим из функции, если пользователь уже есть
                        }

                        // Обновляем состояние selectedCollections
                        const newSelectedCollections = {
                            ...selectedCollections,
                            [user._id]: userExists ? !selectedCollections[user._id] : true // Если пользователь существует, переключаем значение, иначе устанавливаем true
                        };

                        setSelectedCollections(newSelectedCollections);
                        // onSubmitAddImage(_id, user._id, newSelectedCollections[user._id]);
                        dispatch(fetchAddUserForChat({
                            chatId: chat_detail.chatId,
                            userId: user._id
                        }))
                        console.log(newSelectedCollections); // Выводим новое состояние
                    }

                }}>
                    <View style={{alignItems:"center",flexDirection:"row"}}>
                        <View style={{width: 60, height: 60, borderRadius: 60, overflow: 'hidden', marginRight: 15}}>
                            <Image
                                style={{height: '100%', width: '100%'}}
                                source={{uri: `${api_url}/${user.avatarurl}`}}
                            />
                        </View>
                        <View>
                            {
                                selectedCollections[user._id] ? (
                                    <AntDesign name="check" size={24}
                                               color={currentTheme === "dark" ? 'white' : 'black'}/>

                                ) : (
                                    <AntDesign name="plus" size={24} color={currentTheme === "dark" ? 'white' : 'black'} />

                                )
                            }
                        </View>
                    </View>
                </TouchableOpacity>

            ))}
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    style={styles.pageButton}
                    onPress={() => {
                        if (page >= 0) {
                            setPage(page - 1);

                        }
                    }}
                    disabled={page === 0} // Отключаем кнопку, если на первой странице
                >
                    <Text style={styles.pageButtonText}>Назад</Text>
                </TouchableOpacity>

                <Text style={styles.pageIndicator}>Страница {page}</Text>

                <TouchableOpacity
                    style={styles.pageButton}
                    onPress={() => {
                        setPage(page + 1);

                    }}
                >
                    <Text style={styles.pageButtonText}>Вперед</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}