"use client"

import React, { useEffect, useState, useCallback } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import Image from 'next/image';
import { getUser } from "./firebase";
import { useRouter } from "next/navigation"
import { getUsersDb } from "./Components/getUsersDb";
import { assignLike } from "./Components/assignLike"
import { Navigation } from "./Components/navigationButtons";
import { Loader } from "./Components/loader";
import { MdArrowBack } from 'react-icons/md';
import { getNotifications } from "./Components/getNotifications";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

const Page = () => {
  const router = useRouter()
  const [user, setUser] = useState(null);
  const [userMate, setUserMate] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [goNotifications, setGoNotifications] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const [isLoadingNotification, setIsLoadingNotification] = useState(true);
  

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleChangeColor = () => {
    const colors = ["#FFC09F", "#FFEE93", "#FCF5C7", "#A0CED9", "#ADF7B6"];
    const randomIndex = randomInt(0, colors.length - 1);
    const color = colors[randomIndex];
    const tarjeta = document.querySelector(".tarjeta");
    tarjeta.style.backgroundColor = color;
  };

  useEffect(() => {
    if (user && userMate && Navigation) {
      setIsLoading(false);
    }
  }, [user, userMate]);

  useEffect(() => {
    if (notifications) {
      setIsLoadingNotification(false)
    }
  }, [notifications]);

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

  const showMate = useCallback(async () => {
    const users = await getUsersDb(user.uid);
    setQuantity(users.length);
    setUserMate(users[page]);
  }, [page, user]);

  useEffect(() => {
    if (user) {
      showMate();
    }
  }, [user, page, showMate]);

  const handleNext = () => {
    handleChangeColor();

    if (page !== quantity - 1) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {

    handleChangeColor();
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNavProfile = () => {
    setIsLoading(true);
    router.push("/profile")
  }

  const handleNavNotifications = async () => {
    setGoNotifications(true);
  }

  const handleNavNotificationsToPage = (content) => {
    setIsLoading(true);
    if (content === 'Nuevo like!') {
      router.push('/likes')
    } else if (content === 'Tienes un nuevo match!' || content === 'Nuevo mensaje!') {
      router.push('/chat')
    }
  }

  const handleGoBack = () => {
    setGoNotifications(false);
  }

  const handleLike = async () => {
    handleChangeColor();
    try {
      const userMateId = userMate.uid;
      await assignLike(userMateId, user);
      handleNext();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let unsubscribe;

    const refreshNotifications = async () => {
      if (user) {
        try {
          const notifications = await getNotifications(user.uid)
          setNotifications(notifications);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const setupSnapshotListener = () => {
      if (user) {
        const notificationsRef = ref(db, "users/" + user.uid + "/notifications/");
        unsubscribe = onValue(notificationsRef, async () => {
          try {
            console.log("change");
            let [notifications] = await Promise.all([getNotifications(user.uid)]);
            notifications = notifications.map((notification, index) => {
              switch (notification.content) {
                case "Nuevo mensaje!":
                notification.color='gray-900'  

                break;
               
                case "Tienes un nuevo match!":
                  notification.color='red-300'
                break;
              
                case "Nuevo like!":
                  notification.color='red-300'
                break;
              
                default:
                  break;
              }
              console.log(notification.color)
             });
             
            setNotifications(notifications);

          } catch (error) {
            console.log(error);
          }
        });
      }
    };

    refreshNotifications();
    setupSnapshotListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);
  return (
    <div className="bg-gray-50">
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div className="bg-gray-50">
          {goNotifications ? (
            <div>
              {isLoadingNotification ? (
                <Loader></Loader>
              ) : (
                <div>
                  <div>
                    <button className="bg-gray-200 text-black p-7 mt-5 ml-3  mr-20 rounded-full hover:bg-gray-500 hover:text-white" onClick={handleGoBack} ><MdArrowBack /></button>
                  </div>
                  <div>
                    {notifications !== 'NoNotifications' ? (
                      notifications.map((notification, index) => (
                        <div
  key={index}
  className={`flex flex-col p-4 m-2 bg-gray-900 shadow-md hover:shadow-lg rounded-b-2xl`}
  onClick={() => handleNavNotificationsToPage(notification.content)}
>
                          <li className='text-gray-300 mx-7 list-disc marker:text-blue-500'>{notification.content}</li>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {notification.photoURL ? (
                                <Image src={notification.photoURL} width={12} height={12} className="mr-5 w-12 h-12 rounded-full" alt="User Avatar" />
                              ) : (
                                <Image src="/userPhoto2.png" width={40} height={40} className="mr-5 rounded-full" alt="User Avatar" onClick={handleNavProfile} />
                              )}
                              <div className="flex flex-col ml-3">
                                <div className="font-medium leading-none">
                                  <h2 className="text-base font-semibold text-white">{notification.displayName}</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      null
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <section className="items-center  mx-5 mt-5 mb-36 bg-gray-50">
              <div className="flex items-center justify-between w-full p-4 top-0">
                <div className="flex items-center">
                  <a href="/profile">
                    {user && user.photoURL ? (
                      <Image src={user.photoURL} width={12} height={12} className="mr-5 w-12 h-12 rounded-full" alt="User Avatar" onClick={handleNavProfile} />
                    ) : (
                      <Image src="/userPhoto2.png" width={40} height={40} className="mr-5 rounded-full" alt="User Avatar" onClick={handleNavProfile} />
                    )}
                  </a>
                  <h1 className="mr-2 text-lg text-neutral-700">Hola, </h1>
                  {user ? (
                    <h1 className="text-lg font-bold text-neutral-700">{user.displayName}</h1>
                  ) : null}
                </div>
                <div onClick={handleNavNotifications}>
                  <FaBell className="text-2xl text-neutral-600" />
                </div>
              </div>
              <div className="flex items-center justify-center h-full mt-10 bg-gray-50">
                <div className=" relative  ">
                  <button className="absolute top-0 right-0 py-64 px-10 rounded-lg z-10" onClick={handleNext}></button>
                  <button className="absolute top-0 left-0 py-64 px-10  z-10 rounded-lg" onClick={handlePrev}></button>
                  <div className="tarjeta  shadow-xs max-w-xs pt-10 w-96 h-[500px]  overflow-auto scroll-smooth bg-blue-gray-300 rounded-3xl text-white shadow-[0px_10px_1px_rgba(189,_189,_189,_1)]">
                    <div className="flex items-center justify-center rounded-full overflow-hidden shadow-xl m-auto w-40 h-40">
                      {userMate && userMate.photoURL ? (
                        <Image src={userMate.photoURL} width={200} height={200} className=" objet-fill shadow-[0px_10px_1px_rgba(189,_189,_189,_1)]" alt="Example1" />
                      ) : (
                        <Image src="/userPhoto2.png" width={200} height={200} className=" objet-fill shadow-[0px_10px_1px_rgba(189,_189,_189,_1)] " alt="Example1" />
                      )}
                    </div>
                    <div className="bg-white text-gray-900 pb-44 mt-5 py-2 rounded-2xl ">
                      <div className="flex justify-center mx-36 rounded-xl  py-0.5 px-5 bg-gray-300"></div>
                      {userMate ? (
                        <div className="m-auto pt-6 ">
                          <p className="text-2xl font-bold mt-4 pb-4 rounded-lg text-center mx-10 border-b-2 border-gray-200 ">{userMate.displayName}</p>

                          <p className="text-lm text-gray-700 mx-5 mt-2 text-center ">{userMate.description}</p>
                        </div>
                      ) : null}
                      {userMate && userMate.propertyPhotos ? (
                        userMate.propertyPhotos.map((photo, index) => (
                          <div key={index} className=" bg-white flex items-center justify-center overflow-hidden w-full my-5">
                            <Image src={photo} width={300} height={300} className="rounded-xl" alt="Example1 " />
                          </div>
                        ))
                      ) : (
                        null
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center mt-10 bg-gray-50">
                <button className="flex items-center justify-center w-24 h-24 bg-red-300 rounded-full shadow-[0px_7px_1px_rgba(239,_83,_80,_1)] mr-14" onClick={handleNext} >
                  <FaTimes className="text-white text-3xl" />
                </button>
                <button className="flex items-center justify-center w-24 h-24 bg-indigo-300 rounded-full shadow-[0px_7px_1px_rgba(92,_107,_192,_1)] ml-14" onClick={handleLike}>
                  <Image src="/fav.png" width={28} height={28} className="w-auto h-auto" alt="fav" />
                </button>
              </div>
            </section >
          )}
        </div>
      )}
      <Navigation changeValueLoading={setIsLoading} />
    </div>
  );
};

export default Page;