import {
    View,
    Text,
    useColorScheme,
    RefreshControl,
    VirtualizedList,
    TouchableOpacity,
    Button,
    ScrollView,
    StyleSheet
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {fetchAllPosts, fetchAllPostsWithSearch, fetchCollectionsWithSearch} from "@/globalRedux/posts/asyncActions";
import {Collections, Posts, Status} from "@/globalRedux/posts/types";
import i18next from "i18next";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useTranslation} from "react-i18next";
import {clearUsersWithSearchCount} from "@/globalRedux/users/slice";
import {Dropdown} from "react-native-element-dropdown";
import {AntDesign, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, Octicons} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Post from "@/components/miniPost/Post";
import {clearPostsWithSearchCount} from "@/globalRedux/posts/slice";
import Collection from "@/components/miniPost/Collection";
import {fetchAllUsersWithSearch} from "@/globalRedux/users/asyncActions";
import {Users} from "@/globalRedux/users/types";
import UserPost from "@/components/miniPost/UserPost";

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
const sort = [
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
export default function SearchList() {

    const {text} = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const currentTheme = useColorScheme()
    const {status} = useSelector((state: RootState) => state.posts.posts);
    const {collectionsWithSearch} = useSelector((state: RootState) => state.posts);
    const {usersWithSearch, api_url} = useSelector((state: RootState) => state.users);

    const [page, setPage] = useState<number>(0);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [collections, setCollections] = useState<Collections[]>([]);
    const [users, setUsers] = useState<Users[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [value, setValue] = useState('1');
    const [value2, setValue2] = useState('1');
    const [value3, setValue3] = useState('1');
    const [value4, setValue4] = useState('1');


    const [bdFilter, setbdFilter] = useState('photos');
    const [collectionsCount, setcollectionsCount] = useState(null);
    const [illustrationCount, setillustrationCount] = useState(null);
    const [photoCount, setphotoCount] = useState(null);
    const [usersCount, setusersCount] = useState(null);

    const router = useRouter();
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
            marginLeft: 4
        },
    })

    useEffect(() => {
        if (!refreshing) {

            loadPosts();
        }

    }, [page, value, value2, value3, value4, bdFilter]);
    const loadPosts = async () => {

        console.log("currentPage", page)
        console.log("bdFilter", bdFilter)
        const limit = value === '1' ? "" : value === '2' ? "18" : value === '3' ? "27" : value === '4' ? "36" : '';
        const license = value2 === '1' ? "" : value2 === '2' ? "plus" : value2 === '3' ? "free" : '';
        const orientation = value3 === '1' ? "" : value3 === '2' ? "landscape" : value3 === '3' ? "portrait" : '';
        const sort = value4 === '1' ? "" : value4 === '2' ? "popular" : value4 === '3' ? "desc" : '';

        dispatch(clearUsersWithSearchCount());
        if (bdFilter === "photos" || bdFilter === "illustrations") {


            const posts_data = await dispatch(fetchAllPostsWithSearch({
                searchtext: text, // Используем значение из состояния
                role_id: 0,
                category: "",
                posttype: bdFilter,
                orientation: orientation,
                license: license,
                limit: limit,
                sort: sort,
                page: page,
            }));
            if (posts_data.meta.requestStatus === 'fulfilled') {
                // console.log("posts_data.payload",posts_data.payload)
                // Получаем посты из payload
                const newPosts: Posts[] = posts_data.payload.posts;
                setcollectionsCount(posts_data.payload.collectionsCount);
                setusersCount(posts_data.payload.usersCount);
                setphotoCount(posts_data.payload.photoCount);
                setillustrationCount(posts_data.payload.illustrationCount);


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
        } else if (bdFilter === "collections") {
            dispatch(clearPostsWithSearchCount());
            dispatch(clearUsersWithSearchCount())
            const posts_data = await dispatch(fetchCollectionsWithSearch({
                searchtext: text,
                page: page,
                role_id: 0,
                category: "",
                posttype: '',
                orientation: '',
                license: '',
                limit: limit,
                sort: '',
            }))
            if (posts_data.meta.requestStatus === 'fulfilled') {
                // console.log("posts_data.payload",posts_data.payload)
                // Получаем посты из payload
                const newPosts: Collections[] = posts_data.payload.posts;
                setcollectionsCount(posts_data.payload.collectionsCount);
                setusersCount(posts_data.payload.usersCount);
                setphotoCount(posts_data.payload.photoCount);
                setillustrationCount(posts_data.payload.illustrationCount);


                if (newPosts) {
                    console.log(refreshing)
                    // Фильтруем новые посты, чтобы избежать дубликатов по id
                    const uniquePosts = newPosts.filter((newPost: Collections) =>
                        !collections.some(existingPost => existingPost._id === newPost._id)
                    );

                    // Если есть уникальные посты, добавляем их и увеличиваем страницу
                    if (uniquePosts.length > 0) {
                        setCollections(prevPosts => [...prevPosts, ...uniquePosts]);
                        // setPage(prevPage => prevPage + 1);

                    } else {
                        console.log("no unique collections")
                        // Если уникальных постов нет, увеличиваем номер страницы
                        // setPage(prevPage => prevPage + 1);
                    }
                }
            }

        } else if (bdFilter === "users") {
            dispatch(clearPostsWithSearchCount());
            dispatch(clearUsersWithSearchCount())
            const posts_data = await dispatch(fetchAllUsersWithSearch({
                searchtext: text,
                page: page,
                role_id: 0,
                category: "",
                posttype: '',
                orientation: '',
                license: '',
                limit: limit,
                sort: '',
            }))
            if (posts_data.meta.requestStatus === 'fulfilled') {
                // console.log("posts_data.payload",posts_data.payload)
                // Получаем посты из payload
                const newPosts: Users[] = posts_data.payload.posts;
                setcollectionsCount(posts_data.payload.collectionsCount);
                setusersCount(posts_data.payload.usersCount);
                setphotoCount(posts_data.payload.photoCount);
                setillustrationCount(posts_data.payload.illustrationCount);


                if (newPosts) {
                    console.log(refreshing)
                    // Фильтруем новые посты, чтобы избежать дубликатов по id
                    const uniquePosts = newPosts.filter((newPost: Users) =>
                        !collections.some(existingPost => existingPost._id === newPost._id)
                    );

                    // Если есть уникальные посты, добавляем их и увеличиваем страницу
                    if (uniquePosts.length > 0) {
                        setUsers(prevPosts => [...prevPosts, ...uniquePosts]);
                        // setPage(prevPage => prevPage + 1);

                    } else {
                        console.log("no unique users")
                        // Если уникальных постов нет, увеличиваем номер страницы
                        // setPage(prevPage => prevPage + 1);
                    }
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
        setbdFilter("photos")
        setCollections([])
        setUsers([])
        dispatch(clearUsersWithSearchCount());
        const posts_data = await dispatch(fetchAllPostsWithSearch({
            searchtext: text, // Используем значение из состояния
            role_id: 0,
            category: "",
            posttype: "photos",
            orientation: null,
            license: null,
            limit: null,
            sort: null,
            page: 0,
        }));
        if (posts_data.meta.requestStatus === 'fulfilled') {
            // console.log("posts_data.payload",posts_data.payload)
            // Получаем посты из payload
            const newPosts: Posts[] = posts_data.payload.posts;
            setcollectionsCount(posts_data.payload.collectionsCount);
            setusersCount(posts_data.payload.usersCount);
            setphotoCount(posts_data.payload.photoCount);
            setillustrationCount(posts_data.payload.illustrationCount);

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
    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0);
        // Если изменяется value, можно сбросить посты, если это необходимо
        // setPosts([]); // Если хотите сбросить посты при изменении value
    };

    const handleValue2Change = (newValue: string) => {
        setValue2(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0); // Сбрасываем страницу
        // loadPosts(); // Загружаем посты с новыми фильтрами
    };
    const handleValue3Change = (newValue: string) => {
        setValue3(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0); // Сбрасываем страницу
        // loadPosts(); // Загружаем посты с новыми фильтрами
    };
    const handleValue4Change = (newValue: string) => {
        setValue4(newValue);
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0); // Сбрасываем страницу

        // loadPosts(); // Загружаем посты с новыми фильтрами
    };
    const handleFilterChange = (newValue: string) => {
        setbdFilter(newValue)
        setPosts([]); // Сбрасываем посты при изменении лицензии
        setPage(0);
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
            <View
                style={{flex: 1, flexDirection: 'row', backgroundColor: currentTheme === "dark" ? 'black' : '#F2F2F2'}}>

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
                        <Octicons style={styles.icon} name="number" size={18} color="black"/>
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
                        <AntDesign style={styles.icon} name="copyright" size={18} color="black"/>
                        // <AntDesign style={styles.icon} color="black" name="Safety" size={20}/>
                    )}
                />

            </View>
            <View
                style={{flex: 1, flexDirection: 'row', backgroundColor: currentTheme === "dark" ? 'black' : '#F2F2F2'}}>

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
                        <MaterialCommunityIcons name="rotate-left-variant" size={18} color="black"/>
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
                        <FontAwesome style={styles.icon} name="sort" size={18} color="black"/>
                        // <AntDesign style={styles.icon} color="black" name="Safety" size={20}/>
                    )}
                />

            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 8, marginTop: 8}}>
                <View style={{marginLeft: 8, display: 'flex', flexDirection: 'row', gap: 8}}>


                    <TouchableOpacity onPress={e => handleFilterChange("photos")}>

                        <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
                            <Ionicons name="image" size={25} color={currentTheme == "dark" ? 'white' : "black"}/>
                            <Text style={{
                                fontSize: 18,
                                color: currentTheme === 'dark' ? 'white' : 'black',
                            }}>Photos {photoCount}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={e => handleFilterChange("illustrations")}>

                        <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
                            <FontAwesome5 name="pencil-alt" size={20}
                                          color={currentTheme == "dark" ? 'white' : "black"}/>
                            <Text style={{
                                fontSize: 18,
                                color: currentTheme === 'dark' ? 'white' : 'black',
                            }}>Illustrations {illustrationCount}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={e => handleFilterChange("collections")}>

                        <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
                            <Ionicons name="folder-open" size={24} color={currentTheme == "dark" ? 'white' : "black"}/>
                            <Text style={{
                                fontSize: 18,
                                color: currentTheme === 'dark' ? 'white' : 'black',
                            }}>Collections {collectionsCount}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={e => handleFilterChange("users")}>

                        <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
                            <Feather name="users" size={24} color={currentTheme == "dark" ? 'white' : "black"}/>
                            <Text style={{
                                fontSize: 18,
                                color: currentTheme === 'dark' ? 'white' : 'black',
                            }}>Users {usersCount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {
                bdFilter === 'photos' || bdFilter === 'illustrations' ? (
                    refreshing && status === Status.LOADING ? ( // Проверяем состояние загрузки
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
                    )
                ) : bdFilter === 'collections' ? (
                    refreshing && collectionsWithSearch.status === Status.LOADING ? ( // Проверяем состояние загрузки
                        <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Загрузка...</Text>
                    ) : collectionsWithSearch.status === Status.ERROR ? ( // Проверяем наличие ошибки
                        <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>error</Text>
                    ) : collectionsWithSearch.items.posts.length > 0 && Status.SUCCESS ? (
                        <VirtualizedList
                            data={collections}
                            getItemCount={() => collections.length}
                            getItem={getItem}
                            renderItem={({item}: { item: Collections }) => (
                                <TouchableOpacity>
                                    <Collection _id={item._id} name={item.name} Isprivate={item.private}
                                                last_three_posts={item.last_three_posts}
                                                total_photos={item.total_photos} deleted={item.deleted}/>

                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    ) : (
                        <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>No post left</Text>
                    )

                ) : bdFilter === 'users' ? (
                    refreshing && usersWithSearch.status === Status.LOADING ? ( // Проверяем состояние загрузки
                        <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Загрузка...</Text>
                    ) : usersWithSearch.status === Status.ERROR ? ( // Проверяем наличие ошибки
                        <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>error</Text>
                    ) : usersWithSearch.items.users.length > 0 && Status.SUCCESS ? (
                        <VirtualizedList
                            data={users}
                            getItemCount={() => users.length}
                            getItem={getItem}
                            renderItem={({item}: { item: Users }) => (
                                <TouchableOpacity
                                    onPress={() =>
                                {
                                    router.push(`/users/${item._id}`);
                                }
                                }
                                >
                                    {/*<Collection _id={item._id} name={item.name} Isprivate={item.private}*/}
                                    {/*            last_three_posts={item.last_three_posts}*/}
                                    {/*            total_photos={item.total_photos} deleted={item.deleted}/>*/}
                                    <UserPost _id={item._id} user_role_id={item.user_role_id} fullname={item.fullname}
                                              avatarurl={item.avatarurl} banned={item.banned}
                                              last_three_posts={item.last_three_posts} hirevalue={item.hirevalue}
                                              api_url={api_url}/>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    ) : (
                        <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>No post left</Text>
                    )
                ) : (
                    <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Errr</Text>
                )
            }

            <Button color={currentTheme === "dark" ? 'white' : "black"} title={t('loadMore')}
                    onPress={() => loadTest()}/>
            {status === Status.LOADING && <Text>Загрузка...</Text>}


        </ScrollView>
    )
}