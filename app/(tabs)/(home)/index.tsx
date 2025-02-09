import {
    Button, RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    VirtualizedList
} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import {Text, View} from '@/components/Themed';
import {Link} from "expo-router";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {clearUsersWithSearchCount} from "@/globalRedux/users/slice";
import {
    fetchAllPosts,
    fetchAllPostsWithSearch,
    fetchPosts_Likes_coll_another_user
} from "@/globalRedux/posts/asyncActions";
import {Posts, Status} from "@/globalRedux/posts/types";
import Post from "@/components/miniPost/Post";
import {useTranslation} from "react-i18next";
import {Dropdown, SelectCountry} from "react-native-element-dropdown";
import i18next from "i18next";
import {AntDesign, MaterialCommunityIcons, Octicons} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";


const local_data = [
    {
        value: '1',
        lable: 'Country 1',
        image: {
            uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
        },
    },
    {
        value: '2',
        lable: 'Country 2',
        image: {
            uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
        },
    },
    {
        value: '3',
        lable: 'Country 3',
        image: {
            uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
        },
    },
    {
        value: '4',
        lable: 'Country 4',
        image: {
            uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
        },
    },
    {
        value: '5',
        lable: 'Country 5',
        image: {
            uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
        },
    },
];
const countview = [
    {
        label: {
            en: 'Show 9',
            ru: 'Показывать 9'
        },
        lable: '9',
        name: "countview", value: '1', value1: ""
    },
    {
        label: {
            en: 'Show 18',
            ru: 'Показывать 18'
        },
        lable: '18',
        name: "countview", value: '2', value1: "18"
    },
    {
        label: {
            en: 'Show 27',
            ru: 'Показывать 27'
        },
        lable: '27',
        name: "countview", value: '3', value1: "27"
    },
    {
        label: {
            en: 'Show 36',
            ru: 'Показывать 36'
        },
        lable: '36',
        name: "countview", value: '4', value1: "36"
    }]
const license = [

    {
        label: 'All',
        labelru: 'Все',
        name: "license", value: "1", value1: ""
    },
    {
        label: 'Unsplash+',
        labelru: 'Unsplash+',
        name: "license", value: "2", value1: "plus"
    },
    {
        label: 'Free',
        labelru: 'Бесплатные',
        name: "license", value: "3", value1: "free"
    },
]
const orientation = [
    {
        label: 'All',
        labelru: 'Все',
        name: "", value: "1",
        path: "M9 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h4v14zm10-7h-4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm0 7h-4v-5h4v5zm0-16h-4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-4V5h4v3z",
    },
    {
        label: 'Landscape',
        labelru: 'Горизонтальная',
        name: "landscape", value: "2",
        path: "M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z",
    },
    {
        label: 'Portrait',
        labelru: 'Вертикальная',
        name: "portrait", value: "3",
        path: "M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7V5h10v14z",
    },
]
const sort= [
    {
        label: 'Newest',
        labelru: 'Новым',
        name: "", value: "1"
    },
    {
        label: 'Popular',
        labelru: 'Популярным',
        name: "popular", value: "2"
    },
    {
        label: 'Oldest',
        labelru: 'Старым',
        name: "desc", value: "3"
    }
    ];
