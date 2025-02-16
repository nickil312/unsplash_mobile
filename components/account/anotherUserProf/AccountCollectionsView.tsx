import {
    View,
    Text,
    useColorScheme,
    ScrollView,
    StyleSheet,
    VirtualizedList,
    TouchableOpacity,
    Button, Image
} from "react-native";
import {useTranslation} from "react-i18next";
import {Collections, Posts, Status} from "@/globalRedux/posts/types";
import Post from "@/components/miniPost/Post";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {fetchPosts_Likes_coll_another_user} from "@/globalRedux/posts/asyncActions";
import {Link, useLocalSearchParams} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";

export const AccountCollectionsView = () => {
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const {api_url} = useSelector((state: RootState) => state.users);
    const {status} = useSelector((state: RootState) => state.posts.posts_another_user);
    const {id} = useLocalSearchParams();


    const [page, setPage] = useState<number>(0);
    const [posts, setPosts] = useState<Collections[]>([]);

    const styles = StyleSheet.create({
        title: {
            color: currentTheme === 'dark' ? 'white' : 'black',

            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 20,
            fontWeight: 'bold',

        },
        container: {
            padding: 10,
            width: "100%",
            // backgroundColor: "#A9A9A9",


        },
        photosContainer: {
            flexDirection: 'row',
            // marginTop: 10,
            gap: 1
        },
        photoWrapper: {
            width: '33%', // Ширина каждой фотографии 33%
            padding: 5,
        },
        Firstphoto: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            borderTopLeftRadius: 5, // Закругляем верхний левый угол
        },
        Secondphoto: {
            width: '33%',
            height: 100, // Установите желаемую высоту
        },
        Thirdphoto: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            borderTopRightRadius: 5, // Закругляем верхний правый угол

        },
        Firstplaceholder: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            backgroundColor: 'grey', // Серый цвет для заполнителя
            borderTopLeftRadius: 5, // Закругляем верхний левый угол

        },
        Secondplaceholder: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            backgroundColor: 'grey', // Серый цвет для заполнителя

        },
        Thirdplaceholder: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            borderTopRightRadius: 5, // Закругляем верхний правый угол
            backgroundColor: 'grey', // Серый цвет для заполнителя


        },
    })

    const loadPosts = async () => {

        console.log("currentPage", page)
        const posts_data = await dispatch(fetchPosts_Likes_coll_another_user({
            bdType: "collections",
            page: page,
            userIdAccViewed: id
        }));
        if (posts_data.meta.requestStatus === 'fulfilled') {
            // Получаем посты из payload
            const newPosts: Collections[] = posts_data.payload.collections;

            if (newPosts) {
                // Фильтруем новые посты, чтобы избежать дубликатов по id
                const uniquePosts = newPosts.filter((newPost: Collections) =>
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


    };

    useEffect(() => {
        loadPosts();

    }, [page]);

    const loadTest = () => {
        console.log("liadinnaoinosjdflkdsf")
        setPage(page + 1);

    }
    const getItem = (data, index) => {
        return data[index];
    };


    return (
        // <View>

        <View>
            <Text style={styles.title} className={" dark:color-white color-black"}>
                {t('Collections')}
            </Text>

            {
                posts.length > 0 ? (
                    <VirtualizedList
                        style={{marginTop: 15}}
                        data={posts}
                        getItemCount={() => posts.length}
                        getItem={getItem}
                        renderItem={({item}: { item: Collections }) => (
                            <TouchableOpacity
                                // onPress={() => navigation.navigate("FullPost", {
                                //     id: post._id,
                                //     likedList: post.likedBy,
                                //     user_id_get: post.user_id
                                // })}
                            >
                                {/*href={`/(tabs)/(profile)/collectionsmodal/${item._id}`}*/}
                                <Link href={`/collectionsmodal/${item._id}`}>
                                    <View style={styles.container}>
                                        <View style={styles.photosContainer}>
                                            {item.last_three_posts !== null && item.last_three_posts.length > 0 ? (
                                                <>

                                                    {item.last_three_posts[0] !== null ? (
                                                        <Image
                                                            source={{uri: `${api_url}/${item.last_three_posts[0].imageurl}`}} // Путь к изображению
                                                            style={styles.Firstphoto}
                                                        />
                                                    ) : (
                                                        <View style={styles.Firstplaceholder}/>
                                                    )}
                                                    {item.last_three_posts.length > 1 && item.last_three_posts[1] !== null ? (
                                                        <Image
                                                            source={{uri: `${api_url}/${item.last_three_posts[1].imageurl}`}} // Путь к изображению
                                                            style={styles.Secondphoto}
                                                        />
                                                    ) : (
                                                        <View style={styles.Secondplaceholder}/>
                                                    )}
                                                    {item.last_three_posts.length > 2 && item.last_three_posts[2] !== null ? (
                                                        <Image
                                                            source={{uri: `${api_url}/${item.last_three_posts[2].imageurl}`}} // Путь к изображению
                                                            style={styles.Thirdphoto}
                                                        />
                                                    ) : (
                                                        <View style={styles.Thirdplaceholder}/>
                                                    )}
                                                </>

                                            ) : (
                                                <>
                                                    <View style={styles.Firstplaceholder}/>
                                                    <View style={styles.Secondplaceholder}/>
                                                    <View style={styles.Thirdplaceholder}/>
                                                </>

                                            )
                                            }

                                        </View>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: "row",
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            marginTop: 5
                                        }}>
                                            {
                                                item.private && (
                                                    <FontAwesome style={{marginRight: 5}} name="lock" size={14}
                                                                 color={`${currentTheme === "dark" ? 'white' : "black"}`}/>
                                                )
                                            }
                                            <Text style={{fontSize: 18}}>{item.name}</Text>

                                        </View>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: "row",
                                            justifyContent: 'flex-start',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{color: "grey"}}>{item.total_photos}</Text>
                                            <Text style={{marginLeft: 5, color: "grey"}}>{t("photos")}</Text>
                                            {
                                                item.deleted && (
                                                    <Text style={{
                                                        marginLeft: 5,
                                                        color: "white",
                                                        backgroundColor: "red",
                                                        paddingLeft: 4,
                                                        paddingRight: 4,
                                                        borderRadius: 3
                                                    }}>{t("deleted")}</Text>
                                                )
                                            }
                                        </View>
                                    </View>
                                </Link>
                                {/*<Post key={item._id}*/}
                                {/*      imageUrl={item.imageurl}*/}
                                {/*      altText={item.text}*/}
                                {/*      fullname={item.fullname}*/}
                                {/*      avatarurl={item.avatarurl}*/}
                                {/*      user_id={item.user_id}*/}
                                {/*      _id={item._id}*/}
                                {/*      license={item.license}*/}
                                {/*      hirevalue={item.hirevalue}*/}
                                {/*      likedByUser={item.likedByUser}*/}
                                {/*      banned={item.banned}*/}

                                {/*/>*/}
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item._id}
                        // ListFooterComponent={renderLoader}
                        // onEndReached={loadTest}
                        // onEndReachedThreshold={20}

                    />
                ) : (
                    <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Вы не cоздавали коллекции</Text>
                )
            }
            <View className={""}>
                <Button color={currentTheme === "dark" ? 'white' : "black"} title={t('loadMore')}
                        onPress={() => loadTest()}/>
            </View>
            {status === Status.LOADING && <Text>Загрузка...</Text>}

        </View>
        // </View>
    )
}