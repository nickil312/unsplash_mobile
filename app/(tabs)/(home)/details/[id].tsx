import {Text} from "react-native";
import {useLocalSearchParams} from "expo-router";

export default function PostDetail(){
    const { id } = useLocalSearchParams();

    return(
        <Text>
            Detail - {id}
        </Text>
    )
}