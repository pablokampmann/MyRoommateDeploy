"use client"

import React, { useEffect, useState } from "react";
import styles from './../home.module.css'
import { handleSignInWithGoogle } from '../Components/signInWithGoogle';
import { useRouter } from "next/navigation"
import { Loader } from "../Components/loader";
import { MdArrowUpward } from 'react-icons/md';

const Page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInGoogle = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      await handleSignInWithGoogle(e);
      router.push("/")
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = () => {
    setIsLoading(true)
    router.push("/signUp")
  };

  const handleSignIn = () => {
    setIsLoading(true)
    router.push("/signIn")
  };

  return (
    <div>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <section className="flex flex-col items-center h-screen mt-5 m-5" >
          <div className="flex items-center justify-between w-full p-4 top-0">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-neutral-700">MY</h1>
              <h1 className="text-lg text-neutral-700">ROOMMATE </h1>
            </div>
          </div>
          <div className={styles.section}>
          </div>
            <div className=" absolute bottom-28 ">
        
            <div className="grid justify-center">
  <div className="flex justify-center mb-2">
      <button type="button" className=" flex justify-evenly text-white bg-gray-900 border border-gray-300 focus:outline-none font- rounded-2xl text-lg px-8 py-5 mr-2  dark:bg-gray-800 dark:text-white" onClick={handleSignUp}> Comencemos <MdArrowUpward className="ml-7" /></button>
    <button type="submit" className="text-gray-900 bg-white border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-6 py-4 dark:bg-red-800 dark:text-white" onClick={handleSignInGoogle}>
      <svg className="w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
      </svg>
    </button>
  </div>
</div>


            <div className="grid justify-center">
              <div className="flex">
                <p className="font-medium text-sm text-gray-500 mr-1">¿Ya tienes una cuenta?</p>
                <a className="font-medium text-red-300 text-sm" onClick={handleSignIn}>Iniciar sesión</a>
              </div>
            </div>
          </div>
        </section>

        
      )}
    </div>
  );
}


export default Page;