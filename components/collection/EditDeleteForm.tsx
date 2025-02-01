import {View, Text, TextInput, Switch, Button, useColorScheme, StyleSheet, Alert} from "react-native";
import {Controller, useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/globalRedux/store";
import Constants from "expo-constants";
import {CollectionUpdateForm} from "@/globalRedux/posts/types";
import {fetchUpdateCollection} from "@/globalRedux/posts/asyncActions";

export default function EditDeleteForm({id, name, description, privateStatus}: {
    id: string,
    name: string,
    description: string,
    privateStatus: boolean
}) {
    const currentTheme = useColorScheme()
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
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
            justifyContent: 'center',
            paddingTop: Constants.statusBarHeight,
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


    const {
        register,
        setValue,
        handleSubmit,
        setError,
        control,
        reset,
        formState: {errors, isValid},
    } = useForm<CollectionUpdateForm>({
        defaultValues: {
            name: name,
            description: description,
            privateStatus: privateStatus,
            id: id
        },

    });
    const [characterNameCount, setCharacterNameCount] = useState(20);
    const [characterCount, setCharacterCount] = useState(250);
    const [isEnabled, setIsEnabled] = useState(privateStatus);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    const onSubmit = async (values) => {
        console.log("values", values);
        if (values.name === ' ') {
            Alert.alert(t("Please enter a valid name"));
        }
        const lineBreaks = (values.description.match(/\n/g) || []).length; // Считаем количество переносов строки
        if (lineBreaks > 5) {
            Alert.alert(t("Description cannot contain more than 5 line breaks."));
            return; // Выход из функции, если условие не выполнено
        }

        // Проверка на максимальную длину bio
        if (values.description.length > 250) {
            Alert.alert(t("Description cannot exceed 250 characters."));
            return; // Выход из функции, если условие не выполнено
        } else {
            // console.log("isE", isEnabled);
            dispatch(fetchUpdateCollection({
                id: values.id,
                name: values.name,
                description: values.description,
                privateStatus: isEnabled
            }))
                .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        // console.log("Request failed")
                        Alert.alert("Error");

                        // setSendResponseErrorImage(true)
                    } else if (response.meta.requestStatus === 'fulfilled') {
                        // console.log("Request fulfilled")
                        // setSuccessDataChange(true);
                        Alert.alert("Collection updated successfully.");
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


    return (
        <View style={styles.formcontainer}>
            <Text style={styles.label}>{t('Name')}</Text>
            <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                        placeholder={t('Name')}
                        style={styles.input}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                    />
                )}
                name="name"
                rules={{required: true, pattern: /^.*[a-zA-Zа-яА-Я]+.*$/}}
            />
            <Text style={styles.label}>{t('Description')}</Text>
            <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                        placeholder={t('Description')}
                        style={styles.inputBio}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        multiline={true}

                    />
                )}
                name="description"
                rules={{
                    required: false,
                    maxLength: {
                        value: 250,
                        message: 'Максимум 250 символов',
                    },
                }}
            />

            <Text style={styles.label}>{t('Private')}</Text>
            <Switch
                style={{marginTop: 20}}
                // trackColor={{false: '#767577', true: '#d2d2d2'}}
                // thumbColor={isEnabled ? 'rgba(37,36,36,0.81)' : '#f4f3f4'}
                // ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}

            />

            <View style={styles.button}>
                <Button
                    disabled={!isValid}
                    color="black"
                    title={t('Edit Collection')}
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
        </View>

    )
}