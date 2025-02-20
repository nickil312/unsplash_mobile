import {View, Text, TextInput, StyleSheet, useColorScheme, Alert, Button} from "react-native";
import {Controller, useForm} from "react-hook-form";
import React, {useState} from "react";
import Constants from "expo-constants";
import {useTranslation} from "react-i18next";
import {FormData} from "@/app/(tabs)/(insert)/create";
import {Ban_Post, ReportCreateForm} from "@/globalRedux/posts/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useLocalSearchParams} from "expo-router";
import {fetchBanPost, fetchCreateReportForPost, fetchUnBanPost} from "@/globalRedux/posts/asyncActions";

export default function Ban() {
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const {id, banned} = useLocalSearchParams();

    const styles = StyleSheet.create({
        label: {
            color: currentTheme === "dark" ? 'white' : 'black',
            marginLeft: 0,
            marginTop: 15,
            marginBottom: -10
        },
        button: {
            marginTop: 40,
            height: 40,
            backgroundColor: '#d2d2d2',
            borderRadius: 4,
            width: '100%',
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
        dropdown: {
            // margin: 8,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            width: 200,
            elevation: 2,
        },

        placeholderStyle: {
            fontSize: 16,
        },
        selectedTextStyle: {
            fontSize: 16,
            marginLeft: 2,
        },
        switch: {
            marginRight: 8,
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
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
    });
    const dispatch = useDispatch<AppDispatch>();
    const [SuccessDataChange, setSuccessDataChange] = useState(false);
    const {data} = useSelector((state: RootState) => (state.users))

    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        setError,
        control,
        reset,
        formState: {errors, isValid},
    } = useForm<Ban_Post>({
        defaultValues: {},
    })
    const onSubmitUnBan = () => {
        if (data !== null && id !== null) {
            dispatch(fetchUnBanPost({
                admin_id: data._id,
                reasonofban: "",
                _id: id,
                banned: false
            }))
                .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        // setErrorRazban(true);
                        // console.log("Request failed")
                        // setSendResponseErrorImage(true)
                    } else if (response.meta.requestStatus === 'fulfilled') {
                        // console.log("Request fulfilled")
                        // setSuccessDataChangeRazban(true);
                        // router.push(`/${lang}`);
                        // setSuccessImageChange(true)
                    }
                    // handle success response
                })
                .catch((error) => {
                    console.log(error)
                    // setSendDataChange(true);
                })
        }

    }
    const onSubmit = handleSubmit((values) => {
        console.log(values)

        if (data !== null ) {
            values._id = id;
            values.banned = banned === 'true';
            values.admin_id = data._id;
            console.log(values)
            dispatch(fetchBanPost(values))
                .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        // setError(true);
                        // console.log("Request failed")
                        // setSendResponseErrorImage(true)
                    } else if (response.meta.requestStatus === 'fulfilled') {
                        // console.log("Request fulfilled")
                        // setSuccessDataChange(true);
                        // router.push(`/${lang}`);
                        // setSuccessImageChange(true)
                    }
                    // handle success response
                })
                .catch((error) => {
                    console.log(error)
                    // setSendDataChange(true);
                })
            console.log("banned")
        }
    })
    return (
        <View style={{padding: 15}}>
            <View>
                <Text style={styles.label}>{t('reasonofBan')}</Text>
                {/*<Text style={styles.label}>{id} {banned}</Text>*/}
                <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            placeholder={t('reasonofBan')}
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="reasonofban"
                    rules={{required: true, minLength: 2, pattern: /^.*[a-zA-Zа-яА-Я]+.*$/}}
                />
                <View style={styles.button}>
                    <Button
                        disabled={!isValid}
                        color="black"
                        title={t('Ban Post')}
                        onPress={() => onSubmit()}
                    />
                </View>
            </View>
            {
                banned === 'true' ? (
                    <View style={styles.button}>
                        <Button
                            color="black"
                            title={t('UnBan Post')}
                            onPress={() => onSubmitUnBan()}
                        />
                    </View>
                ) : (
                    <></>
                )
            }

        </View>
    )
}