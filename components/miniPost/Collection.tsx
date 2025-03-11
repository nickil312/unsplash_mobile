import {Image, StyleSheet, Text, useColorScheme, View} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {Link} from "expo-router";
import React from "react";
import {Collections, Three_Photos} from "@/globalRedux/posts/types";
import {useSelector} from "react-redux";
import {RootState} from "@/globalRedux/store";
import {useTranslation} from "react-i18next";

export default function Collection({_id,last_three_posts,Isprivate,name,deleted,total_photos}:{_id:string,last_three_posts:Three_Photos[] | null,Isprivate:boolean,name:string,deleted:boolean,total_photos:string}) {
    const {api_url} = useSelector((state: RootState) => state.users);
    const currentTheme = useColorScheme()
    const {t} = useTranslation();

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

    return(
        <Link href={`/collectionsmodal/${_id}`}>
            <View style={styles.container}>
                <View style={styles.photosContainer}>
                    {last_three_posts !== null && last_three_posts.length > 0 ? (
                        <>

                            {last_three_posts[0] !== null ? (
                                <Image
                                    source={{uri: `${api_url}/${last_three_posts[0].imageurl}`}} // Путь к изображению
                                    style={styles.Firstphoto}
                                />
                            ) : (
                                <View style={styles.Firstplaceholder}/>
                            )}
                            {last_three_posts.length > 1 && last_three_posts[1] !== null ? (
                                <Image
                                    source={{uri: `${api_url}/${last_three_posts[1].imageurl}`}} // Путь к изображению
                                    style={styles.Secondphoto}
                                />
                            ) : (
                                <View style={styles.Secondplaceholder}/>
                            )}
                            {last_three_posts.length > 2 && last_three_posts[2] !== null ? (
                                <Image
                                    source={{uri: `${api_url}/${last_three_posts[2].imageurl}`}} // Путь к изображению
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
                        Isprivate && (
                            <FontAwesome style={{marginRight: 5}} name="lock" size={14}
                                         color={`${currentTheme === "dark" ? 'white' : "black"}`}/>
                        )
                    }
                    <Text style={{fontSize: 18,
                        color: currentTheme === 'dark' ? 'white' : 'black',
                    }}>{name}</Text>

                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Text style={{color: "grey"}}>{total_photos}</Text>
                    <Text style={{marginLeft: 5, color: "grey"}}>{t("photos")}</Text>
                    {
                        deleted && (
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
    )
}