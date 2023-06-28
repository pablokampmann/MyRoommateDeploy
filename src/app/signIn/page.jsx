"use client"

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../firebase";
import { useRouter } from "next/navigation"
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { MdArrowBack } from 'react-icons/md';

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const currentUser = await signInWithEmailAndPassword(auth, email, password)
      if (currentUser) {
        router.push("/")
      }
    } catch (error) {

      if (error.message === 'Firebase: Error (auth/user-not-found).') {
        alert("We couldn't find any account with the provided email.");
      }
      if (error.message === 'Firebase: Error (auth/wrong-password).') {
        alert("The supplied password does not match with the provided email.");
      }
      console.log(error.message)
    }
  };

  const handleBack = () => {
    router.push('/notSign');
  }

  return (
    <form onSubmit={handleSignIn}>
      <section className=" h-screen w-full">
    

          <div className="flex justify-between mb-4 mt-5 mx-4 text-center">
            <button className=" bg-gray-200 p-7 mr-20 rounded-full hover:bg-gray-500 hover:text-white shadow-xl" onClick={handleBack} ><MdArrowBack /></button>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-neutral-700">MY</h1>
              <h1 className="text-xl text-neutral-700">ROOMMATE </h1>
            </div>
           <div>
           <button className=" bg-white  p-7 mr-20 rounded-full " ></button>
           </div>
          </div>

         <div className=" m-10 mt-28 text-center">
          <h1 className="text-4xl text-red-300 font-medium">Encontrá y conocé</h1>
          <h1 className="text-4xl font-medium text-gray-900">a tu futuro roommate</h1>
         </div>
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] mx-5 px-12 py-16">

        
          <div className="flex flex-col">
            <div className="border-b border-gray-200 p-2 flex items-center mb-16"><FaRegEnvelope className="text-gray-400 mr-4 "></FaRegEnvelope>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none text-base"
              />
            </div>
            <div className="border-b border-gray-200 p-2 flex items-center "><MdLockOutline className="text-gray-400 mr-4"></MdLockOutline>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none text-base"
              />
            </div>
            <button type="submit" className="w-full mt-12 flex justify-center text-white bg-gray-900 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-8 py-4 dark:bg-gray-800 dark:text-white">
              Iniciar
            </button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default Page;

