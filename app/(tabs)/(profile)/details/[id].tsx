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
            <Link href="/users/2">View users - 2</Link>
            <Link href="/users/2">View users - 2</Link>

        </>
    )
}