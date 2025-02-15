import {Post} from "@reduxjs/toolkit/src/query/tests/mocks/handlers";
import {View, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import {Link} from "expo-router";

export default function CategoryPost({name, imageUrl, api_url}: { name: string, imageUrl: string, api_url: string }) {
    let nameParts = [name];

    if (name.length > 13) {
        const words = name.split(' ');
        const midIndex = Math.floor(words.length / 2);
        const firstPart = words.slice(0, midIndex).join(' ');
        const secondPart = words.slice(midIndex).join(' ');
        nameParts = [firstPart, secondPart];
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            marginTop: 10,
            backgroundColor: '#CDDDEF00',
            width: 125,
            height: 125,
            marginLeft: 7.5,
            marginRight: 7.5,

        },
        image: {
            width: 125,
            height: 125,
            borderRadius: 8
        },
        text: {
            marginTop: -72.5,
            textAlign: 'center',
            color: 'white',
        },
        minusText: {
            marginTop: -35.5,
            textAlign: 'center',
            color: 'white',
        }
    })
    return (
            // <Link href={`/category/${name}`}>
        // <TouchableOpacity onPress={() => {
        //
        // }}>
        <View style={styles.container} >

            <Image style={styles.image} source={{uri: `${api_url}/${imageUrl}`}}/>
            {
                name.length > 13 ? (
                    <>

                        <Text style={styles.text}>{nameParts[1]}</Text>
                        <Text style={styles.minusText}>{nameParts[0]}</Text>
                    </>
                ) : (
                    <Text style={styles.text}>{name}</Text>

                )
            }

        </View>
    // </TouchableOpacity>
            // </Link>
    )
}