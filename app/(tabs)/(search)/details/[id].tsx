import {
    Text,
    useColorScheme,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    View,
    Image,
    Button, TouchableOpacity, Alert
} from "react-native";
import {Link, useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useDispatch, useSelector} from "react-redux";
import {fetchDeletePost, fetchOnePost} from "@/globalRedux/posts/asyncActions";
import {AntDesign, Feather, Ionicons} from "@expo/vector-icons";
import {DownloadImage} from "@/components/func/DownloadImage";
import i18next from "@/i18n";
import LikeDisChange from "@/components/func/LikeDisChange";
import {Status} from "@/globalRedux/posts/types";
import {truncateText} from "@/components/func/truncateText";

export default function PostDetail() {
    const {id} = useLocalSearchParams();
    const {t} = useTranslation();
    const currentTheme = useColorScheme()
    const [isLoading, setIsLoading] = useState(false);
    const {items, status} = useSelector((state: RootState) => state.posts.onePost);
    const {data, api_url} = useSelector((state: RootState) => (state.users))
    const dispatch = useDispatch<AppDispatch>();
    const [liked, setLiked] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0}); // Состояние для хранения ширины и высоты изображения
    const router = useRouter();

    const styles = StyleSheet.create({
        postText: {
            fontSize: 18,
            lineHeight: 24,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        miniText: {
            fontSize: 14,
            marginTop: 5,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        miniTitle: {
            fontSize: 12,
            marginTop: 8,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        postImage: {
            borderRadius: 10,
            width: "100%",
            height: imageDimensions.height > 0 ? imageDimensions.height / 3 : 400, // Убедитесь, что изображение занимает всю высоту карточки
            marginBottom: 20
        },
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
        tagsContainer: {
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        tag: {
            backgroundColor: '#d0cece',
            borderRadius: 4,
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginHorizontal: 5,
        },
        // likeBut: {
        //     flexDirection: 'row',
        //     alignItems: 'flex-start',
        //     justifyContent: 'center',
        // }
    });


    useEffect(() => {
        // 2 запроса один ток 1 с id для того чтобы
        // определить на сервере лайкнул или нет и
        // потом еще коллекции подлючаться
        // console.log("use Effect")
        if (data !== null) {
            console.log("data !== null")
            // console.log("post id",id)
            const params = {
                _id: id,
                user_id: data._id,
            }
            // console.log("params",params)

            dispatch(fetchOnePost(params))
                .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        console.log("Request failed")

                    } else if (response.meta.requestStatus === 'fulfilled') {
                        console.log("Request fulfilled")

                        const {payload} = response;
                        // console.log("payload",payload)
                        if (payload !== null) {
                            // console.log("payload", payload);
                            const payloadData = payload as {
                                likedByUser: boolean;
                            };
                            const {
                                likedByUser,
                            } = payloadData;
                            setLiked(likedByUser);

                        }
                    }
                    // handle success response
                })
                .catch((error) => {
                    console.log(error)

                })
        } else {
            console.log("data null")
            // console.log("post id",id)

            const params = {
                _id: id,
                user_id: ""
            }
            // console.log("params",params)

            dispatch(fetchOnePost(params))
                .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        console.log("Request failed")

                    } else if (response.meta.requestStatus === 'fulfilled') {
                        console.log("Request fulfilled")
                    }
                    // handle success response
                })
                .catch((error) => {
                    console.log(error)

                })
        }

    }, [])


    const ChangeLike = () => {
        if (data !== null && items !== null) {

            LikeDisChange({
                likeValue: liked,
                _id: items._id
            })
            setLiked(!liked)
        }
    }
    useEffect(() => {
        // Получаем размеры изображения
        if (items !== null) {

            Image.getSize(`${api_url}/${items?.imageurl}`, (width, height) => {
                setImageDimensions({width, height}); // Устанавливаем ширину и высоту в состояние
                console.log(width, height);
            }, (error) => {
                console.error("Error loading image: ", error);
            });
        }
    }, [items, api_url]);


    if (status === Status.LOADING) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {/*<Loading/>*/}
                <Text>Loading</Text>
            </View>
        );
    }

    if (items !== null) {
        return (
            <ScrollView
                // refreshControl={
                // <RefreshControl refreshing={isLoading} onRefresh={onRefresh}/>}
            >
                <View style={{padding: 20}}>

                    <Image style={styles.postImage} source={{uri: `${api_url}/${items.imageurlFull}`}}/>


                    <View style={styles.view}>
                        <Text style={styles.postText}>{truncateText(`${items.title}`, 15)}</Text>
                        <Text style={styles.postText}>{t('Views')}: {items.viewscount}</Text>
                    </View>
                    {
                        // Подправил items.user
                        data !== null && items.user_id === data._id ? (
                            <>
                                <View style={styles.view}>

                                    {/*navigation.navigate("CreatePost",{id: id})*/}
                                    {/*<View style={styles.button} onTouchEndCapture={() => navigation.navigate('AddNav',{screen: 'CreatePost', params:{id: id} })}>*/}
                                    <View style={styles.button}
                                        // onTouchEndCapture={() => navigation.navigate('ChangePost', {id: id})}
                                    >
                                        <Button title={t('Edit')} color="black"/>
                                    </View>
                                    <View style={styles.button}
                                        // onTouchEndCapture={() => DeletePost()}
                                    >
                                        <Button title={t('Delete')} onPress={() => {
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
                                                        text: "OK" ,
                                                        onPress: () => {
                                                            const params = {
                                                                _id: id
                                                            };
                                                            dispatch(fetchDeletePost(params));
                                                            // router.push(`/${lang}`);
                                                        }
                                                    }
                                                ],
                                                { cancelable: false } // Не позволяет закрыть окно, нажав вне его
                                            );
                                        }} color="red"/>
                                    </View>

                                </View>
                                {/*<View style={styles.view}>*/}
                                {/*    <Link href={`/(tabs)/(profile)/details/statistics/${id}`}>*/}
                                <View style={styles.ban_button}
                                    // onTouchEndCapture={() => navigation.navigate('BanPost', {id: id})}
                                >

                                    <Button onPress={() => {
                                        router.push(`/details/statistics/${id}`)
                                    }} title={t('Statistics')} color="black"/>
                                </View>
                                    {/*</Link>*/}
                                {/*</View>*/}
                            </>
                        ) : (
                            <></>
                        )
                    }
                    {/*<PostText>{user_data_get._id} </PostText>*/}
                    {/*<PostText>{userData._id} </PostText>*/}
                    {/*<PostText>{userData.user_role_id} </PostText>*/}
                    {
                        data !== null ? (


                            data.user_role_id === 1 && data._id !== data._id ? (

                                <View style={styles.view}>
                                    <View style={styles.ban_button}
                                        // onTouchEndCapture={() => navigation.navigate('BanPost', {id: id})}
                                    >
                                        <Button title={t('Ban Post')} color="red"/>
                                    </View>
                                </View>


                            ) : data.user_role_id === 2 && data._id !== data._id ? (
                                <View style={styles.view}>
                                    <View style={styles.ban_button}
                                        // onTouchEndCapture={() => navigation.navigate('ReportPost', {id: id})}
                                    >
                                        <Button title={t('Report Post')} color="red"/>
                                    </View>
                                </View>
                            ) : (
                                <>
                                </>
                            )
                        ) : (
                            <>
                            </>
                        )
                    }


                    <View style={styles.data}>
                        {/*<AntDesign style={{marginTop: 15}} name={name} size={36}*/}
                        {/*           color={currentTheme === "dark" ? 'white' : "black"}*/}
                        {/*           // onPress={() => ChangeMethod()}*/}
                        {/*/>*/}

                        {liked ? (
                            <TouchableOpacity onPress={ChangeLike}>
                                {/*// лайк стоит*/}
                                {/*    onPress={ChangeLike}*/}
                                <View className={"color-red-500 w-fit"} style={styles.firstItem}>
                                    <AntDesign name="like1" size={30}
                                               color={currentTheme === "dark" ? 'white' : 'black'}/>
                                </View>

                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={ChangeLike}>

                                <View className={"color-red-500 "} style={styles.firstItem}>
                                    <AntDesign name="like2" size={30}
                                               color={currentTheme === "dark" ? 'white' : 'black'}/>
                                </View>
                            </TouchableOpacity>

                        )}

                        <Ionicons onPress={() => DownloadImage(items?.imageurlFull, items.title, items._id, api_url)}
                                  style={styles.item} name="download-outline"
                                  size={36}
                                  color={currentTheme === "dark" ? 'white' : "black"}/>
                        <View style={styles.item}>
                            <Link href={{
                                pathname: '/addtocollection/[id]',
                                params: {id:items._id,imageUrl:items.imageurl}
                            }} >

                                <Feather name="plus" size={36}
                                         color={currentTheme === "dark" ? 'white' : "black"}/>
                            </Link>
                        </View>

                    </View>
                    <Text style={styles.miniText}
                        // style={{marginTop: 5}}
                        //       color={currentTheme === "dark" ? 'white' : "black"}
                    >{t('Likes')}: {items.likecount}</Text>
                    <Link href={`/users/${items.user_id}`} style={{marginTop:5}}>

                        <View
                            // onTouchEndCapture={() => navigation.navigate("AccountView", {user_id: user_data_get._id})}
                            style={{
                                flexDirection: 'row',
                                justifyContent: "flex-start",
                                alignItems: "center",
                                marginTop: 5
                            }}>

                            <Feather name="user" size={24} color={currentTheme === "dark" ? 'white' : "black"}/>
                            <Text style={styles.miniText}
                                // style={{marginTop: 5, marginLeft: 5}}
                                //   color={currentTheme === "dark" ? 'white' : "black"}
                            >{items.fullname}</Text>
                        </View>
                    </Link>
                    <View style={styles.separator}></View>
                    <Text style={styles.postText}>{t('Details')}</Text>
                    <Text style={styles.miniText}
                        // color={currentTheme === "dark" ? 'white' : "black"}
                    >{items.text}</Text>
                    <View style={styles.tagsContainer}>
                        {items.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text>{tag}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.separator}></View>
                    <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                        {/* Left half */}
                        <View style={{flex: 1, marginRight: 10}}>
                            <Text style={styles.postText}>{t('Camera')}</Text>
                            <Text style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('Camera Company')}</Text>
                            <Text style={styles.miniText}
                                // style={{marginTop: 3}}
                                //     color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{items.cameracompany}</Text>
                            {/* Add more content for the left half as needed */}

                            <Text style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('Model')}</Text>
                            <Text style={styles.miniText}
                                // style={{marginTop: 3}}
                                //     color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{items.model}</Text>
                            <Text style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('ShutterSpeed')}</Text>
                            <Text style={styles.miniText}
                                // style={{marginTop: 3}}
                                //     color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{items.shutterspeed}</Text>
                            <Text style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('Aperture')}</Text>
                            <Text style={styles.miniText}
                                // style={{marginTop: 3}}
                                //     color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{items.aperture}</Text>

                        </View>

                        {/* Common content */}
                        <View style={{marginLeft: 'auto', marginTop: 25}}>
                            <Text
                                style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('FocalLength')}</Text>
                            <Text
                                style={styles.miniText}
                                // style={{marginTop: 3}}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{items.focallength}</Text>
                            <Text
                                style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('Dimensions')}</Text>
                            <Text
                                style={styles.miniText}
                                // style={{marginTop: 3}}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{items.dimensions}</Text>
                            <Text
                                style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('ISO')}</Text>
                            <Text
                                style={styles.miniText}
                                // style={{marginTop: 3}}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{items.isocam}</Text>

                            {/* Add more common content as needed */}

                            <Text style={styles.miniText}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{t('Published')}</Text>
                            <Text style={styles.miniText}
                                // style={{marginTop: 3}}
                                // color={currentTheme === 'dark' ? 'white' : 'black'}
                            >{new Intl.DateTimeFormat(`${i18next.language}`, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).format(new Date(items.createdat))}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

        )
    }
}