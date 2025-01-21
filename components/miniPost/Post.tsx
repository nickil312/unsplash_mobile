import {Text, useColorScheme, View,Image,StyleSheet} from "react-native";
import axios from "../axios";
import {useSelector} from "react-redux";
import {RootState} from "@/globalRedux/store";
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
export default function Post ({img, Cardtitle, Creator}) {
    const {api_url} = useSelector((state: RootState) => state.users);
    const currentTheme = useColorScheme()
    // console.log(api_url)
    // console.log(img)
    const styles = StyleSheet.create({
        card: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
            borderBottomStyle: 'solid',
            position: 'relative',
            height: 300,
        },
        cardImage: {
            width: '100%',
            height: '100%', // Убедитесь, что изображение занимает всю высоту карточки
            resizeMode: 'cover', // Это поможет сохранить пропорции изображения
        },
        postDetails: {
            flexDirection: 'column',
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: 10, // Добавьте немного отступа для текста
        },
        cardTitle: {
            fontWeight: '700',
            fontSize: 18,
        },
    });

    return (
        <View style={styles.card}>
            <Image source={{ uri: `${api_url}/${img}` }} style={styles.cardImage} />
            <View style={styles.postDetails}>
                <Text style={[styles.cardTitle, { color: currentTheme === 'dark' ? '#FFF' : '#000' }]}>
                    {truncateTitle(Cardtitle)}
                </Text>
                <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {Creator}
                </Text>
            </View>
        </View>
        // <Card>
        //             <CardImage source={{uri: `${api_url}/${img}`}}/>
        //     <PostDetails>
        //         <CardTitle style={{color: "#FFF"}}>
        //
        //             {truncateTitle(Cardtitle)}
        //         </CardTitle>
        //         <Text style={{color: "#FFF"}}>
        //             {/*{api_url}*/}
        //             {/*{img}*/}
        //             {Creator}
        //         </Text>
        //     </PostDetails>
        //
        // </Card>
    )
}
