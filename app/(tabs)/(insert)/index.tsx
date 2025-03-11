import {useColorScheme, View, Text, StyleSheet, Button, Alert} from "react-native";
import {useTranslation} from "react-i18next";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {RootState} from "@/globalRedux/store";
import {useRouter} from "expo-router";

export default function Insert(){
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const {api_url, data} = useSelector((state: RootState) => state.users);
    const router = useRouter();
    const styles = StyleSheet.create({
        title:{
            marginLeft:15,

            fontSize: 20,
            fontWeight: 'bold',
            color: currentTheme === "dark" ? 'white' : 'black'
        },
        addcard:{
            flexDirection: 'row',
            marginLeft: 15,
            marginRight: 15,
            borderRadius:5,
            borderWidth: 3,
            height:140,
            marginTop:15,
            borderColor:'grey',
            borderStyle:'dashed'
        },
        imageCont:{
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf:"center",
            justifyContent:'center',
            marginLeft:10,
            flex:1
        },
        button: {
            marginTop: 15,
            marginRight: 15,
            color: 'white',
            height: 40,
            backgroundColor: '#d0cece',
            borderRadius: 4,
            flex: 1
        },
        view: {
            marginLeft: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
    })

    return(
        <View>
        <Text style={styles.title}>{t('Contribute to Unsplash')}</Text>
            <View style={styles.addcard} onTouchEndCapture={() => {

                if (data !== null) {
                router.push('/create')
                }else {
                    Alert.alert(t('Alert'),t('You need to register/login'))
                }
            }}>
                <View style={styles.imageCont}>
                    <MaterialCommunityIcons name="image-plus" size={24}
                                            color={currentTheme === "dark" ? 'white' : "black"}/>
                    <Text style={{
                        color: currentTheme === "dark" ? 'white' : "black"
                    }}>
                        {t('Upload your photo')}
                    </Text>
                </View>
            </View>
            {
                data !== null ? (
                    <View style={styles.view}>
                        <View style={styles.button} onTouchEndCapture={() => {
                            router.push('/banned')
                        }}>
                            <Button title={t("Banned Posts")} color="black"/>
                        </View>
                    </View>
                ) : (
                    <></>
                )
            }
            {/*<Text>{data?.user_role_id}</Text>*/}
            {
                data !== null && (data.user_role_id === 1 || data.user_role_id === 3) ? (
                    <View style={styles.view}>
                        <View style={styles.button} onTouchEndCapture={() => {
                            router.push('/reported')

                        }}>
                            <Button title={t("Reports")} color="black"/>
                        </View>
                    </View>
                ) : (
                    <></>
                )
            }
        </View>
    )
}