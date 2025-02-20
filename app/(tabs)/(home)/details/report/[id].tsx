import {View, Text, TextInput, StyleSheet, useColorScheme, Alert, Button} from "react-native";
import {Controller, useForm} from "react-hook-form";
import React, {useState} from "react";
import Constants from "expo-constants";
import {useTranslation} from "react-i18next";
import {FormData} from "@/app/(tabs)/(insert)/create";
import {ReportCreateForm} from "@/globalRedux/posts/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useLocalSearchParams} from "expo-router";
import {fetchCreateReportForPost} from "@/globalRedux/posts/asyncActions";

export default function Report() {
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const {id} = useLocalSearchParams();

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
    } = useForm<ReportCreateForm>({
        defaultValues: {
            reason:'',
            user_id:'',
            post_id:''
        },
    })
    const onSubmit = async (values) => {
        console.log(values)
        if (data !== null) {
            const lineBreaks = (values.reason.match(/\n/g) || []).length; // Считаем количество переносов строки
            if (lineBreaks > 5) {
                Alert.alert("Reason cannot contain more than 5 line breaks.");
                return; // Выход из функции, если условие не выполнено
            }

            // Проверка на максимальную длину bio
            if (values.reason.length > 250) {
                Alert.alert("Reason cannot exceed 250 characters.");
                return; // Выход из функции, если условие не выполнено
            } else {

                values.post_id = id
                values.user_id = data._id
                console.log(values)
                dispatch(fetchCreateReportForPost(values))
                    .then((response) => {
                        console.log(response)
                        if (response.meta.requestStatus === 'rejected') {
                            // console.log("Request failed")
                            // setSendResponseErrorImage(true)
                        } else if (response.meta.requestStatus === 'fulfilled') {
                            // console.log("Request fulfilled")
                            setSuccessDataChange(true);
                            // router.push(`/${lang}`);
                            // setSuccessImageChange(true)
                        }
                        // handle success response
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }
    return (
        <View style={{padding: 15}}>
            <Text style={styles.label}>{t('Report')}</Text>

            <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                        placeholder={t('Report')}
                        style={styles.inputBio}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        multiline={true}
                        numberOfLines={5}
                        maxLength={250}
                    />
                )}
                name="reason"
                rules={{
                    required: false,
                    maxLength: {
                        value: 250,
                        message: 'Максимум 250 символов',
                    },
                }}
            />
            <View style={styles.button}>
                <Button
                    disabled={!isValid}
                    color="black"
                    title={t('Create Report')}
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
        </View>
    )
}