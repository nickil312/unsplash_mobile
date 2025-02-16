import {ReportsCardProps} from "@/app/(tabs)/(add)/reported";
import {View, Text, Image, useColorScheme} from "react-native";
import React from "react";
import {useTranslation} from "react-i18next";

export default function ReportCard({
                                       imageurl,
                                       fullname,
                                       title,
                                       text,
                                       user_id,
                                       post_id,
                                       _id,
                                       report_count,
                                       banned,
                                       api_url
                                   }: ReportsCardProps) {
    const {t} = useTranslation();
    const currentTheme = useColorScheme()

    return (
        <View style={{flexDirection: "row",padding:15,paddingBottom:0}}>
            <Image source={{uri: `${api_url}/${imageurl}`}} style={{width: 150, height: 150, borderRadius: 4}}/>
            <View style={{marginLeft:7.5,width:200}}>

                <Text style={{color: `${currentTheme === "dark" ? 'white' : "black"}` }}>
                    {title}
                </Text>
                <Text style={{fontSize: 12,color:'#6A6A6A'}}>
                    {text}
                </Text>
                <Text style={{color: `${currentTheme === "dark" ? 'white' : "black"}` }}>
                    {t('report count')} - {report_count}
                </Text>
            </View>
        </View>
    )
}