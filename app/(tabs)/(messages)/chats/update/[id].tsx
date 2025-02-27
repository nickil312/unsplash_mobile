import {ScrollView,Text} from "react-native";
import {useLocalSearchParams} from "expo-router";

export default function UpdateChat(){
    const {id} = useLocalSearchParams();

    return(
        <ScrollView>
            <Text>
                Update
            </Text>
        </ScrollView>
    )
}