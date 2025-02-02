import {ScrollView, View, Text, StyleSheet, useColorScheme} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useEffect} from "react";
import {fetchPostStatistics} from "@/globalRedux/posts/asyncActions";
import {useLocalSearchParams} from "expo-router";
import {Status} from "@/globalRedux/posts/types";
import i18next from "@/i18n";
import {useTranslation} from "react-i18next";

export default function Statistics() {
    const {id} = useLocalSearchParams();
    const {t} = useTranslation();

    const {items, status} = useSelector((state: RootState) => state.posts.postStatistics);
    const currentTheme = useColorScheme()


    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(fetchPostStatistics({
            _id: id
        }))
    }, []);

    const styles = StyleSheet.create({
        scrollView: {
            flexDirection: 'row',
        },
        mainScroll:{
            flexDirection: 'column',

        },
        box: {
            width: 30,
            height: 100,
            backgroundColor: 'lightgreen',
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <ScrollView style={styles.mainScroll}>
            <View style={{marginBottom:10}}>
                <Text style={{fontWeight:700,fontSize:18,padding:8,
                    color:currentTheme === "dark" ? 'white' : 'black'}}>
                    {t('Likes')}
                </Text>
            </View>
            <ScrollView horizontal={true} style={styles.scrollView}>
                {
                    status === Status.LOADING ? (
                        <Text>loading</Text>
                        // <div className="animate-pulse flex flex-row gap-2 items-end">
                        //     <div
                        //         className="flex items-center  w-8 h-[20px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[50px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[30px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[40px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[20px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[50px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[30px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[40px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[50px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        // </div>
                    ) : (

                        items.likes.map((item) => (

                            <View style={{
                                height: item.likecount * 100, width: 69, backgroundColor: currentTheme === "dark" ? 'green' : 'lightgreen', marginLeft: 10,paddingLeft:4,paddingRight:4,paddingTop:4,borderRadius:6
                            }}>
                                <Text style={{color:currentTheme === "dark" ? 'white' : 'black'}}>
                                    {item.likecount}
                                </Text>
                                <Text style={{color:currentTheme === "dark" ? 'white' : 'black'}}>{new Intl.DateTimeFormat(`${i18next.language}`, {
                                    year: '2-digit',
                                    month: 'numeric',
                                    day: 'numeric'
                                }).format(new Date(item.createdat))}</Text>
                            </View>


                        ))

                    )
                }
            </ScrollView>
            <View style={{marginTop:30,marginBottom:10}}>
                <Text style={{fontWeight:700,fontSize:18,padding:8,
                color:currentTheme === "dark" ? 'white' : 'black'}}>
                    {t('Views')}
                </Text>
            </View>

            <ScrollView horizontal={true} style={styles.scrollView}>
                {
                    status === Status.LOADING ? (
                        <Text>loading</Text>
                        // <div className="animate-pulse flex flex-row gap-2 items-end">
                        //     <div
                        //         className="flex items-center  w-8 h-[20px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[50px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[30px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[40px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[20px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[50px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[30px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[40px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        //     <div
                        //         className="flex items-center  w-8 h-[50px] rounded bg-[#F3F4F6] dark:bg-[#EEEEEE]"></div>
                        // </div>
                    ) : (

                        items.views.map((item) => (

                            <View style={{
                                height: item.likecount * 10, width: 69, backgroundColor: currentTheme === "dark" ? 'green' : 'lightgreen', marginLeft: 10,paddingLeft:4,paddingRight:4,paddingTop:4,borderRadius:6
                            }}>
                                <Text style={{
                                    color:currentTheme === "dark" ? 'white' : 'black'
                                }}>
                                    {item.likecount}
                                </Text>
                                <Text style={{
                                    color:currentTheme === "dark" ? 'white' : 'black'
                                }}
                                >{new Intl.DateTimeFormat(`${i18next.language}`, {
                                    year: '2-digit',
                                    month: 'numeric',
                                    day: 'numeric'
                                }).format(new Date(item.createdat))}</Text>
                            </View>


                        ))

                    )
                }
            </ScrollView>
        </ScrollView>
    )
}