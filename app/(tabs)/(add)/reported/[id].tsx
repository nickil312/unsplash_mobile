import {View, Text, ScrollView, ActivityIndicator, Image, StyleSheet, useColorScheme} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect} from "react";
import {fetchReportedPostsDetail} from "@/globalRedux/posts/asyncActions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {Status} from "@/globalRedux/posts/types";

export default function ReportedId(){
    const dispatch = useDispatch<AppDispatch>();
    const {items, status} = useSelector((state: RootState) => state.posts.ReportPostsDetail);
    const {data, api_url} = useSelector((state: RootState) => (state.users))
    const currentTheme = useColorScheme()

    const {id} = useLocalSearchParams();
    useEffect(() => {
        dispatch(fetchReportedPostsDetail({_id: id})); // Вызов dispatch
    }, []);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        idText: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 16,
        },
        itemContainer: {
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: 8,
        },
        fullname: {
            fontSize: 16,
            fontWeight: '600',
            color: currentTheme === "dark" ? 'white' : "black"

        },
        reportContainer: {
            marginTop: 8,
        },
        reportText: {
            fontSize: 14,
            // color: '#333',
            color: currentTheme === "dark" ? 'white' : "black"

        },
        noPostsText: {
            fontSize: 16,
            textAlign: 'center',
            marginTop: 20,
        },
    });
    return (
        <ScrollView style={styles.container}>
            {status === Status.LOADING ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : items && items.length > 0 && status === Status.SUCCESS ? (
                items.map((item) => (
                    <View key={item._id} style={styles.itemContainer}>
                        <View style={styles.userInfo}>
                            <Image
                                style={styles.avatar}
                                source={{ uri: `${api_url}/${item.avatarurl}` }}
                                alt="user photo"
                            />
                            <Text style={styles.fullname}>{item.fullname}</Text>
                        </View>
                        {item.report && (
                            <View style={styles.reportContainer}>
                                {item.report.split('\n').map((line, index) => (
                                    <Text key={index} style={styles.reportText}>{line}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))
            ) : (
                <Text style={styles.noPostsText}>No reported posts found.</Text>
            )}
        </ScrollView>
    )
}