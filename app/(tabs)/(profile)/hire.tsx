import {View, Text, Switch, StyleSheet, Button, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import {Cities, work} from "@/app/(tabs)/(profile)/index";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/globalRedux/store";
import {fetchChangeHireData, fetchGetHireData} from "@/globalRedux/users/asyncActions";
import i18next from "@/i18n";

export default function Hire() {
    const [selectedWork, setSelectedWork] = useState<string[]>([]);
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const [hireValue, setHireValue] = useState<boolean>(false);

    const handleSwitchChange = (cityId: string) => {
        setSelectedWork((prevSelected) => {
            if (prevSelected.includes(cityId)) {
                // Если id уже выбран, убираем его из массива
                return prevSelected.filter(id => id !== cityId);
            } else {
                // Если id не выбран, добавляем его в массив
                return [...prevSelected, cityId];
            }
        });
    };
    const handleSwitchChangeCities = (cityId: string) => {
        setSelectedCities((prevSelected) => {
            if (prevSelected.includes(cityId)) {
                // Если id уже выбран, убираем его из массива
                return prevSelected.filter(id => id !== cityId);
            } else {
                // Если id не выбран, добавляем его в массив
                return [...prevSelected, cityId];
            }
        });
    };
    useEffect(() => {
        dispatch(fetchGetHireData())
            .then((response) => {
                    console.log(response)
                    if (response.meta.requestStatus === 'rejected') {
                        console.log("Request failed")
                        // setSendResponseErrorImage(true)
                    } else if (response.meta.requestStatus === 'fulfilled') {
                        // console.log("Request fulfilled")

                        const {payload} = response;
                        // console.log("payload", payload);

                        if (payload !== null) {
                            // console.log("payload", payload);
                            const payloadData = payload as {
                                hirevalue: boolean;
                                cities: string[];
                                work: string[];
                            };

                            // Extract data from payload
                            const {
                                hirevalue,
                                cities,
                                work,
                            } = payloadData;
                            // console.log("payloadData",payloadData)
                            setHireValue(hirevalue);
                            setSelectedCities(cities);
                            setSelectedWork(work);
                        }
                    }
                }
            )

    }, [])
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        subtitle: {
            color: '#76A',
        },
        divBlock: {
            marginBottom: 16,
        },
        switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 4,
        },
        switch: {
            marginRight: 8,
        },
        infoText: {
            marginTop: 16,
            fontSize: 14,
            color: '#555',
        },
        button: {
            marginTop: 40,
            height: 40,
            backgroundColor: '#d2d2d2',
            borderRadius: 4,
            width: '100%',
        },
    });
    const onSubmit = () => {
        console.log(selectedWork)
        console.log(selectedCities)
        const data = {
            cities: selectedCities,
            work: selectedWork,
            hirevalue: hireValue,
        }
        console.log(data)
        dispatch(fetchChangeHireData(data))
            .then((response) => {
                console.log(response)
                if (response.meta.requestStatus === 'rejected') {
                    // console.log("Request failed")
                    // setError(true);
                } else if (response.meta.requestStatus === 'fulfilled') {
                    // console.log("Request fulfilled")
                    // router.push(`/${lang}`);
                    // setSuccess(true);

                }
                // handle success response
            })
            .catch((error) => {
                console.log(error)

            })
    }
    return (
        <ScrollView>


            <View style={styles.container}>
                <Text style={styles.title}>
                    {t('HiringTitle')}
                </Text>
                <Switch
                    value={hireValue}
                    onValueChange={() => setHireValue(!hireValue)}
                    style={styles.switch}
                />
                <View style={{marginBottom:15}}/>
                <Text style={styles.title}>
                    {t('HiringWorkTitle')}
                    <Text style={styles.subtitle}>
                        {t('HiringApply')}
                    </Text>
                </Text>
                <View style={styles.divBlock}>
                    {work.map((city) => (
                        <View key={city.id} style={styles.switchContainer}>
                            <Switch
                                value={selectedWork.includes(city.id)}
                                onValueChange={() => handleSwitchChange(city.id)}
                                style={styles.switch}
                            />
                            <Text>
                                {i18next.language === 'en' ? city.label.en : city.label.ru}
                            </Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.infoText}>
                    {t('HiringWorkHint')}
                </Text>
                <Text style={styles.title}>
                    {t('HiringCitiesTitle')}
                </Text>
                <View style={styles.divBlock}>
                    {Cities.map((city) => (
                        <View key={city.id} style={styles.switchContainer}>
                            <Switch
                                value={selectedCities.includes(city.id)}
                                onValueChange={() => handleSwitchChangeCities(city.id)}
                                style={styles.switch}
                            />
                            <Text>
                                {i18next.language === 'en' ? city.label.en : city.label.ru}
                            </Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.infoText}>
                    {t('HiringCitiesHint')}
                </Text>
                <View style={styles.button}>
                    <Button
                        color="black"
                        title={t('Change Profile Data')}
                        onPress={onSubmit}
                    />
                </View>
            </View>
        </ScrollView>
    )
}