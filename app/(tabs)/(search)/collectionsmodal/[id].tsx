import {
    View,
    Text,
    VirtualizedList,
    TouchableOpacity,
    Button,
    useColorScheme,
    SafeAreaView,
    Image,
    StyleSheet, TextInput, Switch, Alert
} from "react-native";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useTranslation} from "react-i18next";
import {fetchCollectionsDetail} from "@/globalRedux/users/asyncActions";
import {Link, useLocalSearchParams} from "expo-router";
import {Collections, CollectionUpdateForm, Posts, Status} from "@/globalRedux/posts/types";
import Post from "@/components/miniPost/Post";
import {fetchDeleteOrRecoverCollection, fetchPosts_Likes_coll_another_user} from "@/globalRedux/posts/asyncActions";
import {truncateText} from "@/components/func/truncateText";
import {FontAwesome} from "@expo/vector-icons";
import {Controller, useForm} from "react-hook-form";
import Constants from "expo-constants";
import {AccountEditProfile} from "@/globalRedux/users/types";
import EditDeleteForm from "@/components/collection/EditDeleteForm";

export default function CollectionsModal() {
    const [page, setPage] = useState<number>(0);
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const {id} = useLocalSearchParams();
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [collectionData, setCollectionData] = useState<Collections>();
    const currentTheme = useColorScheme()
    const {items, status} = useSelector((state: RootState) => state.users.collectionsDetail);


    useEffect(() => {
        loadPosts();

    }, [page]);

    const loadTest = () => {
        console.log("liadinnaoinosjdflkdsf")
        setPage(page + 1);

    }

    const loadPosts = async () => {

        // console.log("currentPage", page)
        const posts_data = await dispatch(fetchCollectionsDetail({
            _id: id,
            limit: '',
            page: page,
        }))
        if (posts_data.meta.requestStatus === 'fulfilled') {
            // Получаем посты из payload
            const newPosts: Posts[] = posts_data.payload.posts;
            // console.log("posts_data", posts_data)
            setCollectionData(posts_data.payload.collection)
            if (newPosts) {
                // Фильтруем новые посты, чтобы избежать дубликатов по id
                const uniquePosts = newPosts.filter((newPost: Posts) =>
                    !posts.some(existingPost => existingPost._id === newPost._id)
                );

                // Если есть уникальные посты, добавляем их и увеличиваем страницу
                if (uniquePosts.length > 0) {
                    setPosts(prevPosts => [...prevPosts, ...uniquePosts]);

                } else {

                }
            }


        }
    };
    const getItem = (data, index) => {
        return data[index];
    };

    const styles = StyleSheet.create({
        userAva: {
            width: 32,
            height: 32,
            borderRadius: 16, // Устанавливаем радиус, равный половине ширины и высоты, чтобы сделать изображение круглым
            marginRight: 8,
        },
        container: {
            flexDirection: 'row', // Устанавливаем направление в строку
            alignItems: 'center', // Центрируем элементы по вертикали
            padding: 4
        },
        formcontainer: {
            flex: 1,
            justifyContent: 'center',
            paddingTop: Constants.statusBarHeight,
            padding: 8,
            // backgroundColor: '#0e101c',
        },
        input: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? 'white' : 'black',
            borderBottomStyle: 'solid',
            height: 40,
            width: '100%',
            padding: 10,
            borderRadius: 4,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        label: {
            color: currentTheme === "dark" ? 'white' : 'black',
            marginLeft: 0,
            marginTop: 15,
            marginBottom: -10
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
        button: {
            marginTop: 40,
            height: 40,
            backgroundColor: '#d2d2d2',
            borderRadius: 4,
            width: '100%',
        },
        deletebutton: {
            marginTop: 10,
            height: 40,
            backgroundColor: '#d2d2d2',
            borderRadius: 4,
            width: '100%',
        },
    });
    const [isEditing, setIsEditing] = useState(false);
    const onSubmit = async (id: string, recover: boolean) => {
        console.log("delete")
        dispatch(fetchDeleteOrRecoverCollection({
            id: id,
            recover: recover
        }))
            .then((response) => {
                console.log(response)
                if (response.meta.requestStatus === 'rejected') {
                    // console.log("Request failed")
                    // setSendResponseErrorImage(true)
                } else if (response.meta.requestStatus === 'fulfilled') {
                    // console.log("Request fulfilled")
                    if (recover) {
                        Alert.alert(t('Recovered collection'));
                        // setSuccessRecover(true);
                    } else if (!recover) {
                        Alert.alert(t('Deleted collection'));
                        // setSuccessDelete(true);
                    }
                    // router.push(`/${lang}`);
                    // setSuccessImageChange(true)
                }
                // handle success response
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const Header = () => {
        return (
            <>
                {
                    collectionData !== undefined ? (
                        <View style={{padding: 10, gap: 10}}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5
                            }}>
                                {
                                    collectionData.private && (
                                        <FontAwesome name="lock" size={14}
                                                     style={{color: `${currentTheme === "dark" ? "white" : "black"}`}}/>

                                    )
                                }
                                <Text style={{
                                    fontSize: 30,
                                    color: `${currentTheme === "dark" ? 'white' : "black"}`
                                }}>{collectionData.name}</Text>

                            </View>
                            {
                                collectionData.description === "" ? (
                                    <></>
                                ) : (
                                    <Text>{collectionData.description}</Text>

                                )
                            }
                            <Link href={`/(tabs)/(profile)/users/${collectionData.user_id}`}>


                                <View style={styles.container}>
                                    {/*<Text style={[styles.cardTitle, {color: currentTheme === 'dark' ? '#FFF' : '#000'}]}>*/}
                                    {/*    {truncateTitle(Cardtitle)}*/}
                                    {/*</Text>*/}
                                    <Image
                                        source={{uri: `${api_url}/${collectionData.avatarurl}`}}
                                        style={styles.userAva}/>

                                    <Text style={{color: `${currentTheme === "dark" ? 'white' : "black"}`}}>
                                        {
                                            truncateText(`${collectionData.fullname}`, 29)
                                        }
                                    </Text>


                                </View>
                            </Link>
                            <Text
                                style={{color: `${currentTheme === "dark" ? 'white' : "black"}`}}>{collectionData.total_photos} {t('images')}</Text>
                            {
                                collectionData.deleted && (
                                    <Text style={{
                                        marginLeft: 5,
                                        color: "white",
                                        backgroundColor: "red",
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                        borderRadius: 3,
                                        width: 60
                                    }}>{t("deleted")}</Text>)
                            }

                            {
                                (data !== null && collectionData.user_id === data._id) && (
                                    isEditing ? (
                                        <View>
                                            <EditDeleteForm id={collectionData._id} name={collectionData.name}
                                                            description={collectionData.description}
                                                            privateStatus={collectionData.private}/>
                                            {
                                                collectionData.deleted && (

                                                        <Button
                                                            color="red"
                                                            title={t('Recover collection')}
                                                            onPress={() => onSubmit(collectionData._id, true)}
                                                        />
                                                )
                                            }
                                            {
                                                !collectionData.deleted && (

                                                        <Button
                                                            color="red"
                                                            title={t('Delete')}
                                                            onPress={() => onSubmit(collectionData._id, false)}
                                                        />
                                                )
                                            }
                                            <Button title={t('Cancel')} onPress={() => setIsEditing(false)}/>
                                        </View>

                                    ) : (
                                        <View>
                                            <Button title={t('Edit')} onPress={() => setIsEditing(true)}/>
                                        </View>
                                    )
                                )
                            }

                        </View>
                    ) : (
                        <Text>Loading</Text>
                    )
                }
            </>
        )
    }
    const endList = () => {
        return (
            <>
                <View className={""}>
                    <Button color={currentTheme === "dark" ? 'white' : "black"} title={t('loadMore')}
                            onPress={() => loadTest()}/>
                </View>
                {status === Status.LOADING && <Text>Загрузка...</Text>}

            </>
        )
    }

    return (
        <SafeAreaView>

            {
                posts.length > 0 ? (
                    <>

                        <VirtualizedList
                            style={{}}
                            data={posts}
                            getItemCount={() => posts.length}
                            getItem={getItem}
                            renderItem={({item}: { item: Posts }) => (
                                <TouchableOpacity
                                    // onPress={() => navigation.navigate("FullPost", {
                                    //     id: post._id,
                                    //     likedList: post.likedBy,
                                    //     user_id_get: post.user_id
                                    // })}
                                >
                                    {/*<PostCard*/}
                                    {/*    key={post._id}*/}
                                    {/*    _id={post._id}*/}
                                    {/*    fullname={post.fullname}*/}
                                    {/*    avatarurl={`${api_url}/${post.avatarurl}`}*/}
                                    {/*    user_id={post.user_id}*/}
                                    {/*    altText={post.imageurl}*/}
                                    {/*    imageUrl={`${api_url}/${post.imageurl}`}*/}
                                    {/*    lang={""}*/}
                                    {/*    likedByUser={post.likedByUser}*/}
                                    {/*    license={post.license}*/}
                                    {/*    hirevalue={post.hirevalue}*/}
                                    {/*    banned={post.banned}*/}
                                    {/*/>*/}
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
                            ListFooterComponent={endList}
                            ListHeaderComponent={Header}
                            // onEndReached={loadTest}
                            // onEndReachedThreshold={20}


                        />


                    </>
                ) : (
                    <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>В коллекции нет записей</Text>
                )
            }

        </SafeAreaView>
    )
}