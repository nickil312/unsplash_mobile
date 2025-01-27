import {Text, useColorScheme, View, Image, StyleSheet, TouchableOpacity, Button} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/globalRedux/store";
import React, {useEffect, useState} from "react";
import {truncateText} from "@/components/func/truncateText";
import {useTranslation} from "react-i18next";
import {Link} from "expo-router";
import {AntDesign, FontAwesome} from "@expo/vector-icons";
import LikeDisChange from "@/components/func/LikeDisChange";
import {DownloadImage} from "@/components/func/DownloadImage";
//
// const Card = styled.View`
//
//     flex-direction: row;
//     border-bottom-width: 1px;
//     border-bottom-color: rgba(0, 0, 0, 0.1);
//     border-bottom-style: solid;
//     position: relative;
//     height: 300px;
// `
// const CardImage = styled.Image`
//   width: 100%;
//
// `
// const CardTitle = styled.Text`
//   font-weight: 700;
//   font-size: 18px;
//
// `
// const PostDetails = styled.View`
//     flex-direction: column;
//     position: absolute;
//     bottom: 0;
//     left: 0;
//
//
// `
// const PhotoCreator = styled.Text`
//   font-size: 14px;
//   margin-top: 2px;
//   color: rgba(0, 0, 0, 0.4);
// `
const truncateTitle = (str) => {
    if (str.length >= 50) {
        return str.substring(0, 50) + '...';
    }
    return str
}

interface PhotoCardProps {
    imageUrl: string;
    altText: string;
    fullname: string;
    avatarurl: string;
    user_id: string;
    _id: string;

    license: string
    likedByUser: boolean
    hirevalue: boolean
    banned: boolean
}

export default function Post({
                                 imageUrl, banned,
                                 altText,
                                 fullname,
                                 avatarurl,
                                 user_id,
                                 _id,
                                 license,
                                 likedByUser,
                                 hirevalue,
                             }: PhotoCardProps) {
    const {api_url} = useSelector((state: RootState) => state.users);
    const currentTheme = useColorScheme()
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0}); // Состояние для хранения ширины и высоты изображения
    const {t} = useTranslation();
    const [liked, setLiked] = useState(likedByUser); // Состояние для хранения значения "лайка"
    const {data} = useSelector((state: RootState) => state.users);

    useEffect(() => {
        // Получаем размеры изображения
        Image.getSize(`${api_url}/${imageUrl}`, (width, height) => {
            setImageDimensions({width, height}); // Устанавливаем ширину и высоту в состояние
            console.log(width, height);
        }, (error) => {
            console.error("Error loading image: ", error);
        });
    }, [imageUrl, api_url]);

    // console.log(api_url)
    // console.log(img)
    const styles = StyleSheet.create({
        card: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
            borderBottomStyle: 'solid',
            position: 'relative',
            height: imageDimensions.height > 0 ? imageDimensions.height / 3 : 600,
        },
        cardImage: {
            width: '100%',
            height: imageDimensions.height > 0 ? imageDimensions.height / 3 : 400, // Убедитесь, что изображение занимает всю высоту карточки
            resizeMode: 'cover', // Это поможет сохранить пропорции изображения
        },
        postDetails: {
            flexDirection: 'column',
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: 10, // Добавьте немного отступа для текста
        },
        banned: {
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 10, // Добавьте немного отступа для текста
        },
        cardTitle: {
            fontWeight: '700',
            fontSize: 18,
        },
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
        text: {
            color: 'black', // Установите цвет текста по умолчанию
        },
        likeBut: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
        }
    });
    const ChangeLike = () => {
        if (data !== null) {

            LikeDisChange({
                likeValue: liked,
                _id: _id
            })
            setLiked(!liked)
        }
    }

    return (
        <View>
            {/*style={styles.postDetails}*/}
            <Link href={`/(tabs)/(profile)/users/${user_id}`}>


                <View style={styles.container}>
                    {/*<Text style={[styles.cardTitle, {color: currentTheme === 'dark' ? '#FFF' : '#000'}]}>*/}
                    {/*    {truncateTitle(Cardtitle)}*/}
                    {/*</Text>*/}
                    <Image
                        source={{uri: `${api_url}/${avatarurl}`}} style={styles.userAva}/>
                    {
                        license === "Unsplash+" ? (
                            <Text style={{color: `${currentTheme === "dark" ? 'white' : "black"}`}}>
                                {
                                    truncateText(`${t('collabPost')}${fullname}`, 29)
                                }
                            </Text>
                        ) : (
                            <Text style={{color: `${currentTheme === "dark" ? 'white' : "black"}`}}>
                                {
                                    truncateText(`${fullname}`, 29)
                                }
                            </Text>
                        )
                    }

                </View>
            </Link>

            <View style={styles.card}>
                <Link  href={`/(tabs)/(profile)/details/${_id}`}>

                <Image
                    source={{uri: `${api_url}/${imageUrl}`}} style={styles.cardImage}/>
                </Link>

                <View style={styles.banned}>
                    {
                        banned && (

                            <Text style={[styles.cardTitle, {
                                color: "white",
                                backgroundColor: "red",
                                paddingRight: 4,
                                paddingLeft: 4,
                                borderRadius: 4
                            }]}>
                                Banned
                            </Text>

                        )
                    }

                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 4}}>


                <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: 4}}>

                    {liked ? (
                        <TouchableOpacity onPress={ChangeLike}>
                            {/*// лайк стоит*/}
                            {/*    onPress={ChangeLike}*/}
                            <View className={"color-red-500 mt-4 w-fit"} style={styles.likeBut}>
                                <AntDesign name="like1" size={30} color={currentTheme === "dark" ? 'white' : 'black'}/>
                            </View>

                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={ChangeLike}>

                            <View className={"color-red-500 mt-4"} style={styles.likeBut} >
                                <AntDesign name="like2" size={30} color={currentTheme === "dark" ? 'white' : 'black'}/>
                            </View>
                        </TouchableOpacity>

                    )}
                    <Link href={`/collectionsmodal/${_id}`}>
                        {/*href={`/(tabs)/(profile)/users/${user_id}`}*/}
                        <View className={"color-red-500 mt-4 w-fit"} style={styles.likeBut}>
                            <AntDesign name="plus" size={30} color={currentTheme === "dark" ? 'white' : 'black'}/>

                        </View>
                    </Link>

                </View>
                <TouchableOpacity onPress={() => DownloadImage(imageUrl,altText,_id,api_url)}>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'black',
                        padding: 4,
                        borderRadius: 4,
                        gap: 4
                    }}>
                        {
                            license === "Unsplash+" ? (
                                <FontAwesome name="lock" size={14} color="white"/>

                            ) : (
                                <></>
                            )
                        }
                        <Text style={{color: "white"}}>Download</Text>

                    </View>
                </TouchableOpacity>
            </View>
        </View>

    )
}
