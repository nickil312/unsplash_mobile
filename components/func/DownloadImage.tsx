// @ts-ignore
// import {saveAs} from 'file-saver';
import axios from "../../axois";
import {DownloadHistoryPost} from "@/globalRedux/users/types";
import * as FileSystem from 'expo-file-system';
import {shareAsync} from 'expo-sharing';

export const DownloadImage = async (imageUrl:string,altText:string,_id:string,api_url:string) => {
    // imageUrl - `${api_url}/${post.imageurl}`
    // altText - post.imageurl
    // _Id - post._id
    const fullImage = imageUrl.replace(/\/down/g, '');
    console.log("fullImage",fullImage)
    const filename = altText.replace(/^.*\//, "");
    console.log("filename",filename)
    // saveAs(fullImage, filename)
    const values = {
        _id:_id
    }
    // добавление поста в историю скачивания
    // axios.post<DownloadHistoryPost>(`/userpostgresql/auth/downloadHistory`,values)

    const result = await FileSystem.downloadAsync(
        `${api_url}/${fullImage}`,
        FileSystem.documentDirectory + filename,
        {
            headers: {
                "MyHeader": "MyValue"
            }
        }
    );
    // // console.log(result)
    await shareAsync(result.uri);
}