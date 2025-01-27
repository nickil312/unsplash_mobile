import {
    Alert,
    Button,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import Constants from "expo-constants";
import {Controller, useForm} from "react-hook-form";
import {AccountEditProfile} from "@/globalRedux/users/types";
import {fetchChangeProfileData} from "@/globalRedux/users/asyncActions";

export default function Profilesettings (){
    const currentTheme = useColorScheme()
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const {api_url, data} = useSelector((state: RootState) => state.users);

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
            height: 40,
            width: '100%',
            padding: 10,
            borderRadius: 4,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        inputBio: {
            borderBottomWidth: 1,
            borderBottomColor: currentTheme === "dark" ? 'white' : 'black',
            borderBottomStyle: 'solid',
            height: 120,
            width: '100%',
            padding: 10,
            marginTop:6,
            borderRadius: 4,
            color: currentTheme === "dark" ? 'white' : 'black',
        },
        mainTitle: {
            marginTop: 15,
            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: currentTheme === "dark" ? 'white' : 'black', // Цвет текста в зависимости от темы
        },
        regcontainer: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginLeft: 15,
            marginRight: 15
        }
    });


    useEffect(() => {
        if(data !== null){

        setValue('email', data.email);
        setValue('fullName', data.fullname);
        setValue('_id', data._id);
        setValue('bio', data.bio);
        setValue('messages', data.messages);
        setIsEnabled(data.messages);
        setValue('location', data.location);
        }

    }, []);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const {register, setValue, handleSubmit, setError, control, reset, formState: {errors, isValid},} = useForm<AccountEditProfile>({
        defaultValues: {
            _id: '',
            email: '',
            fullName: '',
            bio: '',
            location:'',

        },

    });
    const onSubmit = async (values) => {
        if(values.fullName === ' '){
            Alert.alert("Please enter a valid fullName");
        }
        const lineBreaks = (values.bio.match(/\n/g) || []).length; // Считаем количество переносов строки
        if (lineBreaks > 5) {
            Alert.alert("Bio cannot contain more than 5 line breaks.");
            return; // Выход из функции, если условие не выполнено
        }

        // Проверка на максимальную длину bio
        if (values.bio.length > 250) {
            Alert.alert("Bio cannot exceed 250 characters.");
            return; // Выход из функции, если условие не выполнено
        }
        else {
            console.log(values)
            console.log(isEnabled)
            const res = await dispatch(fetchChangeProfileData({
                _id:values._id,
                email:values.email,
                fullName:values.fullName,
                bio:values.bio,
                location:values.location,
                messages:isEnabled
            }))
            // console.log(res.error.message)
            console.log(res)
            if(res.error.message){
                console.log(1)
                // Alert.alert("Данные были изменены")
                Alert.alert(t('EmailSwitchErr'))

            }
        }
    }

    return(
        <SafeAreaView style={{flex:1}}>
            <ScrollView>
                <View style={styles.mainTitle}>
                    {t('Profile data')}
                </View>
                <View style={styles.regcontainer}>
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
                        rules={{required: true,minLength: 2,pattern: {
                                value: /^.*[a-zA-Zа-яА-Я]+.*$/,
                                message: 'Поле должно содержать хотя бы одну букву',
                            },}}
                    />
                    <Text style={styles.label}>{t('Location')}</Text>
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                placeholder={t('Location')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                            />
                        )}
                        name="location"
                        rules={{required: false,minLength: 2,pattern: {
                                value: /^.*[a-zA-Zа-яА-Я]+.*$/,
                                message: 'Поле должно содержать хотя бы одну букву',
                            },}}
                    />
                    <Text style={styles.label}>{t('Bio')}</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder={t('Bio')}
                                style={styles.inputBio}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                multiline={true}
                                numberOfLines={5}
                                maxLength={250}
                            />
                        )}
                        name="bio"
                        rules={{
                            required: false,
                            maxLength: {
                                value: 250,
                                message: 'Максимум 250 символов',
                            },
                        }}
                    />

                    <Text style={styles.label}>{t('Messaging')}</Text>
                    <Switch
                        style={{marginTop:20}}
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
                            title={t('Change Profile Data')}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}