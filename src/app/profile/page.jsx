"use client"


import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group } from '@mantine/core';
import React, { useEffect, useState, useCallback } from "react";
import Image from 'next/image';
import UploadPP from "../Components/UploadPP";
import SocialButtons from "../Components/SocialButtons";
import DescriptionForm from "../Components/DescriptionForm";
import ManageSocial from "../Components/ManageSocial";
import UploadPPButton from "../Components/UploadPPButton";
import PropertyPhotosButton from './../Components/PropertyPhotosButton';
import { auth, db } from "./../firebase";
import { ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation"
import { getUser } from "./../firebase";
import { FaPencilAlt } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { Navigation } from "./../Components/navigationButtons";
import { Loader } from "./../Components/loader";

const Page = () => {
  const router = useRouter()
  const [userDescription, setUserDescription] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (user && UploadPP && SocialButtons && Navigation) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        console.log(error);
        router.push("/notSign");
      }
    };
    fetchUser();
  }, [router]);

  const getDescription = useCallback(() => {
    if (user) {
      let dbRef = ref(db, 'users/' + user.uid);
      onValue(dbRef, (snapshot) => {
        setUserDescription(snapshot.val());
      });
    }
  }, [user])

  useEffect(() => {
    if (user) {
      getDescription();
    }
  }, [user, getDescription]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      console.log("Sign out");
      await signOut(auth);
      router.push('/notSign');
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    try {
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  const handlePencilClick = () => {
    setEditMode(true)
    open();
  }

  const fetchUser = async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
    } catch (error) {
      console.log(error);
      router.push("/notSign");
    }
  };

  const handleCloseModal = async () => {
    try {
      await fetchUser();
      setEditMode(false);
      close();
    } catch (error) {
      console.log(error);
      router.push("/notSign");
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % user.propertyPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + user.propertyPhotos.length) % user.propertyPhotos.length);
  };

  return (
    <div>
      {isLoading ? (
        <div>
          <Loader></Loader>
        </div>
      ) : (
        <div className="h-screen w-full">
          <div className="flex justify-between items-center mb-4 mt-5 text-center">
            <button className="bg-gray-200 p-7 sm:p-7 mx-5 sm:mr-20 rounded-full hover:bg-gray-500 hover:text-white " onClick={handleBack}>
              <MdArrowBack />
            </button>
            <div className="text-black py-2">
              <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
            </div>
            <button onClick={handlePencilClick} className="bg-gray-900 p-7 sm:p-7 mx-5 sm:ml-20 rounded-full hover:bg-gray-500 hover:text-white shadow-xl">
              <FaPencilAlt className="text-gray-300" />
            </button>

          </div>
          <div>
            {editMode === true ? (
              <Modal opened={opened} onClose={handleCloseModal} centered>
                <div>
                  <DescriptionForm />
                  <ManageSocial />
                  <PropertyPhotosButton />
                  <UploadPPButton />
                </div>
              </Modal>
            ) : null}
            <div className="flex justify-center">
              {user && user.photoURL ? (
                <Image width={120} height={120} priority={true} src={user.photoURL} className="mx-4 sm:mx-10 my-5 shadow-xl rounded-full h-auto object-fill" alt="User Avatar" />
              ) : (
                <Image priority={true} src="/userPhoto2.png" width={120} height={120} className="mx-4 sm:mx-10 my-5 shadow-xl rounded-full" alt="User Avatar" />
              )}
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold px-4 sm:px-28 pb-4 rounded-lg text-center mx-auto border-b-2 border-gray-200">
            {user.displayName}
          </h1>
          {user.description ? (
            <h2>
              {user.description}
            </h2>
          ) : (
            null
          )}
          {user.propertyPhotos && user.propertyPhotos.length !== 0 ? (
            <div className="relative rounded-lg border-b-2 border-gray-200 pb-10">
              <div className="flex justify-center w-full sm:h-auto overflow-hidden">
                <div className="mt-24">
                  <button className="p-2 sm:p-3 rounded-full" onClick={prevSlide}>
                    <Image src="/izq.png" width={8} height={8} className="w-auto h-auto" alt="arrow" />
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="">
                    <Image
                      src={user.propertyPhotos[currentSlide]}
                      alt="PropertyPhotos"
                      priority={true}
                      className="m-4 sm:m-10  h-auto rounded-lg"
                      height={200}
                      width={200}
                    />
                  </div>
                </div>
                <div className="mt-24">
                  <button className="p-2 sm:p-3 rounded-full" onClick={nextSlide}>
                    <Image src="/der.png" width={8} height={8} className="w-auto h-auto" alt="arrow" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          <div className="flex-1 mt-4 sm:mt-10">
            <SocialButtons />
          </div>
          <div className="flex justify-center mt-4 sm:mt-5">
            <button
              type="logout"
              className="w-full mx-5 mt-8 sm:mt-12 flex justify-center text-white bg-gray-900 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-6 sm:px-8 py-3 sm:py-4 dark:bg-gray-800 dark:text-white"
              href="/NotSign"
              onClick={handleLogout}
            >
              Salir
            </button>
          </div>
        </div>)}
      <Navigation changeValueLoading={setIsLoading} />
    </div>
  );
}

export default Page;
