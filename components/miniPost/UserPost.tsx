import {View, Text, Image, StyleSheet, useColorScheme} from "react-native";
import {Users} from "@/globalRedux/users/types";
import {Three_Photos} from "@/globalRedux/posts/types";
import {CircleImage} from "@/components/account/CircleImage";
import React from "react";
import {useTranslation} from "react-i18next";

export default function UserPost({
                                     _id,
                                     user_role_id,
                                     fullname,
                                     avatarurl,
                                     banned,
                                     last_three_posts,
                                     hirevalue,
                                     api_url
                                 }: {
    _id: string,
    user_role_id: number,
    fullname: string,
    avatarurl: string,
    banned: boolean,
    last_three_posts: Three_Photos[],
    hirevalue: boolean,
    api_url: string
}) {
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
            marginTop: 10,
            gap: 1
        },
        photoWrapper: {
            width: '33%', // Ширина каждой фотографии 33%
            // padding: 5,
        },
        Firstphoto: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            // borderTopLeftRadius: 5, // Закругляем верхний левый угол
        },
        Secondphoto: {
            width: '33%',
            height: 100, // Установите желаемую высоту
        },
        Thirdphoto: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            // borderTopRightRadius: 5, // Закругляем верхний правый угол

        },
        Firstplaceholder: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            backgroundColor: 'grey', // Серый цвет для заполнителя
            // borderTopLeftRadius: 5, // Закругляем верхний левый угол

        },
        Secondplaceholder: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            backgroundColor: 'grey', // Серый цвет для заполнителя

        },
        Thirdplaceholder: {
            width: '33%',
            height: 100, // Установите желаемую высоту
            // borderTopRightRadius: 5, // Закругляем верхний правый угол
            backgroundColor: 'grey', // Серый цвет для заполнителя


        },
    })

    return (
        <View style={{marginTop:10,marginLeft:10,marginRight:10}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Image
                    style={{height: 75, width: 75, borderRadius: 60}}
                    source={{uri: `${api_url}/${avatarurl}`}}
                />
                {/*<CircleImage img={avatarurl} api_url={api_url}/>*/}
                <View style={{flexDirection:'column',alignItems:'flex-start',marginLeft:10}}>
                    <Text style={{
                        color: currentTheme === 'dark' ? 'white' : 'black',
                    }}>{fullname}</Text>
                    {
                        banned && (

                            <Text style={{
                                color: "white",
                                // width: 50,
                                backgroundColor: "red",
                                paddingRight: 4,
                                paddingLeft: 4,
                                borderRadius: 4
                            }}>
                                Banned
                            </Text>

                        )
                    }
                    {
                        user_role_id === 1 ?(
                            <Text style={{
                                marginTop:4,
                                color: "black",
                                backgroundColor: "#FECACA",
                                paddingRight: 4,
                                paddingLeft: 4,
                                borderRadius: 4
                            }}>
                                Admin
                            </Text>
                        ) : user_role_id === 2 ?(
                            <Text style={{
                                marginTop:4,
                                color: "black",
                                backgroundColor: "#E5E7EB",
                                paddingRight: 4,
                                paddingLeft: 4,
                                borderRadius: 4
                            }}>User</Text>

                        ) : user_role_id === 3 ? (
                            <Text style={{
                                marginTop:4,
                                color: "black",
                                backgroundColor: "#FECACA",
                                paddingRight: 4,
                                paddingLeft: 4,
                                borderRadius: 4
                            }}>Manager</Text>
                        ) : (
                            <></>
                        )
                    }
                </View>
                <View style={{marginLeft:'auto'}}>
                    {
                        hirevalue && (
                            <Text style={{
                                marginTop:4,
                                color: "white",
                                backgroundColor: "#2463EB",
                                paddingRight: 8,
                                paddingLeft: 8,
                                paddingTop:8,
                                paddingBottom:8,
                                borderRadius: 8
                            }}>Hire</Text>
                        )
                    }
                </View>
            </View>
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
        </View>
    )
}