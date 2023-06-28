"use client"

import React, { useEffect, useState, useCallback } from "react";
import { FaTimes, FaHeart } from "react-icons/fa";
import Image from 'next/image';
import { getUser } from "./../firebase";
import { useRouter } from "next/navigation"
import { Navigation } from "./../Components/navigationButtons";
import { Loader } from "./../Components/loader";
import { getLikes } from "./../Components/getLikes";
import { setMatch } from "./../Components/setMatch";
import { deleteLike } from "./../Components/deleteLike";
import { MdArrowBack } from 'react-icons/md';

const Page = () => {
  const router = useRouter()
  const [user, setUser] = useState(null);
  const [usersMates, setUsersMates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && Navigation && usersMates) {
      setIsLoading(false);
    }
  }, [user, usersMates]);

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

  const showLikes = useCallback(async () => {
    const users = await getLikes(user.uid);
    setUsersMates(users);
  }, [user]);

  useEffect(() => {
    if (user) {
      showLikes();
    }
  }, [user, showLikes]);

  const handleLike = (userMateId) => {
    try {
      deleteLike(user.uid, userMateId);
      setMatch(user.uid, userMateId);
      const updatedUsersMates = usersMates.filter((user) => user.uid !== userMateId);
      setUsersMates(updatedUsersMates);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDisLike = (userMateId) => {
    try {
      deleteLike(user.uid, userMateId);
      const updatedUsersMates = usersMates.filter((user) => user.uid !== userMateId);
      setUsersMates(updatedUsersMates);
    } catch (error) {
      console.log(error);
    }
  }

  const handleBack = () => {
    try {
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <section className="flex flex-col antialiased bg-gray-50 text-gray-600 min-h-screen p-4">

          <div className="w-full h-screen">
            <button className="bg-gray-200 text-black p-7 mr-20 rounded-full hover:bg-gray-500 hover:text-white " onClick={handleBack} ><MdArrowBack /></button>
            <div className="relative  bg-white shadow-sm rounded-lg mt-5">
              <div className="py-3 px-5">
                <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">Likes</h3>
                <div className="divide-y divide-gray-200">
                  {usersMates !== 'NoLikes' ? (
                    usersMates.map((user, index) => (
                      <div key={index} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                        <div className="flex items-center">
                          {user.photoURL ? (
                            <Image src={user.photoURL} width={32} height={32} className="rounded-full items-start flex-shrink-0 mr-3" alt="User Avatar" />
                          ) : (
                            <Image src="/userPhoto.png" width={32} height={32} className="rounded-full items-start flex-shrink-0 mr-3" alt="Example1" />
                          )}
                          <div className="flex justify-between w-full ">
                            <div className="text-center">
                              <h4 className="text-sm font-medium  text-gray-900">{user.displayName}</h4>
                            </div>
                            <div className="flex items-center justify-">
                              <button className="flex items-center justify-center w-8 h-8 bg-red-300 rounded-full shadow-xl mx-4" onClick={() => handleDisLike(user.uid)}>

                              </button>
                              <button className="flex items-center justify-center w-8 h-8 bg-indigo-300 rounded-full shadow-xl" onClick={() => handleLike(user.uid)}>

                              </button>
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
            </div>
          </div>
        </section>
      )}
      <Navigation changeValueLoading={setIsLoading} />
    </div>
  );
};

export default Page;