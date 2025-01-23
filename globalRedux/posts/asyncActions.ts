import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axois";
import {
    Ban_Post,
    Banned_Params,
    CollectionAddImageProps,
    CollectionCreateForm,
    CollectionDeleteOrRecoverForm, CollectionPostsDatabase,
    Collections,
    CollectionUpdateForm,
    DeleteId,
    ImageAddToCollectionProps, Logs,
    Posts,
    PostsIdProps,
    PostsIdPropsForStatistics,
    PostsStatistics, ReportCreateForm, ReportDetail,
    ReportsDatabase,
    SearchAndSortParams,
    UserPosts_Likes_coll_Params,
    ViewsLikes,
} from "@/globalRedux/posts/types";
import {FormData} from "@/app/[lang]/(photos & illustrations)/photos/create/CreateForm";
import {ReportsCardProps} from "@/app/components/Cards/ReportsCard";
export const fetchAllPosts = createAsyncThunk<Posts[], SearchAndSortParams>(
    'users/fetchAllPosts', async (params) => {
        const {
            searchtext,
            page,
            role_id,
            category,
            sort,
            posttype,
            orientation,
            license,
            limit,

        } = params
        console.log('all users params',params)

        const {data} = await axios.get<Posts[]>(`/postgresql/posts/?page=${page}&role_id=0&searchtext=&posttype=${posttype}&category=&sort=${sort}&license=${license}&orientation=${orientation}&limit=${limit}&search=false`)
    console.log('all users', data)
    return data;
})
export const fetchAllPostsWithSearch = createAsyncThunk<Posts[], SearchAndSortParams>(
    'users/fetchAllPostsWithSearch',
    async (params) => {
        const {
            searchtext,
            page,
            role_id,
            license,
            orientation,
            limit,
            sort,
            posttype,
        } = params
        console.log(params)
    const {data} = await axios.get<Posts[]>(`/postgresql/posts/?page=${page}&role_id=0&searchtext=${searchtext}&posttype=${posttype}&category=&sort=${sort}&license=${license}&orientation=${orientation}&limit=${limit}&search=true`)
    console.log('all users with search', data)
    return data;
})
export const fetchAllPostsWithCategory = createAsyncThunk<Posts[], SearchAndSortParams>(
    'users/fetchAllPostsWithCategory',
    async (params) => {
        const {
            searchtext,
            page,
            category,
            role_id,
            license,
            orientation,
            limit,
            sort,
            posttype,
        } = params
        console.log(params)
        const {data} = await axios.get<Posts[]>(`/postgresql/posts/?page=${page}&role_id=0&searchtext=&posttype=${posttype}&category=${category}&sort=${sort}&license=${license}&orientation=${orientation}&limit=${limit}&search=false`)
        console.log('all users with categories', data)
        return data;
    })
export const fetchOnePost = createAsyncThunk<Posts, PostsIdProps>(
    'users/fetchOnePost',
    async (params) => {
        const {
            _id,
            user_id,
        } = params
        console.log(params)
        const {data} = await axios.get<Posts>(`/postgresql/posts/detail/${_id}?user_id=${params.user_id}`);
        console.log('one post', data)
        return data;
    })
export const fetchPosts_Likes_coll_another_user = createAsyncThunk<Posts[], UserPosts_Likes_coll_Params>(
    'users/fetchPosts_Likes_coll_another_user',
    async (params) => {
        const {
            bdType,
            page,
            userIdAccViewed
        } = params
        console.log(params)
        const {data} = await axios.get<Posts[]>(`/postgresql/posts/user/?page=${page}&bdType=${bdType}&userIdAccViewed=${userIdAccViewed}`)
        console.log('user users likes coll', data)
        return data;
    })
export const fetchCreatePost = createAsyncThunk<Posts[], FormData>(
    'users/fetchCreatePost',
    async (params) => {

        console.log(params)
        const {data} = await axios.post<Posts[]>(`/postgresql/posts/`,params)
        console.log('create users ', data)
        return data;
    })
export const fetchUpdatePost = createAsyncThunk<Posts[], FormData>(
    'users/fetchUpdatePost',
    async (params) => {

        console.log(params)
        const {data} = await axios.patch<Posts[]>(`/postgresql/posts/${params._id}`,params)
        console.log('update users ', data)
        return data;
    })
export const fetchDeletePost = createAsyncThunk<Posts[], DeleteId>(
    'users/fetchDeletePost',
    async (params) => {

        console.log(params)
        const {data} = await axios.delete<Posts[]>(`/postgresql/posts/${params._id}`)
        console.log('update users ', data)
        return data;
    })
export const fetchBannedPosts = createAsyncThunk<Posts[], Banned_Params>(
    'users/fetchBannedPosts',
    async (params) => {

        console.log(params)
        const {data} = await axios.get<Posts[]>(`/postgresql/posts/ban_post/get/?page=${params.page}`)
        console.log('banned users ', data)
        return data;
    });
export const fetchBanPost = createAsyncThunk<Posts[], Ban_Post>(
    'users/fetchBanPost',
    async (params) => {

        console.log(params)
        const {data} = await axios.patch<Posts[]>(`/postgresql/posts/ban_post/update`,params)
        console.log('ban post ', data)
        return data;
    })
export const fetchUnBanPost = createAsyncThunk<Posts[], Ban_Post>(
    'users/fetchUnBanPost',
    async (params) => {

        console.log(params)
        const {data} = await axios.patch<Posts[]>(`/postgresql/posts/unban_post/${params._id}`,params)
        console.log('ban post ', data)
        return data;
    })
