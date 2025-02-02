import {View, Text, TextInput, Switch, Button, StyleSheet, useColorScheme, Alert} from "react-native";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/globalRedux/store";
import {PasswordChangeInAccountProps} from "@/globalRedux/users/types";
import {Controller, useForm} from "react-hook-form";
import React from "react";
import Constants from "expo-constants";
import {useTranslation} from "react-i18next";
import {fetchRecover_pass_change_passwordInAccount} from "@/globalRedux/users/asyncActions";

export default function changePassword(){
    const dispatch = useDispatch<AppDispatch>();
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        formState: {errors,isValid},

    } = useForm<PasswordChangeInAccountProps>({
        defaultValues: {
            currect_password: 'bg!B123@',
            password: 'bg!B123@',
            password2: 'bg!B123@',
            // bg!B123@

        },
    });
    const styles = StyleSheet.create({
        userAva: {
            width: 32,
            height: 32,
            borderRadius: 16, // Устанавливаем радиус, равный половине ширины и высоты, чтобы сделать изображение круглым
            marginRight: 8,
        },
        container: {
            flexDirection: 'row', // Устанавливаем направление в строку
            alignItems: 'center', // Центрируем элементы по вертикали
            padding: 4
        },
        formcontainer: {
            flex: 1,
            padding: 8,
            // backgroundColor: '#0e101c',
        },
        input: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? 'white' : 'black',
            borderBottomStyle: 'solid',
            height: 40,
            width: '100%',
            padding: 10,
            borderRadius: 4,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        label: {
            color: currentTheme === "dark" ? 'white' : 'black',
            marginLeft: 0,
            marginTop: 15,
            marginBottom: -10
        },
        inputBio: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? 'white' : 'black',
            borderBottomStyle: 'solid',
            height: 120,
            width: '100%',
            padding: 10,
            marginTop: 6,
            borderRadius: 4,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        button: {
            marginTop: 40,
            height: 40,
            backgroundColor: '#d2d2d2',
            borderRadius: 4,
            width: '100%',
        },
    });

    const onSubmit = async (values) => {
        console.log(values)
        if(values.currect_password === values.password && values.password === values.password2) {
            // setErrorAllEdenticalPass(true);
            Alert.alert("Passwords not the same")
        }else if(values.password === values.password2 && values.password !== values.currect_password) {
            // запрос
            dispatch(fetchRecover_pass_change_passwordInAccount(values))
                .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        // console.log("Request failed")
                        // setError(true);
                        Alert.alert("Error")
                    } else if (response.meta.requestStatus === 'fulfilled') {
                        // console.log("Request fulfilled")
                        // router.push(`/${lang}`);
                        // setSuccess(true);
                        Alert.alert(t('Password was changed'))
                    }
                    // handle success response
                })
                .catch((error) => {
                    console.log(error)

                })
            // setSuccess(true);
        }else if(data.password !== data.password2 ) {
            setErrorNotEdenticalPass(true);
        }
    }

        return(
            <View style={styles.formcontainer}>
                <Text style={styles.label}>{t('Current Password')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('Current Password')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="currect_password"
                    rules={{required: true,
                        minLength: 8,
                        pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/}}
                />
                <Text style={styles.label}>{t('New Password')}</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('New Password')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}

                        />
                    )}
                    name="password"
                    rules={{required: true,
                        minLength: 8,
                        pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/}}
                />

                <Text style={styles.label}>{t('New Password')} 2</Text>
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('New Password')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}

                        />
                    )}
                    name="password2"
                    rules={{required: true,
                        minLength: 8,
                        pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/}}
                />

                <View style={styles.button}>
                    <Button
                        disabled={!isValid}
                        color="black"
                        title={t('Change Password')}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </View>
    )
}