import {View, Text, Image, ScrollView, TouchableOpacity, useColorScheme} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {fetchGetDownloadHistory} from "@/globalRedux/users/asyncActions";
import React, {useEffect} from "react";
import {Status} from "@/globalRedux/posts/types";
import i18next from "@/i18n";
import {DownloadImage} from "@/components/func/DownloadImage";
import {AntDesign, FontAwesome} from "@expo/vector-icons";
import {truncateText} from "@/components/func/truncateText";

export default function DownloadHistory() {
    const dispatch = useDispatch<AppDispatch>()
    const {items, status} = useSelector((state: RootState) => (state.users.download_history))
    const {api_url} = useSelector((state: RootState) => (state.users))
    const currentTheme = useColorScheme()

    useEffect(() => {
        dispatch(fetchGetDownloadHistory())
    }, [])
    return (
        <ScrollView>
            {
                items.length > 0 && status === Status.SUCCESS ? (
                    <View className="border border-D1 rounded-[6px] w-full">
                        {

                            items.map((item, index) => (
                                // <DownloadHistoryPost key={index} _id={item._id} title={item.title}
                                //                      text={item.text}
                                //                      imageurl={`${api_url}/${item.imageurl}`}
                                //                      altText={item.imageurl}
                                //                      download_at={item.download_at}
                                //                      lang={lang}
                                // />
                                <View style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginTop: 10,
                                    marginLeft: 10,
                                    marginRight: 10
                                }}>
                                    <Image
                                        style={{width: 120, height: 120, borderRadius: 5}}
                                        source={{uri: `${api_url}/${item.imageurl}`}}
                                    />
                                    <View style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                        flexDirection: "column",
                                        marginLeft: 10
                                    }}>

                                        <Text style={{
                                            color: currentTheme === 'dark' ? 'white' : 'black',
                                        }}>{item.title}</Text>
                                        <Text style={{
                                            color: currentTheme === 'dark' ? 'white' : 'black',
                                        }}>{truncateText(`${item.text}`, 29)}</Text>
                                        <Text style={{
                                            color: currentTheme === 'dark' ? 'white' : 'black',
                                        }}>{new Intl.DateTimeFormat(`${i18next.language}`, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }).format(new Date(item.download_at))}</Text>

                                    </View>
                                    <TouchableOpacity style={{marginLeft:"auto"}} onPress={() => DownloadImage(item.imageurl,item.title,item._id,api_url)}>
                                            <AntDesign name="arrowdown" size={24} color={currentTheme === "dark" ? 'white' : 'black'} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </View>


                ) : items.length === 0 && status === Status.SUCCESS ? (
                    <Text className="text-center w-full text-xl mt-10">No data</Text>
                ) : (
                    <View className="border border-D1 rounded-[6px] w-full">
                        {Array(8).fill(0).map((_, index) => (
                            // <DownloadHistoryLoading key={index} />
                            <Text>
                                Loading
                            </Text>
                        ))}
                    </View>
                )
            }
        </ScrollView>
    )
}