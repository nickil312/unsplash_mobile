import React from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme} from "react-native";
import {Messages} from "@/globalRedux/chats/types";
import {useTranslation} from "react-i18next";
import i18next from "@/i18n";

type MessageCardProps = Messages & {
    self: boolean;
    api_url: string;
    onEdit: () => void;
    onDelete: () => void;
    edit: boolean;
};

export default function MessageCard({
                                        fullname,
                                        avatarUrl,
                                        _id,
                                        content,
                                        createdAt,
                                        self,
                                        api_url,
                                        onEdit,
                                        edit,
                                        onDelete
                                    }: MessageCardProps) {
    const currentTheme = useColorScheme() // Считывание темы телефона
    // console.log('createdAt',createdAt)
    // const formattedTime = new Intl.DateTimeFormat(i18next.language, {
    //     hour: '2-digit',
    //     minute: '2-digit'
    // }).format(new Date(createdAt));
    const styles = StyleSheet.create({
        selfMessageContainer: {
            paddingLeft:5,
            paddingRight:5,
            flexDirection: 'column',
            alignItems: 'flex-end',
            marginTop: 10,
            width: '100%',
        },
        otherMessageContainer: {
            paddingLeft:5,
            paddingRight:5,

            flexDirection: 'row',
            marginTop: 10,
            width: '100%',
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: 8,
        },
        messageContentContainer: {
            flexDirection: 'column',
            flex: 1,
        },
        messageText: {
            fontSize: 16,
            paddingTop: 10,
            // borderRadius: 5,
            // backgroundColor: '#f1f1f1',
            color: currentTheme === "dark" ? "white" : "black",

        },
        fullnameText: {
            fontSize: 14,
            color: currentTheme === "dark" ? "white" : "black",

        },
        messageRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        messageInfoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
        },
        editText: {
            fontSize: 12,
            color: '#888',
            marginRight: 5,
        },
        timeText: {
            fontSize: 12,
            color: '#888',
        },
    });
    if (self) {
        return (
            <View style={styles.selfMessageContainer}>
                <Text style={styles.messageText}>{content}</Text>
                <View style={styles.messageInfoContainer}>
                    {edit && (
                        <Text style={styles.editText}>
                            edited
                        </Text>
                    )}
                    <Text style={styles.timeText}>{new Intl.DateTimeFormat(i18next.language, {
                        hour: '2-digit',
                        minute: '2-digit'
                    }).format(new Date(createdAt))}</Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.otherMessageContainer}>
                <Image
                    style={styles.avatar}
                    source={{uri: `${api_url}/${avatarUrl}`}}
                    alt="user photo"
                />
                <View style={styles.messageContentContainer}>
                    <Text style={styles.fullnameText}>{fullname}</Text>
                    <View style={styles.messageRow}>
                        <Text style={styles.messageText}>{content}</Text>
                    </View>
                    <View style={styles.messageInfoContainer}>
                        {edit && (
                            <Text style={styles.editText}>
                                {/*{lang === "en" ? "edited" : "изменено"}*/}
                                edited
                            </Text>
                        )}
                        <Text style={styles.timeText}>{new Intl.DateTimeFormat(i18next.language, {
                            hour: '2-digit',
                            minute: '2-digit'
                        }).format(new Date(createdAt))}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

