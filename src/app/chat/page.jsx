"use client"

import React, { useEffect, useState, useCallback, useRef } from "react";
import { MdArrowBack } from 'react-icons/md';
import { Navigation } from "./../Components/navigationButtons";
import { useRouter } from "next/navigation"
import { Loader } from "./../Components/loader";
import { getMatches } from "./../Components/getMatches";
import { getUser } from "./../firebase";
import Image from 'next/image';
import { getChat } from "./../Components/getChat";
import { setMessage } from "./../Components/setMessage";
import { setMessageSeen } from "./../Components/setMessageSeen";
import { ref, onValue } from "firebase/database";
import { db } from "./../firebase";
import { FaRegDotCircle } from 'react-icons/fa';

const Page = () => {
    const router = useRouter()
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [matches, setMatches] = useState(null);
    const [chat, setChat] = useState(null);
    const [activeChat, setActiveChat] = useState(false);
    const [receiver, setReceiver] = useState(null);
    const [content, setContent] = useState('');
    const messagesContainerRef = useRef(null);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

    useEffect(() => {
        if (user && Navigation && matches) {
            setIsLoading(false);
        }
    }, [user, matches]);

    useEffect(() => {
        if (chat) {
            setIsLoadingChat(false);
        }
    }, [chat]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getUser();
                setUser(currentUser);
            } catch (error) {
                router.push("/notSign");
            }
        };
        fetchUser();
    }, [router]);

    const handleBack = () => {
        router.push('/')
    }

    const handleBackChat = () => {
        setActiveChat(false);
    }

    const startConversation = async (userMate) => {
        try {
            setIsLoadingChat(true)
            setReceiver(userMate);
            const chat = await getChat(user.uid, userMate.uid)
            setChat(chat);
            setActiveChat(true);
            await setMessageSeen(user.uid, userMate.uid)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const markMessageAsSeen = async () => {
            if (chat && activeChat) {
                await setMessageSeen(user.uid, receiver.uid);
            }
        };
        markMessageAsSeen();
    }, [chat, activeChat, user, receiver]);

    const sendMessage = async () => {
        try {
            if (content !== '') {
                await setMessage(user.uid, receiver.uid, content)
                setContent('');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let unsubscribe;

        const refreshChat = async () => {
            if (activeChat) {
                try {
                    const chat = await getChat(user.uid, receiver.uid);
                    setChat(chat);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        const refreshChatRoom = async () => {
            if (user) {
                try {
                    let matches = await getMatches(user.uid);
                    setMatches(matches);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        const setupSnapshotListener = () => {
            const chatRef = ref(db, "chats");
            unsubscribe = onValue(chatRef, async () => {
                try {
                    if (user) {
                        const [matches] = await Promise.all([getMatches(user.uid)]);
                        setMatches(matches);
                        if (receiver) {
                            const [chat] = await Promise.all([getChat(user.uid, receiver.uid)]);
                            setChat(chat);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        };

        refreshChat();
        refreshChatRoom();
        setupSnapshotListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user, receiver, activeChat]);

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        if (shouldScrollToBottom) {
            scrollToBottom();
        }
    }, [chat, shouldScrollToBottom, scrollToBottom]);

    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10;
            setShouldScrollToBottom(isScrolledToBottom);
        }
    }, []);

    return (
        <div>
            {isLoading ? (
                <Loader></Loader>
            ) : (
                <div>
                    {activeChat ? (
                        <div>
                            {isLoadingChat ? (
                                <Loader></Loader>
                            ) : (
                                <div className="flex flex-col antialiased bg-gray-50 text-gray-600 min-h-screen p-4">
                                    <div className="flex justify-between w-full mb-5">
                                        <button className="bg-gray-200 p-7  rounded-full hover:bg-gray-500 hover:text-white " onClick={handleBackChat} ><MdArrowBack /></button>
                                        <div className="p-7"></div>
                                    </div>
                                    <div className="flex flex-col flex-grow mb-14">
                                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        {receiver.photoURL ? (
                                                            <Image src={receiver.photoURL} width={40} height={40} className="rounded-full mr-3" alt="User Avatar" />
                                                        ) : (
                                                            <Image src="/userPhoto.png" width={32} height={32} className="rounded-full items-start flex-shrink-0 mr-3" alt="dasdas" />
                                                        )}
                                                    </div>
                                                    <div className="text-lg font-medium text-gray-900">
                                                        <div className="text-center">{receiver.displayName}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-b-lg shadow-lg p-4">
                                            <div ref={messagesContainerRef}
                                                style={{ height: '520px', overflowY: 'auto' }}
                                                onScroll={handleScroll}>
                                                {chat.map((message, index) => (
                                                    <div key={index} className={`flex flex-col mb-2 ${message.receiverId !== receiver.uid ? 'items-start' : 'items-end'}`}>
                                                        <div className={`px-4 py-2 rounded-lg shadow-md w-80 ${message.receiverId !== receiver.uid ? 'bg-gray-200 text-gray-700' : 'bg-gray-900 text-white'}`}>
                                                            <div className="mr-4">
                                                                {message.content}
                                                            </div>
                                                            {message.receiverId !== user.uid ? (
                                                                <div className="relative flex items-center justify-end">
                                                                    <span className="text-xs mr-1">
                                                                        {message.createdAt}
                                                                    </span>
                                                                    {message.seen ? (
                                                                        <span>
                                                                            <Image src="/see.png" alt="Visto" width={16} height={16} />
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            <Image src="/notSee.png" alt="No visto" width={16} height={16} />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                ))}
                                            </div>
                                            <form className="flex space-x-2 mt-6" onSubmit={async (e) => { e.preventDefault(); await sendMessage(content); }}>
                                                <input
                                                    type="text"
                                                    placeholder="Escribe un mensaje..."
                                                    className="flex-grow border border-gray-300 rounded-lg p-2"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                />
                                                <button type="submit" className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send w-4 h-4">
                                                        <line x1="22" y1="2" x2="11" y2="13" />
                                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <section className="flex flex-col antialiased bg-gray-50 text-gray-600 min-h-screen p-4">
                            <div>
                                <button className="bg-gray-200 text-black p-7 mr-20 rounded-full hover:bg-gray-500 hover:text-white " onClick={handleBack} ><MdArrowBack /></button>
                                <div className="h-full">
                                    <div className="relative mt-5  mx-auto bg-white shadow-sm rounded-lg">
                                        <div className="py-3 px-5">
                                            <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                                            {matches ? (
                                                matches.map((userMate, index) => (
                                                    <div key={index} className="divide-y divide-gray-200">
                                                        <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50" onClick={() => startConversation(userMate)}>
                                                            <div className="flex w-full  items-center">
                                                                {userMate.photoURL ? (
                                                                    <Image src={userMate.photoURL} width={32} height={32} className="rounded-full items-start flex-shrink-0 mr-3" alt="User Avatar" />
                                                                ) : (
                                                                    <Image src="/userPhoto.png" width={32} height={32} className="rounded-full items-start flex-shrink-0 mr-3" alt="Example1" />
                                                                )}

                                                                <div>
                                                                    <h4 className="text-sm  text-gray-900">{userMate.displayName}</h4>
                                                                    {userMate.message ? (
                                                                        <div>
                                                                            {userMate.message.senderId === user.uid ? (
                                                                                <div className="text-sm text-gray-600 flex items-center">
                                                                                    {userMate.message.seen === true ? (
                                                                                        <span>
                                                                                            <Image src="/see.png" alt="No visto" width={16} height={16} className="mr-2" />
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span>
                                                                                            <Image src="/notSee.png" alt="No visto" width={16} height={16} className="mr-2" />
                                                                                        </span>
                                                                                    )}
                                                                                    <div className=" flex w-full justify-between">
                                                                                        <p className="text-xs ">{userMate.message.content}</p>
                                                                                        <p className="text-[11px]  text-gray-500 ">- últ. vez {userMate.message.createdAt}</p>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="">
                                                                                    {userMate.message.seen === true ? (
                                                                                        <div className="text-sm text-gray-600 flex items-center w-full justify-between">
                                                                                            <p className="text-xs ">{userMate.message.content}</p>
                                                                                            <p className="text-[11px] text-gray-500">- últ. vez {userMate.message.createdAt}</p>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="text-sm text-gray-600 flex items-center w-full justify-between">
                                                                                            
                                                                                            <li className=" list-disc marker:text-green-500 text-[12px] font-bold">{userMate.message.content}</li>
                                                                                            <p className="text-[11px] ml-2 text-gray-500">- últ. vez {userMate.message.createdAt}</p>
                                                                                        </div>
                                                                                    )
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        null
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                null
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                    }
                </div >
            )}
            {
                activeChat ? (
                    null
                ) : (
                    <Navigation changeValueLoading={setIsLoading} />
                )
            }
        </div >
    );
};

export default Page;