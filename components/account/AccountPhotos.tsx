import {
    View,
    Text,
    useColorScheme,
    RefreshControl,
    TouchableOpacity,
    FlatList,
    VirtualizedList,
    StyleSheet
} from "react-native";
// import {AccountPhotosSkeleton} from "../AccountPhotosSkeleton";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {Status} from "@/globalRedux/posts/types";
import Post from "@/components/miniPost/Post";
import {fetchPosts_Likes_coll_another_user} from "@/globalRedux/posts/asyncActions";

export default function AccountPhotos ({id}: {id: string}) {
    const currentTheme = useColorScheme()
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const {items, status} = useSelector((state: RootState) => state.posts.posts_another_user);

    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation()
    const {t} = useTranslation();


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
        if(data !== null){

        // dispatch(fetchUserPost(data._id))
            dispatch(fetchPosts_Likes_coll_another_user({
                bdType: "photos",
                // page:searchParams.get("page") !== null ? searchParams.get("page") : 0,
                page:0,
                userIdAccViewed:data._id
            }))
        }
        // console.log("//////////////////////")
        // console.log(data)
        // console.log("//////////////////////")
    }, [])
    const getItem = (data, index) => {
        return data[index];
    };
    return (
        <View>
            <Text style={styles.title} className={"text-black dark:text-white"}>
                {t('Photos')}
            </Text>
            {
                items !== null && status === Status.SUCCESS ? (


                    items.posts.length !== 0 ? (
                        <VirtualizedList
                            style={{marginTop: 15}}
                            data={items.posts}
                            getItemCount={() => items.posts.length}
                            getItem={getItem}
                            renderItem={({item: post}) => (
                                <TouchableOpacity
                                //     onPress={() => navigation.navigate("FullPost", {
                                //     id: post._id,
                                //     likedList: post.likedBy,
                                //     user_id_get: post.user_id
                                // })}
                                >
                                    <Post key={post._id} img={post.imageurl} Cardtitle={post.title}
                                        /*Creator={photos.user.fullName}*/ Creator={post.text}/>
                                </TouchableOpacity>)}
                            keyExtractor={(item) => item._id}
                        />
                    ) : (
                        <Text style={{marginLeft: 15, fontSize: 16, marginTop: 8}}>Вы не cоздавали посты</Text>

                    )

                ) : (
                    // <AccountPhotosSkeleton style={{
                    //     marginTop: 15
                    // }}/>
                    <Text>zagruzka</Text>
                )
            }

        </View>
    )
}