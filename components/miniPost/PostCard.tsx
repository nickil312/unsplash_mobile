import React, {useEffect, useState} from 'react';


import {Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/modal";
import CollectionModal from "@/app/components/Products/modal/CollectionModal/CollectionModal";
import CollabIcon from "@/components/miniPost/CollabIcon";
import {useSelector} from "react-redux";
import {RootState} from "@/globalRedux/store";
import {Link, useRouter} from "expo-router";
import LikeDisChange from "@/components/func/LikeDisChange";
import {truncateText} from "@/components/func/truncateText";
import {DownloadImage} from "@/components/func/DownloadImage";
import {Image, View, Text, Button} from "react-native";


interface PhotoCardProps {
    imageUrl: string;
    altText: string;
    fullname: string;
    avatarurl: string;
    user_id: string;
    _id: string;
    lang: string
    license: string
    likedByUser: boolean
    hirevalue: boolean
    banned: boolean
}


const PostCard: React.FC<PhotoCardProps> = ({
                                                imageUrl,
                                                altText,
                                                fullname,
                                                avatarurl,
                                                user_id,
                                                _id,
                                                lang,
                                                license,
                                                likedByUser,
                                                hirevalue,
                                                banned
                                            }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [liked, setLiked] = useState(false);
    const {data} = useSelector((state: RootState) => (state.users))
    const router = useRouter();
    // const {isOpen, onOpen, onOpenChange} = useDisclosure();

    useEffect(() => {
        setLiked(likedByUser);
    }, []);

    const handleToggleLike = () => {
        if (data !== null) {
            const newLikedState = LikeDisChange({likeValue: liked, _id: _id});
            if (newLikedState !== undefined) {
                setLiked(newLikedState);
            }
        } else {
            // router.push(`/${lang}/login`);
        }


    };

    return (

        <>

        {/*<Modal size="3xl" placement="center" onOpenChange={onOpenChange}   isOpen={isOpen}  classNames={{*/}
        {/*    body:"p-0 rounded-sm dark:bg-black"*/}
        {/*}}>*/}
        {/*    <ModalContent>*/}


        {/*        <ModalBody>*/}
        {/*            <CollectionModal _id={_id} imageUrl={imageUrl}/>*/}

        {/*        </ModalBody>*/}



        {/*    </ModalContent>*/}
        {/*</Modal>*/}
        <View className="mt-4">
            <View className="w-full flex items-center flex-nowrap flex-row px-3 pb-3 pc_display_none">
                {
                    license === "Free" ? (
                        <>
                            <Link href={`/(tabs)/(profile)/users/${user_id}`} className="flex items-center flex-row">

                                <Image
                                    width={36}
                                    alt={avatarurl}
                                    src={avatarurl}
                                    className="rounded-full object-cover w-8 h-8 mr-2"
                                />

                                <Text className=" text_size_adaptive font-semibold">{fullname} </Text>
                            </Link>
                        </>
                    ) : license === "Unsplash+" ? (
                        <>
                            <CollabIcon lang={lang} avatarurl={avatarurl} user_id={user_id} mode={3}/>
                            <View className="flex flex-col ml-2">
                                <Text className=" text-sm font-semibold ">Unsplash+ </Text>
                                <Link href={`/(tabs)/(profile)/users/${user_id}`}>

                                    <Text className="text-76 opacity-80 text-xs">
                                        {
                                            lang === "en" ? truncateText(`In collaboration with ${fullname}`, 29) : truncateText(` В сотрудничестве с ${fullname}`, 29)
                                        }
                                    </Text>
                                </Link>
                            </View>

                        </>
                    ) : (
                        <>Error</>
                    )
                }

                {/*    сделать условие на unsplash+ */}
            </View>
            <View
                // className="w-full relative overflow-hidden  w-[550px] h-[550px] shadow-lg "
                className="max-w-full h-auto relative overflow-hidden shadow-lg "
                // onMouseEnter={() => setIsHovered(true)}
                // onMouseLeave={() => setIsHovered(false)}
            >
                <Link href={`/(tabs)/(profile)/details/${_id}`}>
                    <img
                        src={imageUrl}
                        alt={altText}
                        // className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
                        className="max-w-full h-auto object-cover"
                    />
                </Link>
                {
                    license === "Unsplash+" && (
                        <View className={`${banned ? "absolute top-14 " : "absolute top-4"} left-4 flex space-x-4 `}>
                            <svg className="h-8 w-8 fill-white" width="24" height="24" viewBox="0 0 24 24"
                                 version="1.1"
                                 aria-hidden="false">
                                <desc lang="en-US">Plus sign for Unsplash+</desc>
                                <path
                                    d="M11.281 8.3H8.156V3.125L11.281 1v7.3Zm.316 4.05H4.955V7.868L1.5 10.636v4.55h6.656V22h4.713l3.552-2.84h-4.824v-6.81Zm4.24 0v2.835h4.587l2.911-2.834h-7.497Z"></path>
                            </svg>
                        </View>
                    )
                }
                {
                    banned && (
                        <View className="absolute top-4 left-4 flex space-x-4 bg-red-500 rounded px-1">
                            <Text>{lang === "en" ? <>Banned</> : <>Заблокирован</>}</Text>
                        </View>
                    )
                }


                {isHovered && (
                    <>

                        <View className="absolute top-4 right-4 flex space-x-2">
                            {/* Это лайк записи*/}
                            <Button
                                onClick={handleToggleLike}

                                className={liked ? "like_active navBar_mobile_display_none" : "PostCard_buttons navBar_mobile_display_none"}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // className="h-6 w-6 m-auto"
                                    className=""
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            />

                                <Button
                                    className="PostCard_buttons navBar_mobile_display_none"
                                    // onClick={() => (data !== null ? onOpen() : router.push(`/${lang}/login`))}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className=" "
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                />



                        </View>
                        <View className="absolute bottom-0 right-0 p-4 navBar_mobile_display_none">
                            {/* Это скачка фотки*/}
                            {
                                license === "Free" ? (
                                    <Button className="PostCard_buttons" onClick={() =>
                                        DownloadImage(imageUrl, altText, _id)
                                    }>
                                        <svg
                                            // className="h-6 w-6 m-auto"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g id="Interface / Download">
                                                <path id="Vector"
                                                      d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                                                      stroke="#555555"
                                                      stroke-width="3"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"/>
                                            </g>
                                        </svg>
                                    />
                                ) : license === "Unsplash+" ? (
                                    <View className="modal_buttons_unpslash ">
                                        <svg width="15" height="15" viewBox="0 0 24 24" version="1.1"
                                             aria-hidden="false">
                                            <desc lang="en-US">A lock</desc>
                                            <g>
                                                <g>
                                                    <g>
                                                        <path className=" "
                                                              d="M19 11h-1.5V7.5C17.5 4.5 15 2 12 2S6.5 4.5 6.5 7.5V11H5c-.6 0-1 .4-1 1v9c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-9c0-.6-.4-1-1-1ZM8.5 7.5C8.5 5.6 10.1 4 12 4s3.5 1.6 3.5 3.5V11h-7V7.5Z"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        <Text className="ml-1 ">{lang === "en" ? <>Download</> : <>Скачать</>}</Text>
                                    </View>

                                ) : (<Text>Error</Text>)
                            }

                        </View>
                        <View
                            className="absolute bottom-0 left-0  w-fit right-0 p-4 flex items-center navBar_mobile_display_none"
                        >
                            {
                                license === "Free" ? (
                                    <Link href={`/(tabs)/(profile)/users/${user_id}`}>

                                        <img
                                            width={36}
                                            alt={avatarurl}
                                            src={avatarurl}
                                            className="rounded-full object-cover w-8 h-8 mr-2"
                                        />
                                    </Link>

                                ) : license === "Unsplash+" ? (
                                    <CollabIcon lang={lang} avatarurl={avatarurl} user_id={user_id} mode={1}/>
                                ) : (
                                    <>Error</>
                                )
                            }


                            <View className="w-auto">
                                {
                                    license === "Free" ? (
                                        <>
                                            <Text className="text-white text-base font-semibold">{fullname} </Text>
                                            <Text className="text-[#FFF] opacity-80 text-xs">
                                                {
                                                    hirevalue && (
                                                        lang === "en" ? <>Available for hire</> : <>Доступен для найма</>
                                                    )
                                                }
                                            </Text>
                                        </>
                                    ) : license === "Unsplash+" ? (
                                        <>
                                            <Text className="text-white text-base font-semibold">Unsplash+ </Text>
                                            <Text className="text-[#FFF] opacity-80 text-xs adaptive_display_none">
                                                {

                                                    lang === "en" ? truncateText(`In collaboration with ${fullname}`, 26) : truncateText(` В сотрудничестве с ${fullname}`, 24)
                                                }
                                            </Text>
                                            <Text className="text-[#FFF] opacity-80 text-xs adaptive_display_active">
                                                {

                                                    lang === "en" ? truncateText(`In collaboration with ${fullname}`, 15) : truncateText(` В сотрудничестве с ${fullname}`, 15)
                                                }
                                            </Text>
                                        </>
                                    ) : (
                                        <>Error</>
                                    )
                                }

                            </View>
                        </View>
                        {/*</View>*/}
                    </>
                )}
            </View>
            <View className=" flex items-center justify-between flex-nowrap h-[32px] flex-row mx-3 mt-3 pc_display_none">
                <View>


                    <Button type="button"
                            onClick={handleToggleLike}

                            className={liked ? 'modal_like_active' : "modal_buttons"}

                            title="Like this image">
                        <svg className=""
                             width="16" height="16" viewBox="0 0 24 24"
                             version="1.1"
                             aria-hidden="false">
                            <desc lang="en-US">A heart</desc>
                            <path
                                d="M21.424 4.594c-2.101-2.125-5.603-2.125-7.804 0l-1.601 1.619-1.601-1.62c-2.101-2.124-5.603-2.124-7.804 0-2.202 2.126-2.102 5.668 0 7.894L12.019 22l9.405-9.513a5.73 5.73 0 0 0 0-7.893Z"></path>
                        </svg>
                    />
                    <Button type="button"
                            // onClick={() => (data !== null ? onOpen() : router.push(`/${lang}/login`))}
                            className="modal_buttons ml-2"
                            title="Add this image to a collection">
                        <svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24"
                             version="1.1"
                             aria-hidden="false">
                            <desc lang="en-US">A plus sign</desc>
                            <path d="M21.8 10.5h-8.3V2.2h-3v8.3H2.2v3h8.3v8.3h3v-8.3h8.3z"></path>
                        </svg>
                    />
                </View>
                <View className={license === "Unsplash+" ? 'modal_buttons bg-black' : " modal_buttons "}>
                    {
                        license === "Free" ? (
                            <View onClick={() =>
                                DownloadImage(imageUrl, altText, _id)
                            }>
                                {lang === "en" ? <>Download</> : <>Скачать</>}
                            </View>
                        ) : license === "Unsplash+" ? (
                            <>
                                <svg width="15" height="15" viewBox="0 0 24 24" version="1.1" aria-hidden="false">
                                    <desc lang="en-US">A lock</desc>
                                    <g>
                                        <g>
                                            <g>
                                                <path className="fill-white "
                                                      d="M19 11h-1.5V7.5C17.5 4.5 15 2 12 2S6.5 4.5 6.5 7.5V11H5c-.6 0-1 .4-1 1v9c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-9c0-.6-.4-1-1-1ZM8.5 7.5C8.5 5.6 10.1 4 12 4s3.5 1.6 3.5 3.5V11h-7V7.5Z"></path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <Text className="ml-1 text-white">{lang === "en" ? <>Download</> : <>Скачать</>}</Text>
                            </>

                        ) : (<Text>Error</Text>)
                    }

                </View>

            </View>
        </View>
        </>

    );

};

export default PostCard;