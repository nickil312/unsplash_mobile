import {
    View,
    Text,
    useColorScheme,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    Image,
    TextInput,
    Button, Switch
} from "react-native";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import Constants from "expo-constants";
import * as ImagePicker from 'expo-image-picker';
import {Controller, useForm} from "react-hook-form";
import {Octicons} from "@expo/vector-icons";
import {Dropdown} from "react-native-element-dropdown";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {fetchCreatePost} from "@/globalRedux/posts/asyncActions";
import * as SecureStore from "expo-secure-store";
import i18next from "i18next";
import {countview} from "@/app/(tabs)/(home)";

export type FormData = {
    _id: string;
    title: string
    text: string
    tags: string
    imageurl: string
    category: string
    cameracompany: string,
    model: string,
    shutterspeed: string,
    aperture: string,
    focallength: string,
    dimensions: string,
    isocam: string,
    posttype: string
    posttype_boolean: boolean
    license: string
    license_boolean: boolean
    orientation: string
    user_id: string
}
export default function Create() {
    const currentTheme = useColorScheme()
    const [image, setImage] = useState(null);
    const {t} = useTranslation();
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [postType, setPostType] = useState(true);
    const [license, setLicense] = useState(true);
    const {api_url, data} = useSelector((state: RootState) => (state.users))
    const dispatch = useDispatch<AppDispatch>();
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
    });

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {

            const big_im = result.assets

            // console.log(result)
            // console.log(big_im)
            const originalname = big_im[0].uri.substring(big_im[0].uri.lastIndexOf("/") + 1);
            big_im[0].originalname = `${originalname}`
            setImage(big_im);

        }
    };
    if (hasGalleryPermission === false) {
        Alert.alert('Нет доступа к фотографиям');

    }
    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        setError,
        control,
        reset,
        formState: {errors, isValid},
    } = useForm<FormData>({
        defaultValues: {
            posttype_boolean: true,
            license_boolean: true,
            license: 'free',
            posttype: 'photos',
            imageurl: '',
            cameracompany:'',
            model:'',
            shutterspeed:'',
            aperture:'',
            focallength:'',
            dimensions:'',
            isocam:'',
        },
    })
    const onChange = arg => {
        return {
            value: arg.nativeEvent.text,
        };
    };
    const categories = [
        {value: '1', transl: 'Cars', label: `${t('Cars')}`},
        {value: '2', transl: 'Wallpapers', label: `${t('Wallpapers')}`},
        {value: '3', transl: 'Monochromatic', label: `${t('Monochromatic')}`},
        {value: '4', transl: '3D Renders', label: `${t('3D Renders')}`},
        {value: '5', transl: 'Nature', label: `${t('Nature')}`},
        {value: '6', transl: 'Minimalism', label: `${t('Minimalism')}`},
        {value: '7', transl: 'Textures & Patterns', label: `${t('Textures & Patterns')}`},
        {value: '8', transl: 'Street Photography', label: `${t('Street Photography')}`},
    ]
    // {en: "Landscape", ru: "Горизонтальная"},
    // {en: "Portrait", ru: "Вертикальная"}
    const orientation = [
        {
            value: "1",
            label:"Landscape",
            labelru:"Горизонтальная",
            // value: `${t('Landscape')}`

        },
        {
            value: "2",
            label:"Portrait",
            labelru:"Вертикальная",
            // value: `${t('Portrait')}`,
        }
    ]
    const onSubmit = async (values) => {
        // console.log(values)
        // console.log("image",image[0])
        // console.log("image",image[0].originalname)
        const orientationValue = (values) => values === "1" ? "Landscape" : values === "2" ? "Portrait" : "err";
        const categoryValue = (values) => values === "1" ? "Cars" :
            values === "2" ? "Wallpapers" :
                values === "3" ? "Monochromatic" :
                    values === "4" ? "3D Renders" :
                        values === "5" ? "Nature" :
                            values === "6" ? "Minimalism" :
                                values === "7" ? "Textures & Patterns" :
                                    values === "8" ? "Street Photography" : "err";

        values.orientation = orientationValue(values.orientation); // Call the function with input
        values.category = categoryValue(values.category); // Call the function with input

        // console.log(values)
        console.log(isValid)
        if (data !== null) {
            values.user_id = data._id;
            if (postType) {
                //     создание фото
                values.posttype = 'Photos'
            } else {
                //     создание иллюстрации
                values.posttype = 'Illustrations'

            }
            if (license) {
                //     создание фото
                values.license = 'Unsplash+'
            } else {
                //     создание иллюстрации
                values.license = 'Free'

            }
            // console.log("image",image[0].originalname)
            // console.log("image",image)
            // values.imageurl = `uploads/down/${image[0].originalname}`
            const formData = new FormData();

            formData.append('image', {
                uri: image[0].uri,
                name: image[0].originalname,
                type: 'image/jpeg'
            });
            const userToken = await SecureStore.getItemAsync('token');
            // console.log(userToken)
            const response = await fetch(`${api_url}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            });

            const responseData = await response.json();
            values.imageurl = responseData.compressedUrl;
            values.tags = values.tags.trim().replace(/\s*,\s*/g, ',').replace(/^\,|\,$/g, '').replace(/,+/g, ',');
            values.tags = values.tags.trim().split(/\s*,\s*/).filter(Boolean);
            // console.log(values)
            dispatch(fetchCreatePost(values))
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

        }else {
            console.log("data null!")
            // router.push(`/${lang}/login`);

        }


    }
    const local_data = orientation.map(item => ({
        value: item.value,
        lable: i18next.language === "en" ? item.label : item.labelru, // Используем функцию для получения текста
    }));
    return (
        <SafeAreaView>
            <ScrollView>
                {
                    image === null ? (
                        <View onTouchEndCapture={() => pickImage()} style={{padding: 15}}>
                            <Text>
                                {t('ChooseImg')}
                            </Text>
                        </View>
                    ) : (
                        <Image source={{uri: image[0].uri}} style={{height: 300, width: '100%'}}/>
                    )
                }


                <View style={{padding: 15}}>
                    <Text style={styles.label}>{t('Title')}</Text>
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                placeholder={t('Title')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                            />
                        )}
                        name="title"
                        rules={{required: true, minLength: 2, pattern: /^.*[a-zA-Zа-яА-Я]+.*$/}}
                    />

                    <Text style={styles.label}>{t('Text')}</Text>
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                placeholder={t('Text')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                            />
                        )}
                        name="text"
                        rules={{required: true, minLength: 2, pattern: /^.*[a-zA-Zа-яА-Я]+.*$/}}
                    />

                    <Text style={styles.label}>{t('Tags')}</Text>
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                placeholder={t('tag1tag2')}
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                            />
                        )}
                        name="tags"
                        rules={{required: true, minLength: 2, pattern: /^(?!\s*$)([^,]+(?:,\s*[^,]+)*)$/}}
                    />

                    <Text style={styles.label}>{t('Category')}</Text>
                    <View style={{width: '100%', marginTop: 15}}>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    placeholderStyle={styles.placeholderStyle}
                                    maxHeight={200}
                                    value={value}
                                    data={categories}
                                    valueField="value"
                                    labelField="label"
                                    placeholder={`${t('Select category')}`}
                                    searchPlaceholder="Search..."
                                    onChange={e => onChange(e.value)}
                                />
                            )}
                            name="category"
                            rules={{required: true}}
                        />
                    </View>
                    <View style={{width: '100%', marginTop: 15}}>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <Dropdown
                                    style={styles.dropdown}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    placeholderStyle={styles.placeholderStyle}
                                    maxHeight={200}
                                    value={value}
                                    data={local_data}
                                    valueField="value"
                                    labelField="lable"
                                    placeholder={`${t('Select orientation')}`}
                                    searchPlaceholder="Search..."
                                    onChange={e => onChange(e.value)}
                                />
                            )}
                            name="orientation"
                            rules={{required: true}}
                        />
                    </View>

                    {/* Switch for posttype_boolean */}
                    <Text style={styles.label}>{t('Photo fields')}</Text>
                    <View style={styles.switchContainer}>

                        <Switch
                            value={postType}
                            onValueChange={() => setPostType(!postType)}
                            style={styles.switch}
                        />

                    </View>
                    {/* Switch for license_boolean */}
                    <Text style={styles.label}>{t('Unsplash+')}</Text>
                    <View style={styles.switchContainer}>

                        <Switch
                            value={license}
                            onValueChange={() => setLicense(!license)}
                            style={styles.switch}
                        />
                    </View>

                    {postType && (
                        <>
                            <Text style={styles.label}>{t('Camera Company')}</Text>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        placeholder="Fuji"
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="cameracompany"
                                rules={{required: postType, minLength: 2, pattern: /^.*[a-zA-Zа-яА-Я]+.*$/}}
                            />

                            <Text style={styles.label}>{t('Model of Camera')}</Text>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        placeholder="Fuji X100V"
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="model"
                                rules={{required: postType, minLength: 2, pattern: /^(?=.*[a-zA-Zа-яА-Я])(?=.*\d)?[a-zA-Zа-яА-Я\d\s]+$/}}
                            />

                            <Text style={styles.label}>{t('ShutterSpeed')}</Text>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        placeholder='1/300'
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="shutterspeed"
                                rules={{required: postType, minLength: 2, pattern: /^\d+\/\d+$/}}
                            />

                            <Text style={styles.label}>{t('Aperture')}</Text>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        placeholder='f/4.0'
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="aperture"
                                rules={{required: postType, minLength: 2, pattern: /^f\/\d+(\.\d+)?$/}}
                            />

                            <Text style={styles.label}>{t('FocalLength')}</Text>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        placeholder='50mm'
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="focallength"
                                rules={{required: postType, minLength: 2, pattern: /^(\d{2}|\d{3})\s*mm$/}}
                            />

                            <Text style={styles.label}>{t('ISO')}</Text>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        placeholder='300'
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="isocam"
                                rules={{required: postType, minLength: 2, pattern: /^\d+$/}}
                            />

                            <Text style={styles.label}>{t('Dimensions')}</Text>
                            <Controller
                                control={control}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        placeholder='2560x1440'
                                        style={styles.input}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="dimensions"
                                rules={{required: postType, minLength: 2, pattern: /^\d+\s*x\s*\d+$/}}
                            />
                        </>
                    )}

                    <View style={styles.button}>
                        <Button
                            disabled={!isValid}
                            color="black"
                            title={t('Create Post')}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>


    )

}