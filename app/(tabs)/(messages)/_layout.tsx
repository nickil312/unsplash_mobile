import {useColorScheme} from "@/components/useColorScheme";
import {useTranslation} from "react-i18next";
import React from "react";
import {Stack} from "expo-router";
import WebSocketProvider from "@/app/websocket_provider";

export default function ChatLayout() {
    const colorScheme = useColorScheme();
    const {t} = useTranslation();

    return (
        <WebSocketProvider>
            <Stack>
                <Stack.Screen name="index"
                              options={{
                                  title: `${t('Chats')}`,
                              }}
                />
                <Stack.Screen name="chats/create" options={{
                    title: `${t('Chat')}`,
                    // presentation: "modal"
                }}/>
                <Stack.Screen name="chats/[id]" options={{
                    title: `${t('Chat')}`,
                    // presentation: "modal"
                }}/>
                <Stack.Screen name="chats/detail/[id]" options={{
                    title: `${t('Chat')}`,
                    // presentation: "modal"
                }}/>
                <Stack.Screen name="chats/update/[id]" options={{
                    title: `${t('Chat')}`,
                    // presentation: "modal"
                }}/>
                <Stack.Screen name="chats/adduser/[id]" options={{
                    title: `${t('Chat')}`,
                    // presentation: "modal"
                }}/>
            </Stack>
        </WebSocketProvider>
    )
}