export const fetchPostStatistics = createAsyncThunk<PostsStatistics[], PostsIdPropsForStatistics>(
    'users/fetchPostStatistics',
    async (params) => {

        console.log(params)
        const {data} = await axios.get<PostsStatistics[]>(`/postgresql/posts/detail/statistics/${params._id}`)
        console.log('statistics post ', data)
        return data;
    })
export const fetchPostsDatabase = createAsyncThunk<Posts[]>(
    'users/fetchPostsDatabase',
    async () => {

        // console.log(params)
        const {data} = await axios.get<Posts[]>(`/postgresql/database/posts`)
        console.log('database post ', data)
        return data;
    })
export const fetchReportsDatabase = createAsyncThunk<ReportsDatabase[]>(
    'users/fetchReportsDatabase',
    async () => {

        // console.log(params)
        const {data} = await axios.get<ReportsDatabase[]>(`/postgresql/database/reports`)
        console.log('database reports ', data)
        return data;
    })
export const fetchLikesViewsDatabase = createAsyncThunk<ViewsLikes[]>(
    'users/fetchLikesViewsDatabase',
    async () => {

        // console.log(params)
        const {data} = await axios.get<ViewsLikes[]>(`/postgresql/database/likesviews`)
        console.log('database likesViews ', data)
        return data;
    });
export const fetchAllCollectionsDatabase = createAsyncThunk<Collections[]>(
    'users/fetchAllCollectionsDatabase',
    async () => {

        // console.log(params)
        const {data} = await axios.get<Collections[]>(`/postgresql/database/collections`)
        console.log('database all collectionsmodal ', data)
        return data;
    });
export const fetchCollectionsPostsDatabase = createAsyncThunk<CollectionPostsDatabase[]>(
    'users/fetchCollectionsPostsDatabase',
    async () => {

        // console.log(params)
        const {data} = await axios.get<CollectionPostsDatabase[]>(`/postgresql/database/collectionsposts`)
        console.log('database  collectionsmodal users', data)
        return data;
    });
export const fetchLogsDatabase = createAsyncThunk<Logs[]>(
    'users/fetchLogsDatabase',
    async () => {

        // console.log(params)
        const {data} = await axios.get<Logs[]>(`/postgresql/database/logs`)
        console.log('database  logs', data)
        return data;
    });
export const fetchReportedPosts = createAsyncThunk<ReportsCardProps[],Banned_Params>(
    'users/fetchReportedPosts',
    async (params) => {

        // console.log(params)
        const {data} = await axios.get<ReportsCardProps[]>(`/postgresql/posts/report/?page=${params.page}`)
        console.log('reported users', data)
        return data;
    });
export const fetchReportedPostsDetail = createAsyncThunk<ReportDetail[],DeleteId>(
    'users/fetchReportedPostsDetail',
    async (params) => {

        // console.log(params)
        const {data} = await axios.get<ReportDetail[]>(`/postgresql/posts/report/${params._id}`)
        console.log('reported users detail', data)
        return data;
    });
export const fetchCreateReportForPost = createAsyncThunk<ReportCreateForm[],ReportCreateForm>(
    'users/fetchCreateReportForPost',
    async (params) => {

        const {data} = await axios.post<ReportCreateForm[]>(`/postgresql/posts/report/${params.post_id}`,params)
        console.log('create report for post', data)
        return data;
    });
export const fetchCollectionsWithSearch = createAsyncThunk<Collections[],SearchAndSortParams>(
    'users/fetchCollectionsWithSearch',
    async (params) => {
        const {
            searchtext,
            page,
            role_id,
            license,
            orientation,
            limit,
            sort,
            posttype,
        } = params
        console.log(params)
        // console.log(params)
        const {data} = await axios.get<Collections[]>(`/postgresql/collections/?search=true&searchtext=${searchtext}&limit=${limit}&page=${page}`)
        console.log('Collection search', data)
        return data;
    });
export const fetchCollectionsForAddImage = createAsyncThunk<Collections[],CollectionAddImageProps>(
    'users/fetchCollectionsForAddImage',
    async (params) => {
        const {
            post_id,
            userIdAccViewed
        } = params
        // console.log(params)
        // console.log(params)
        const {data} = await axios.get<Collections[]>(`/postgresql/posts/user?page=0&bdType=collections&userIdAccViewed=${userIdAccViewed}&post_id=${post_id}`)
        console.log('Collections for add image', data)
        return data;
    });
export const fetchAddImageToCollection = createAsyncThunk<Collections[],ImageAddToCollectionProps>(
    'users/fetchAddImageToCollection',
    async (params) => {

        const {data} = await axios.patch<Collections[]>(`/postgresql/collections`,params)
        console.log('Add/minus image to collection', data)
        return data;
    });
export const fetchCreateCollection = createAsyncThunk<Collections[],CollectionCreateForm>(
    'users/fetchCreateCollection',
    async (params) => {

        const {data} = await axios.post<Collections[]>(`/postgresql/collections`,params)
        console.log('create collection', data)
        return data;
    });
export const fetchUpdateCollection = createAsyncThunk<Collections[],CollectionUpdateForm>(
    'users/fetchUpdateCollection',
    async (params) => {

        const {data} = await axios.patch<Collections[]>(`/postgresql/collections/${params.id}`,params)
        console.log('update collection', data)
        return data;
    });
export const fetchDeleteOrRecoverCollection = createAsyncThunk<Collections[],CollectionDeleteOrRecoverForm>(
    'users/fetchDeleteOrRecoverCollection',
    async (params) => {

        const {data} = await axios.delete<Collections[]>(`/postgresql/collections/${params.id}?recover=${params.recover}`)
        console.log('update collection', data)
        return data;
    });