export default function TabOneScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const currentTheme = useColorScheme()
    const {status} = useSelector((state: RootState) => state.posts.posts);

    const [page, setPage] = useState<number>(0);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Состояние для отслеживания загрузки
    const [refreshing, setRefreshing] = useState(false); // Состояние для отслеживания обновления
    const [selectedValue, setSelectedValue] = useState("java");

    const styles = StyleSheet.create({
        title: {
            color: currentTheme === 'dark' ? 'white' : 'black',

            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 20,
            fontWeight: 'bold',

        },
        dropdown: {
            margin: 8,
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
            width: 180,
            elevation: 2,
        },

        placeholderStyle: {
            fontSize: 16,
        },
        selectedTextStyle: {
            fontSize: 16,
            marginLeft: 2,
        },
        iconStyle: {
            width: 20,
            height: 20,
        },
        icon: {
            marginLeft:4
        },
    })
    const [value, setValue] = useState('1');
    const [value2, setValue2] = useState('1');
    const [value3, setValue3] = useState('1');
    const [value4, setValue4] = useState('1');

    useEffect(() => {
        if (!refreshing) {

            loadPosts();
        }

    }, [page, value, value2,value3,value4]);
    const loadPosts = async () => {

        console.log("currentPage", page)
        const limit = value === '1' ? "" : value === '2' ? "18" : value === '3' ? "27" : value === '4' ? "36" : '';
        const license = value2 === '1' ? "" : value2 === '2' ? "plus" : value2 === '3' ? "free" : '';
        const orientation = value3 === '1' ? "" : value3 === '2' ? "landscape" : value3 === '3' ? "portrait" : '';
        const sort = value4 === '1' ? "" : value4 === '2' ? "popular" : value4 === '3' ? "desc" : '';

        const posts_data = await dispatch(fetchAllPosts({
            searchtext: "",
            role_id: 0,
            posttype: "photos",
            category: "ban",
            orientation: orientation,
            license: license,
            limit: limit,
            sort: sort,
            page: page,
        }));
        if (posts_data.meta.requestStatus === 'fulfilled') {
            // console.log("posts_data.payload",posts_data.payload)
            // Получаем посты из payload
            const newPosts: Posts[] = posts_data.payload;


            if (newPosts) {
                console.log(refreshing)
                // Фильтруем новые посты, чтобы избежать дубликатов по id
                const uniquePosts = newPosts.filter((newPost: Posts) =>
                    !posts.some(existingPost => existingPost._id === newPost._id)
                );

                // Если есть уникальные посты, добавляем их и увеличиваем страницу
                if (uniquePosts.length > 0) {
                    setPosts(prevPosts => [...prevPosts, ...uniquePosts]);
                    // setPage(prevPage => prevPage + 1);

                } else {
                    console.log("no unique posts")
                    // Если уникальных постов нет, увеличиваем номер страницы
                    // setPage(prevPage => prevPage + 1);
                }
            }
        }
    };

    const loadTest = () => {
        console.log("liadinnaoinosjdflkdsf")
        setPage(page + 1);

    }

    const onRefresh = async () => {
        setRefreshing(true);
        console.log(refreshing)
        // setPosts([]); // Очищаем посты
        // setPosts([]); // Очищаем посты
        // setPosts([]); // Очищаем посты
        setPosts([]); // Очищаем посты
        setValue('1');
        setValue2('1');
        setValue3('1');
        setValue4('1');
        setPage(0); // Сбрасываем страницу
        const posts_data = await dispatch(fetchAllPosts({
            searchtext: "",
            role_id: 0,
            posttype: "photos",
            category: "ban",
            orientation: null,
            license: null,
            limit: null,
            sort: null,
            page: 0,
        }));
        if (posts_data.meta.requestStatus === 'fulfilled') {
            // console.log("posts_data.payload",posts_data.payload)
            // Получаем посты из payload
            const newPosts: Posts[] = posts_data.payload;
            setPosts(newPosts)
            setRefreshing(false); // Сбрасываем состояние обновления
            console.log("refreshed posts")
        }
        ;
    }
    const getItem = (data, index) => {
        return data[index];
    };

    const local_data = countview.map(item => ({
        value: item.value,
        lable: i18next.language === "en" ? item.label.en : item.label.ru, // Используем функцию для получения текста
    }));
    const local_data2 = license.map(item => ({
        value: item.value,
        lable: i18next.language === "en" ? item.label : item.labelru, // Используем функцию для получения текста
    }));
    const local_data3 = orientation.map(item => ({
        value: item.value,
        lable: i18next.language === "en" ? item.label : item.labelru, // Используем функцию для получения текста
    }));
    const local_data4 = sort.map(item => ({
        value: item.value,
        lable: i18next.language === "en" ? item.label : item.labelru, // Используем функцию для получения текста
    }));
    const handleValueChange = (newValue) => {
        setValue(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0);
        // Если изменяется value, можно сбросить посты, если это необходимо
        // setPosts([]); // Если хотите сбросить посты при изменении value
    };

    const handleValue2Change = (newValue) => {
        setValue2(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0); // Сбрасываем страницу
        // loadPosts(); // Загружаем посты с новыми фильтрами
    };
    const handleValue3Change = (newValue) => {
        setValue3(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0); // Сбрасываем страницу
        // loadPosts(); // Загружаем посты с новыми фильтрами
    };
    const handleValue4Change = (newValue) => {
        setValue4(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0); // Сбрасываем страницу
        // loadPosts(); // Загружаем посты с новыми фильтрами
    };
    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={{flex: 1, flexDirection: 'row',backgroundColor: currentTheme === "dark" ? 'black' : '#F2F2F2'}}>

                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={value}
                    data={local_data}
                    valueField="value"
                    labelField="lable"
                    placeholder="placeholder"
                    searchPlaceholder="Search..."
                    onChange={
                        e => handleValueChange(e.value)
                    }
                    renderLeftIcon={() => (
                        <Octicons  style={styles.icon} name="number" size={18} color="black" />
                        // <AntDesign color="black" name="Safety" size={20}/>
                    )}
                />
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={value2}
                    data={local_data2}
                    valueField="value"
                    labelField="lable"
                    placeholder="placeholder"
                    searchPlaceholder="Search..."
                    onChange={e => handleValue2Change(e.value)}
                    renderLeftIcon={() => (
                        <AntDesign style={styles.icon} name="copyright" size={18} color="black" />
                        // <AntDesign style={styles.icon} color="black" name="Safety" size={20}/>
                    )}
                />

            </View>
            <View style={{flex: 1, flexDirection: 'row',backgroundColor:currentTheme === "dark" ? 'black' : '#F2F2F2'}}>

                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={value3}
                    data={local_data3}
                    valueField="value"
                    labelField="lable"
                    placeholder="placeholder"
                    searchPlaceholder="Search..."
                    onChange={
                        e => handleValue3Change(e.value)
                    }
                    renderLeftIcon={() => (
                        <MaterialCommunityIcons name="rotate-left-variant" size={18} color="black" />
                        // <AntDesign style={styles.icon} color="black" name="Safety" size={20}/>
                    )}
                />
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={value4}
                    data={local_data4}
                    valueField="value"
                    labelField="lable"
                    placeholder="placeholder"
                    searchPlaceholder="Search..."
                    onChange={e => handleValue4Change(e.value)}
                    renderLeftIcon={() => (
                        <FontAwesome style={styles.icon} name="sort" size={18} color="black" />
                        // <AntDesign style={styles.icon} color="black" name="Safety" size={20}/>
                    )}
                />

            </View>

            {refreshing && status === Status.LOADING ? ( // Проверяем состояние загрузки
                <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Загрузка...</Text>
            ) : status === Status.ERROR ? ( // Проверяем наличие ошибки
                <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>error</Text>
            ) : posts.length > 0 && Status.SUCCESS ? (
                <VirtualizedList
                    data={posts}
                    getItemCount={() => posts.length}
                    getItem={getItem}
                    renderItem={({item}: { item: Posts }) => (
                        <TouchableOpacity>
                            <Post key={item._id}
                                  imageUrl={item.imageurl}
                                  altText={item.text}
                                  fullname={item.fullname}
                                  avatarurl={item.avatarurl}
                                  user_id={item.user_id}
                                  _id={item._id}
                                  license={item.license}
                                  hirevalue={item.hirevalue}
                                  likedByUser={item.likedByUser}
                                  banned={item.banned}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item._id}
                />
            ) : (
                <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>No post left</Text>
            )}
            <Button color={currentTheme === "dark" ? 'white' : "black"} title={t('loadMore')}
                    onPress={() => loadTest()}/>
            {status === Status.LOADING && <Text>Загрузка...</Text>}


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
