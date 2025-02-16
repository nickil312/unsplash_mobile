import {ScrollView, StyleSheet, TextInput, Image, Alert} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import {Text, View} from '@/components/Themed';
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/globalRedux/store";
import {clearUsersWithSearchCount} from "@/globalRedux/users/slice";
import {fetchAllPostsWithSearch} from "@/globalRedux/posts/asyncActions";
import {Link, useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import CategoryPost from "@/components/miniPost/CategoryPost";
import {useColorScheme} from "@/components/useColorScheme";

export default function SearchScreen() {
    const [value, setValue] = useState(''); // Состояние для хранения значения ввода
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation();
    const {api_url} = useSelector((state: RootState) => state.users);
    const currentTheme = useColorScheme();
    const router = useRouter();

    const handleSearch = () => {
        // dispatch(clearUsersWithSearchCount());
        // dispatch(fetchAllPostsWithSearch({
        //     searchtext: value, // Используем значение из состояния
        //     page: 0,
        //     role_id: 0,
        //     category: "",
        //     posttype: "photos",
        //     orientation: null,
        //     license: null,
        //     limit: null,
        //     sort: null
        // }));
        if (value.length > 0) {

            router.push(`/search/${value}`);
        } else {
            Alert.alert("add text in the field");
        }

    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 16,
            backgroundColor: currentTheme === 'dark' ? 'black' : 'white',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 16,
        },
        searchInput: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            borderRadius: 5,
            width: '100%', // Full width
        },
        scrollView: {
            marginTop: 8,
        },
        image: {
            width: '100%',
            height: '70%',
            borderRadius: 5,
        },
        blockText: {
            textAlign: 'center',
            marginTop: 5,
        },
    });
    const data = [{
        id: 1,
        name: "Cars",
        name_transl: `${t('Cars')}`,
        imageUrl: "uploads/down/jorgen-hendriksen-lX2YG5w4_gs-unsplash.jpg",
    }, {
        id: 2,
        name: "Wallpapers",
        name_transl: `${t('Wallpapers')}`,
        imageUrl: "uploads/down/brian-0CkKk5ttn3I-unsplash.jpg",
    }, {
        id: 3,
        name: "Monochromatic",
        name_transl: `${t('Monochromatic')}`,
        imageUrl: "uploads/down/jack-gardner-arjiIKicU-0-unsplash.jpg",
    }, {
        id: 4,
        name: "3D Renders",
        name_transl: `${t('3D Renders')}`,
        imageUrl: "uploads/down/alex-shuper-XRr_cRETpnc-unsplash.jpg",
    }, {
        id: 5,
        name: "Nature",
        name_transl: `${t('Nature')}`,
        imageUrl: "uploads/down/roksolana-zasiadko-65exw40ulRc-unsplash.jpg",
    }, {
        id: 6,
        name: "Minimalism",
        name_transl: `${t('Minimalism')}`,
        imageUrl: "uploads/down/lena-polishko-QjnjCLTM4eU-unsplash.jpg",
    }, {
        id: 7,
        name: "Textures & Patterns",
        name_transl: `${t('Textures & Patterns')}`,
        imageUrl: "uploads/down/bro-takes-photos-P0RrSzEEMB8-unsplash.jpg",
    }, {
        id: 8,
        name: "Street Photography",
        name_transl: `${t('Street Photography')}`,
        imageUrl: "uploads/down/02573211-C3B3-43AB-AF05-359EA6D7DF3A.jpg",
    }];
    const data2 = [{
        id: 8,
        name: "Photos",
        name_transl: `${t('Photos')}`,
        imageUrl: "uploads/down/Tomas%20Malik%20Unsplash.jpg",
    }, {
        id: 1,
        name: "Illustrations",
        name_transl: `${t('Illustrations')}`,
        imageUrl: "uploads/down/Pinterest.jpeg",
    }, {
        id: 2,
        name: "Unsplash+",
        name_transl: `${t('Unsplash+')}`,
        imageUrl: "uploads/down/Mazda%20Rx7%20from%20Mathew%20Antony.jpg",
    }, {
        id: 3,
        name: "Animals",
        name_transl: `${t('Animals')}`,
        imageUrl: "uploads/down/IMG_3460.jpg",
    }, {
        id: 4,
        name: "Food",
        name_transl: `${t('Food')}`,
        imageUrl: "uploads/down/IMG_3551.jpg",
    }, {
        id: 5,
        name: "Tech",
        name_transl: `${t('Tech')}`,
        imageUrl: "uploads/down/Gray Black Laptop Photo.jpg",
    }, {
        id: 6,
        name: "Shoes",
        name_transl: `${t('Shoes')}`,
        imageUrl: "uploads/down/IMG_3025.JPG",
    }, {
        id: 7,
        name: "People",
        name_transl: `${t('People')}`,
        imageUrl: "uploads/down/IMG_2582.jpg",
    },
    ]

    return (
        <ScrollView style={styles.container}>
            {/*<Text style={styles.title}>Search</Text>*/}
            <TextInput placeholder="search test"
                       value={value} // Привязываем значение поля ввода к состоянию
                       onChangeText={setValue} // Обновляем состояние при изменении текста
                       onSubmitEditing={handleSearch} // Вызываем функцию поиска при отправке
                       style={{
                           borderWidth: 1,
                           borderColor: '#ccc',
                           padding: 10,
                           borderRadius: 5,
                           marginLeft: 8,
                           marginRight: 8,
                           backgroundColor: currentTheme === 'dark' ? 'black' : 'white',
                       }} // Пример стилей

            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                    style={{flexDirection: "column", backgroundColor: currentTheme === 'dark' ? 'black' : '#F2F2F2',}}>
                    <View style={{flexDirection: 'row'}}>

                        {data.map((item,index) => (
                            <Link href={`/category/${item.name}`}
                                  style={{ marginLeft: 7.5, marginTop: 8,
                                      marginRight: index === data2.length - 1 ? 7.5 : 0
                                  }}>

                                <CategoryPost key={item.id} name={item.name_transl} imageUrl={item.imageUrl}
                                              api_url={api_url}/>
                            </Link>
                        ))}
                    </View>
                    <View style={{flexDirection: 'row'}}>

                        {data2.map((item,index) => (
                            <Link href={`/category/${item.name}`}
                                  style={{ marginLeft: 7.5, marginTop: 8,
                                      marginRight: index === data2.length - 1 ? 7.5 : 0
                                  }}>

                                <CategoryPost key={item.id} name={item.name_transl} imageUrl={item.imageUrl}
                                              api_url={api_url}/>
                            </Link>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </ScrollView>
    );
}

