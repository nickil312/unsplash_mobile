import {View, Text, Image, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Button} from "react-native";
import {useLocalSearchParams} from "expo-router";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useTranslation} from "react-i18next";
import {fetchAddImageToCollection, fetchCollectionsForAddImage} from "@/globalRedux/posts/asyncActions";
import {Status} from "@/globalRedux/posts/types";
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";
import CreateForm from "@/components/collection/CreateForm";

export default function AddToCollection() {
    const {id, imageUrl} = useLocalSearchParams();
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0}); // Состояние для хранения ширины и высоты изображения
    const {api_url} = useSelector((state: RootState) => state.users);
    const {data} = useSelector((state: RootState) => state.users);
    const {t} = useTranslation();
    const currentTheme = useColorScheme()
    const {items, status} = useSelector((state: RootState) => state.posts.CollectionsForAddImage);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedCollections, setSelectedCollections] = useState<{ [key: string]: boolean }>({});
    const [CreatePage, setCreatePage] = useState<boolean>(false);

    useEffect(() => {
        // Получаем размеры изображения
        Image.getSize(`${api_url}/${imageUrl}`, (width, height) => {
            setImageDimensions({width, height}); // Устанавливаем ширину и высоту в состояние
            console.log(width, height);
        }, (error) => {
            console.error("Error loading image: ", error);
        });
    }, [imageUrl, api_url]);

    const styles = StyleSheet.create({
        card: {
            position: 'relative',
            height: 80,
            width: '100%',
            marginTop: 10,
            borderRadius: 6,

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
            color: currentTheme === 'dark' ? 'white' : 'black',
        },
        userAva: {
            width: 32,
            height: 32,
            borderRadius: 16, // Устанавливаем радиус, равный половине ширины и высоты, чтобы сделать изображение круглым
            marginRight: 8,
        },
        container: {
            flexDirection: 'column', // Устанавливаем направление в строку
            padding: 8
        },
        text: {
            color: 'black', // Установите цвет текста по умолчанию
        },
        likeBut: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
        },
        createBut: {
            backgroundColor: currentTheme === 'dark' ? "#121212" : "#F5F5F5",
            marginTop: 15,
            padding: 20,
            width: '100%',
            borderRadius: 3,
            borderStyle: "dashed",
            borderWidth: 3,
            borderColor: 'grey',
        },
        cardStyle: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            height: 80,
            marginBottom: 3,
            width: '100%',
        },
        image: {
            width: '100%',
            height: 80,
            borderRadius: 6,
        }

    });
    useEffect(() => {
        if (data !== null) {
            dispatch(fetchCollectionsForAddImage({
                post_id: id,
                userIdAccViewed: data._id
            }))
        }
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            const initialSelectedCollections: { [key: string]: boolean } = {};
            items.forEach((item) => {
                initialSelectedCollections[item._id] = item.has_post!;
            });
            setSelectedCollections(initialSelectedCollections);
            console.log(selectedCollections);
        }
    }, [items]);

    const onSubmitAddImage = (_id: string, collection_id: string, add: boolean) => {
        dispatch(fetchAddImageToCollection({
            _id:collection_id,
            post_id:_id,
            add:add
        }))
        console.log("collection id", collection_id, "post_id", _id, "add", add)
    }

    return (
        <ScrollView>
            <Image
                source={{uri: `${api_url}/${imageUrl}`}} style={styles.cardImage}/>
            <View style={styles.container}>
                {
                    CreatePage ? (
                        <>
                            <Text style={styles.cardTitle}>
                                {t('Create new collection')}
                            </Text>
                            <CreateForm/>
                            <Button title={t('Cancel')} onPress={() => setCreatePage(false)}/>

                        </>
                    ) : (
                        <>
                            <Text style={styles.cardTitle}>
                                {t('Add to collection')}
                            </Text>
                            <TouchableOpacity onPress={() => setCreatePage(true)}>

                            <View style={styles.createBut}>
                                <Text style={styles.cardTitle}>
                                    {t('Create a new collection')}
                                </Text>
                            </View>
                            </TouchableOpacity>
                            {
                                status !== Status.SUCCESS ? (
                                    <View>
                                        <Text>Loafing</Text>
                                    </View>
                                ) : (
                                    items.length > 0 ? (
                                        items.map((item, index) => (
                                            <TouchableOpacity key={item._id} onPress={() => {
                                                console.log(selectedCollections);

                                                const newSelectedCollections = {
                                                    ...selectedCollections,
                                                    [item._id]: !selectedCollections[item._id] ?? !item.has_post
                                                };
                                                setSelectedCollections(newSelectedCollections);
                                                onSubmitAddImage(id, item._id, newSelectedCollections[item._id]);

                                                console.log(selectedCollections);
                                            }}>

                                                <View  style={styles.card}>
                                                    {
                                                        item.last_three_posts !== null && item.last_three_posts[0].imageurl !== null ? (
                                                            <Image
                                                                source={{uri: `${api_url}/${item.last_three_posts[0].imageurl}`}}
                                                                alt="Image"
                                                                style={styles.image}
                                                            />
                                                        ) : (
                                                            <Image
                                                                source={{uri: `${api_url}/${imageUrl}`}}
                                                                alt="Image"
                                                                style={styles.image}
                                                            />

                                                        )
                                                    }
                                                    <View style={{
                                                        position: 'absolute',
                                                        padding: 24,
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        width: '100%'
                                                    }}>
                                                        <View>
                                                            <Text style={{color: 'white'}}>
                                                                {item.total_photos} {t('photos')}
                                                            </Text>
                                                            <View style={{
                                                                display: 'flex',
                                                                flexDirection: "row",
                                                                alignItems: 'center',
                                                            }}>
                                                                {
                                                                    item.private && (
                                                                        <FontAwesome style={{marginRight: 5}} name="lock" size={14}
                                                                                     color="white"/>
                                                                    )
                                                                }

                                                                <Text style={{
                                                                    color: 'white', fontWeight: '700',
                                                                    fontSize: 18
                                                                }}>
                                                                    {item.name}
                                                                </Text>
                                                            </View>

                                                        </View>
                                                        <View style={{justifyContent: 'center'}}>
                                                            {
                                                                selectedCollections[item._id] ? (
                                                                    <Ionicons name="checkmark" size={24} color="white"/>


                                                                ) : (
                                                                    <AntDesign name="plus" size={24} color="white"/>

                                                                )
                                                            }
                                                        </View>

                                                    </View>


                                                </View>
                                            </TouchableOpacity>

                                        ))
                                    ) : (

                                        <Text>
                                            no collections
                                            {/*{lang === "en" ? <>You have no collections</> : <>У вас нет коллекций</>}*/}
                                        </Text>
                                    )
                                )
                            }
                        </>
                    )
                }

            </View>
        </ScrollView>
    )
}