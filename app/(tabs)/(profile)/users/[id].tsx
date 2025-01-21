import {Text} from "react-native";
import {Link, useLocalSearchParams} from "expo-router";
import React from "react";

export default function PostDetail(){
    const { id } = useLocalSearchParams();

    return(
        <>
        <Text>
            Detail - {id}
        </Text>
            <Link href="/details/1">View details - 1</Link>
            <Link href="/details/2">View details - 2</Link>

        </>
    )
}