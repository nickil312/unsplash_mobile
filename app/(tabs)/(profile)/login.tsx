import {View, Text, Button, StyleSheet, TextInput, Alert, useColorScheme} from "react-native";
import {useForm, Controller} from "react-hook-form";
import Constants from 'expo-constants';
// import {fetchAuth, selectIsAuth} from "../../../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import i18next from "../../../i18n";
// import {useRouter} from "expo-router";
import { Redirect,useRouter, useFocusEffect } from 'expo-router';
import {fetchAuth} from "@/globalRedux/users/asyncActions";
import {LoginData} from "@/globalRedux/users/types";
import {AppDispatch, RootState} from "@/globalRedux/store";

//
// const RegContainer = styled.View`
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     margin-top: 30%;
//     background-color: #D0CECE;
//     width: 80%;
//     border-radius: 15px;
// `

export default function Login () {
    const {api_url, data} = useSelector((state: RootState) => state.users);

    // const isAuth = useSelector(selectIsAuth); // Считывание статуса авторизации пользователя
    const dispatch = useDispatch<AppDispatch>(); // Вызов функции через переменную
    const currentTheme = useColorScheme() // Считывание темы телефона
    const {t} = useTranslation(); // Вызов функции перевода текста
    const router = useRouter();

    const { handleSubmit, control, formState: {errors, isValid},} = useForm<LoginData>({
        defaultValues: {
            email: 'test@test.ru',
            password: '112123',
        },
    })
    const styles = StyleSheet.create({
        label: {
            color: currentTheme === "dark" ? 'white' : 'black',
            marginTop: 20,
            marginLeft: 10,
            fontWeight:"bold",
            alignSelf:"flex-start"
        },
        button: {
            marginTop: 40,
            height: 40,
            backgroundColor: 'rgba(242,242,242,0.79)',
            borderRadius: 4,
            marginBottom:10
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingTop: Constants.statusBarHeight,
            padding: 8,
            backgroundColor: '#0e101c',
        },
        input: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? 'white' : 'black',
            // borderBottomStyle: 'solid',
            color: currentTheme === "dark" ? 'white' : 'black',
            height: 40,

            width: '100%',
            padding: 10,
            borderRadius: 4,
        },
        err: {
            color:'red',
            marginTop:5
        },
        button2: {
            marginTop: 10,

            // backgroundColor: 'rgba(242,242,242,0.79)',
            borderRadius: 4,
            marginBottom: 10,
        },
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));

        if (!data.payload) {
            console.log("No payload user no reg")
            Alert.alert(t('WrongPassOrEmail'))

        }
        console.log("data",data)
        if (data && data.payload && data.payload.token) {
            // await SecureStore.setItemAsync('token', data.payload.token);
            const lang = await SecureStore.getItemAsync(`language`)
            if (lang !== null) {
                i18next.changeLanguage(lang);
            }
            router.replace('/(tabs)/(profile)')
        }
    }

    if (data !== null) {
        <Redirect href="/(tabs)/(home)" />;
    }


    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>

            {/*<View style={styles.regcontainer}>*/}
            <View style={{alignItems: 'center',justifyContent: 'center'}} className={"mt-3 bg-D1 w-5/6 border rounded-2xl border-transparent "}>
                <Text style={{marginTop:10,fontSize: 24, color: currentTheme === "dark" ? 'white' : 'black'}}>
                    {t('Authtorization')}
                </Text>
                <Text style={styles.label}>{t('Email')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('Email')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="email"
                    rules={{required: true, pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/}}
                />
                {errors.email && <Text style={styles.err}>{t('EmailIsReq')}</Text>}
                <Text style={styles.label}>{t('Password')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('Password')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="password"
                    rules={{required: true}}
                />
                {errors.password && <Text style={styles.err}>{t('PasswordIsReq')}</Text>}
                <View style={styles.button}>
                    <Button
                        disabled={!isValid}
                        color="black"
                        title={t('authButton')}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
                <View style={styles.button2}>
                    <Button color={currentTheme === "dark" ? 'white' : 'black'} title={t('RecPassTitle')}
                            onPress={() => router.replace('/(tabs)/(home)')} />
                </View>
            </View>
        </View>
    )
}


