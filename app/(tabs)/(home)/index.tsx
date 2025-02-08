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

export default function TabOneScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const currentTheme = useColorScheme()
    const {items, status} = useSelector((state: RootState) => state.posts.posts);

    const [page, setPage] = useState<number>(0);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Состояние для отслеживания загрузки
    const [refreshing, setRefreshing] = useState(false); // Состояние для отслеживания обновления

    const styles = StyleSheet.create({
        title: {
            color: currentTheme === 'dark' ? 'white' : 'black',

            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 20,
            fontWeight: 'bold',

        },
    })
    useEffect(() => {
            loadPosts();

    }, [page]);
    const loadPosts = async () => {

            console.log("currentPage",page)
            const posts_data = await dispatch(fetchAllPosts({
                searchtext: "",
                role_id:0,
                posttype: "photos",
                category: "ban",
                orientation: null,
                license: null,
                limit: null,
                sort: null,
                page:page,
            }));
            if (posts_data.meta.requestStatus === 'fulfilled') {
                // console.log("posts_data.payload",posts_data.payload)
                // Получаем посты из payload
                const newPosts: Posts[] = posts_data.payload;


                if (newPosts) {
                    console.log(refreshing)
                    // // Фильтруем новые посты, чтобы избежать дубликатов по id
                    // const uniquePosts = newPosts.filter((newPost: Posts) =>
                    //     !posts.some(existingPost => existingPost._id === newPost._id)
                    // );
                    //
                    // // Если есть уникальные посты, добавляем их и увеличиваем страницу
                    // if (uniquePosts.length > 0) {
                    //     setPosts(prevPosts => [...prevPosts, ...uniquePosts]);
                    //     // setPage(prevPage => prevPage + 1);
                    //
                    // } else {
                    //     console.log("no unique posts")
                    //     // Если уникальных постов нет, увеличиваем номер страницы
                    //     // setPage(prevPage => prevPage + 1);
                    // }
                    if (refreshing) {
                        // Если обновляем, просто заменяем все посты
                        setPosts(newPosts);
                        console.log("refresh");
                        setRefreshing(false);
                    } else {
                        // Фильтруем новые посты, чтобы избежать дубликатов по id
                        const uniquePosts = newPosts.filter((newPost: Posts) =>
                            !posts.some(existingPost => existingPost._id === newPost._id)
                        );

                        // Если есть уникальные посты, добавляем их
                        if (uniquePosts.length > 0) {
                            setPosts(prevPosts => [...prevPosts, ...uniquePosts]);
                        } else {
                            console.log("no unique posts");
                        }
                    }
                }

                // // Обновляем состояние posts
                // if (newPosts) {
                //     // Фильтруем новые посты, чтобы избежать дубликатов по id
                //     const uniquePosts = newPosts.filter((newPost:Posts) =>
                //         !posts.some(existingPost => existingPost._id === newPost._id)
                //     );
                //
                //     // Обновляем состояние posts, добавляя только уникальные посты
                //     setPosts(prevPosts => [...prevPosts, ...uniquePosts]);
                // }
            }


    };

    const loadTest = () => {
        console.log("liadinnaoinosjdflkdsf")
        setPage(page+ 1);

    }

    const onRefresh = () => {
        setRefreshing(true);
        console.log(refreshing)
        // setPosts([]); // Очищаем посты
        // setPosts([]); // Очищаем посты
        // setPosts([]); // Очищаем посты
        setPosts([]); // Очищаем посты
        setPage(0); // Сбрасываем страницу
        loadPosts(); // Загружаем посты
        // setRefreshing(false); // Сбрасываем состояние обновления
    };
    const getItem = (data, index) => {
        return data[index];
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
            {/*{*/}
            {/*    posts.length > 0 ? (*/}
            {/*        <VirtualizedList*/}
            {/*            data={posts}*/}
            {/*            getItemCount={() => posts.length}*/}
            {/*            getItem={getItem}*/}
            {/*            renderItem={({ item }: { item: Posts }) => (*/}
            {/*                <TouchableOpacity*/}
            {/*                >*/}
            {/*                    <Post key={item._id}*/}
            {/*                          imageUrl={item.imageurl}*/}
            {/*                          altText={item.text}*/}
            {/*                          fullname={item.fullname}*/}
            {/*                          avatarurl={item.avatarurl}*/}
            {/*                          user_id={item.user_id}*/}
            {/*                          _id={item._id}*/}
            {/*                          license={item.license}*/}
            {/*                          hirevalue={item.hirevalue}*/}
            {/*                          likedByUser={item.likedByUser}*/}
            {/*                          banned={item.banned}*/}

            {/*                    />*/}
            {/*                </TouchableOpacity>*/}
            {/*            )}*/}
            {/*            keyExtractor={(item) => item._id}*/}
            {/*        />*/}
            {/*    )  : (*/}
            {/*        <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 8 }}>Вы не cоздавали посты</Text>*/}
            {/*    )*/}
            {/*}*/}
            {refreshing && status === Status.LOADING? ( // Проверяем состояние загрузки
                <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 8 }}>Загрузка...</Text>
            ) : status === Status.ERROR ? ( // Проверяем наличие ошибки
                <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 8 }}>error</Text>
            ) : posts.length > 0 && Status.SUCCESS ? (
                <VirtualizedList
                    data={posts}
                    getItemCount={() => posts.length}
                    getItem={getItem}
                    renderItem={({ item }: { item: Posts }) => (
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
                                  likedByUser ={item.likedByUser }
                                  banned={item.banned}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item._id}
                />
            ) : (
                <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 8 }}>No post left</Text>
            )}
                <Button color={currentTheme === "dark" ? 'white' : "black"} title={t('loadMore')} onPress={() => loadTest()}/>
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
