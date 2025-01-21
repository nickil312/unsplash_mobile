import {View, Text, useColorScheme, TouchableOpacity, VirtualizedList} from "react-native";
import {AccountPhotosSkeleton} from "../AccountPhotosSkeleton";
import styled from "styled-components/native";
import Post from "../../../components/Post";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuth} from "../../../redux/slices/auth";
import {useNavigation} from "@react-navigation/native";
import {fetchLikePost, fetchUserLikePosts, fetchUserPost} from "../../../redux/slices/posts";
import {useTranslation} from "react-i18next";

export const AccountLikes = () => {
    const currentTheme = useColorScheme()
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true);
    // const [abn, setabn] = useState(0);
    const {user_likes_posts} = useSelector(state => state.posts);
    const {data, status} = useSelector(state => state.auth);
    const {t} = useTranslation();


    const MainTitle = styled.Text`
        margin-left: 15px;
        flex-direction: row;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
        color: ${currentTheme === "dark" ? 'white' : 'black'};

    `;
    useEffect(() => {
        setIsLoading(true)
        dispatch(fetchUserLikePosts(data._id))
        // setabn(abn + 1)
        // console.log("//////////////////////")
        // // console.log(data)
        // console.log(user_likes_posts)
        // console.log("//////////////////////")
        // console.log(`loading data ${abn}`)
        setIsLoading(false)
    }, [])
    const getItem = (data, index) => {
        return data[index];
    };
    //&& user_likes_posts.status === 'loading'
    if (isLoading) {
        return (
            <AccountPhotosSkeleton style={{
                marginTop: 15
            }}/>
        )
    }
    // console.log(user_likes_posts)

    return (
        <View>
            <MainTitle>
                {t('Likes')}
            </MainTitle>

            {
                isAuth === true && user_likes_posts.status === 'loaded' ? (

                    user_likes_posts.items.length === 0 ? (
                        <>
                            <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Вы не лайкали посты</Text>
                        </>
                    ) : (

                        <VirtualizedList
                            style={{marginTop: 15}}
                            data={user_likes_posts.items}
                            getItemCount={() => user_likes_posts.items.length}
                            getItem={getItem}
                            renderItem={({item: post}) => (
                                <TouchableOpacity onPress={() => navigation.navigate("FullPost", {
                                    id: post._id,
                                    likedList: post.likedBy,
                                    user_id_get: post.user_id
                                })}>
                                    <Post key={post._id} img={post.imageUrl} Cardtitle={post.title}
                                        /*Creator={photos.user.fullName}*/ Creator={post.text}/>
                                </TouchableOpacity>)}
                            keyExtractor={(item) => item._id}
                        />
                    )

            ) : (
                    <AccountPhotosSkeleton style={{
                        marginTop: 15
                    }}/>
                )
            }

        </View>
    )
}