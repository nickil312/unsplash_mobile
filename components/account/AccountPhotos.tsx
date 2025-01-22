import {
    View,
    Text,
    useColorScheme,
    RefreshControl,
    TouchableOpacity,
    FlatList,
    VirtualizedList,
    StyleSheet, ActivityIndicator, Button
} from "react-native";
// import {AccountPhotosSkeleton} from "../AccountPhotosSkeleton";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {Posts, Status} from "@/globalRedux/posts/types";
import Post from "@/components/miniPost/Post";
import {fetchPosts_Likes_coll_another_user} from "@/globalRedux/posts/asyncActions";
import theme from "tailwindcss/defaultTheme";

export default function AccountPhotos ({id}: {id: string}) {
    const currentTheme = useColorScheme()
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const {items, status} = useSelector((state: RootState) => state.posts.posts_another_user);

    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation()
    const {t} = useTranslation();


    const [page, setPage] = useState<number>(0);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Состояние для отслеживания загрузки


    const styles = StyleSheet.create({
        title: {
            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 20,
            fontWeight: 'bold',

        },
    })
    useEffect(() => {
        if (data !== null) {
            loadPosts();
        }
    }, [page]);

    const loadTest = () => {
        console.log("liadinnaoinosjdflkdsf")
        setPage(page+ 1);

    }
    const loadPosts = async () => {
        if (data !== null ) { // Проверяем, что не идет загрузка

            console.log("currentPage",page)
        const posts_data = await dispatch(fetchPosts_Likes_coll_another_user({
            bdType: "photos",
            page:page,
            userIdAccViewed: data._id
        }));
            if (posts_data.meta.requestStatus === 'fulfilled') {
                // Получаем посты из payload
                const newPosts: Posts[] = posts_data.payload.posts;


                if (newPosts) {
                    // Фильтруем новые посты, чтобы избежать дубликатов по id
                    const uniquePosts = newPosts.filter((newPost: Posts) =>
                        !posts.some(existingPost => existingPost._id === newPost._id)
                    );

                    // Если есть уникальные посты, добавляем их и увеличиваем страницу
                    if (uniquePosts.length > 0) {
                        setPosts(prevPosts => [...prevPosts, ...uniquePosts]);
                        // setPage(prevPage => prevPage + 1);

                    } else {
                        // Если уникальных постов нет, увеличиваем номер страницы
                        // setPage(prevPage => prevPage + 1);
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

        }
    };

    const getItem = (data, index) => {
        return data[index];
    };
    const handleLoadMore = () => {
        // Увеличиваем номер страницы и загружаем посты
        // setPage(prevPage => {
        //     const newPage = prevPage + 1;
        //     loadPosts(newPage); // Передаем новый номер страницы в loadPosts
        //     return newPage;
        // });


            loadPosts();

    };
    const renderLoader = () =>{
        return(
            <View>
                <ActivityIndicator size="large" color="#767676" />
            </View>
        )

    }
    return (
        <View>
            <Text style={styles.title} className={" dark:color-white color-black"} >
                {t('Photos')}
            </Text>
            {
                posts.length > 0 ? (
                    <VirtualizedList
                        style={{ marginTop: 15 }}
                        data={posts}
                        getItemCount={() => posts.length}
                        getItem={getItem}
                        renderItem={({ item: post }) => (
                            <TouchableOpacity
                                // onPress={() => navigation.navigate("FullPost", {
                                //     id: post._id,
                                //     likedList: post.likedBy,
                                //     user_id_get: post.user_id
                                // })}
                            >
                                <Post key={post._id} img={post.imageurl} Cardtitle={post.title} Creator={post.text} />
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item._id}
                        // ListFooterComponent={renderLoader}
                        // onEndReached={loadTest}
                        // onEndReachedThreshold={20}

                    />
                ) : (
                    <Text style={{ marginLeft: 15, fontSize: 16, marginTop: 8 }}>Вы не cоздавали посты</Text>
                )
            }
            <View className={""}>
                <Button color={currentTheme === "dark" ? 'white' : "black"} title={t('loadMore')} onPress={() => loadTest()}/>
            </View>
            {status === Status.LOADING && <Text>Загрузка...</Text>}
            {/*{*/}
            {/*    items !== null && status === Status.SUCCESS ? (*/}


            {/*        items.posts.length !== 0 ? (*/}
            {/*            <VirtualizedList*/}
            {/*                style={{marginTop: 15}}*/}
            {/*                data={items.posts}*/}
            {/*                getItemCount={() => items.posts.length}*/}
            {/*                getItem={getItem}*/}
            {/*                renderItem={({item: post}) => (*/}
            {/*                    <TouchableOpacity*/}
            {/*                    //     onPress={() => navigation.navigate("FullPost", {*/}
            {/*                    //     id: post._id,*/}
            {/*                    //     likedList: post.likedBy,*/}
            {/*                    //     user_id_get: post.user_id*/}
            {/*                    // })}*/}
            {/*                    >*/}
            {/*                        <Post key={post._id} img={post.imageurl} Cardtitle={post.title}*/}
            {/*                            /*Creator={photos.user.fullName}*/ /*Creator={post.text}/>*/}
            {/*                    </TouchableOpacity>)}*/}
            {/*                keyExtractor={(item) => item._id}*/}
            {/*            />*/}
            {/*        ) : (*/}
            {/*            <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Вы не cоздавали посты</Text>*/}

            {/*        )*/}

            {/*    ) : (*/}
            {/*        // <AccountPhotosSkeleton style={{*/}
            {/*        //     marginTop: 15*/}
            {/*        // }}/>*/}
            {/*        <Text>zagruzka</Text>*/}
            {/*    )*/}
            {/*}*/}

        </View>
    )
}