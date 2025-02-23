import React from "react";
import {useColorScheme, StyleSheet, Text, View, TextInput, Button, Alert} from "react-native";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/globalRedux/store";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import Constants from "expo-constants";
import {Controller, useForm} from "react-hook-form";
import {RegData} from "@/globalRedux/users/types";
import {fetchRegister} from "@/globalRedux/users/asyncActions";

export default function Register(){
    const currentTheme = useColorScheme() // Считывание темы телефона
    const dispatch = useDispatch<AppDispatch>(); // Вызов функции через переменную
    const router = useRouter();
    const {t} = useTranslation(); // Вызов функции перевода текста

    const {register, setValue, handleSubmit, setError, control, reset, formState: {errors, isValid},} = useForm<RegData>({
        defaultValues: {

            fullName: 'nick',
            email: 'kest@best.ru',
            password: 'bg!B123@',
            // avatarUrl: 'https://images.unsplash.com/photo-1624337851647-9eddc80d19f6?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            // password2: '112123',
        }
    })

    const styles = StyleSheet.create({
        label: {
            color: currentTheme === "dark" ? 'white' : 'black',
            marginTop: 20,
            marginLeft: 10,
            fontWeight: "bold",
            alignSelf: "flex-start"


        },
        button: {
            marginTop: 40,
            height: 40,
            backgroundColor: 'rgba(242,242,242,0.79)',
            borderRadius: 4,
        },
        button2: {
            marginTop: 10,

            // backgroundColor: 'rgba(242,242,242,0.79)',
            borderRadius: 4,
            marginBottom: 10,
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
            borderBottomStyle: 'solid',
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
    });
    const onSubmit = async (values) => {
        console.log(values)
        dispatch(fetchRegister(values))
            .then((response) => {
                console.log(response)
                if (response.meta.requestStatus === 'rejected') {
                    // console.log("Request failed")
                    // setError(true);
                    Alert.alert('Error')
                } else if (response.meta.requestStatus === 'fulfilled') {
                    // console.log("Request fulfilled")
                    // router.push(`/${lang}`);
                    router.dismissAll();

                }
                // handle success response
            })
            .catch((error) => {
                console.log(error)

            })
    }
        return(
        <View style={{alignItems: 'center', justifyContent: 'center',width: '100%',padding:15}}>
            <View style={{alignItems: 'center',justifyContent: 'center',width: '100%'}}>
                <Text style={{marginTop: 10, fontSize: 24, color: currentTheme === "dark" ? 'white' : 'black'}}>
                    {t('regTitle')}
                </Text>

                <Text style={styles.label}>{t('Firstname')}</Text>


                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('Firstname')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="fullName"
                    rules={{required: true,minLength: 2,maxLength:8,pattern: /^.*[a-zA-Zа-яА-Я]+.*$/}}
                />
                {errors.fullName && <Text style={styles.err}>{t('FirstnameIsReq')}</Text>}

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
                    rules={{required: true, minLength: 8, pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/}}
                />
                {errors.password && <Text style={styles.err}>{t('PasswordIsReq')}</Text>}

                <View style={styles.button}>
                    <Button
                        disabled={!isValid}
                        color="black"
                        title={t('regButton')}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
                {/*<View style={styles.button2}>*/}
                {/*    <Button color={currentTheme === "dark" ? 'white' : 'black'} title={t('authButton')}*/}
                {/*            onPress={() => }/>*/}
                {/*    /!*<Button color={currentTheme === "dark" ? 'white' : 'black'} title={"en"}*!/*/}
                {/*    /!*        onPress={() => changelng("en")}/>*!/*/}
                {/*    /!*<Button color={currentTheme === "dark" ? 'white' : 'black'} title={"rus"}*!/*/}
                {/*    /!*        onPress={() => changelng("rus")}/>*!/*/}
                {/*</View>*/}
            </View>
        </View>
    )
}