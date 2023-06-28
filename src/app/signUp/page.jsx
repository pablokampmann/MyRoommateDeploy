"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./../firebase";
import { useRouter } from "next/navigation"
import { ref, update } from "firebase/database";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { MdArrowBack } from 'react-icons/md';

const Page = () => {
  const router = useRouter()
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const userName = name + ' ' + surname;

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredentials) {
          const dbRef = ref(db, 'users/' + userCredentials.user.uid)
          await update(dbRef, {
            displayName: userName,
            email: userCredentials.user.email,
            uid: userCredentials.user.uid
          })
        }
        router.push("/")
      } catch (error) {
        if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
          alert("The provided email address is already in use.");
        }
        if (error.message === 'Firebase: Error (auth/missing-password).') {
          alert("Password field is empty. Please enter a password to proceed.");
        }
        if (error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
          alert("Password should be at least 6 characters");
        }
      }
    } else {
      alert("Passwords do not match. Please make sure the passwords entered are identical.");
    }
  };

  const handleBack = () => {
    router.push('/notSign');
  }

  return (
    <div>
  <form onSubmit={handleSignUp}>
    <div className="flex justify-between mb-4 mt-5 mx-4 text-center">
      <button className="bg-gray-200 p-7 sm:p-7 mr-4 sm:mr-20 rounded-full hover:bg-gray-500 hover:text-white " onClick={handleBack}>
        <MdArrowBack />
      </button>
      <div className="flex items-center">
        <h1 className="text-lg sm:text-xl font-bold text-neutral-700">MY</h1>
        <h1 className="text-lg sm:text-xl text-neutral-700">ROOMMATE</h1>
      </div>
      <div>
        <button className="bg-white p-4 sm:p-7 mr-4 sm:mr-20 rounded-full"></button>
      </div>
    </div>

    <div className="flex justify-center mx-4 mt-12 sm:flex-row text-center">
      <h1 className="text-2xl sm:text-4xl text-red-300 font-medium">Conectá</h1>
      <h1 className="text-2xl sm:text-4xl ml-2 sm:ml-3 text-gray-900 font-medium">con personas</h1>
    </div>
    <div className="flex justify-center mx-4 mt-2 sm:mt-0">
      <h1 className="text-2xl sm:text-4xl text-gray-900 font-medium">que buscan lo mismo.</h1>
    </div>
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] mx-4 sm:mx-5 mt-10 px-6 sm:px-12 py-12 sm:py-16">
      <div className="border-b border-gray-200 p-2 flex items-center mb-7 sm:mb-12">
        <FaRegEnvelope className="text-gray-400 mr-4"></FaRegEnvelope>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="outline-none text-base"
        />
      </div>
      <div className="border-b border-gray-200 p-2 flex items-center mb-7 sm:mb-12">
        <FaRegEnvelope className="text-gray-400 mr-4"></FaRegEnvelope>
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="outline-none text-base"
        />
      </div>
      <div className="border-b border-gray-200 p-2 flex items-center mb-7 sm:mb-12">
        <FaRegEnvelope className="text-gray-400 mr-4"></FaRegEnvelope>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="outline-none text-base"
        />
      </div>
      <div className="border-b border-gray-200 p-2 flex items-center mb-7 sm:mb-12">
        <MdLockOutline className="text-gray-400 mr-4"></MdLockOutline>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="outline-none text-base"
        />
      </div>
      <div className="border-b border-gray-200 p-2 flex items-center mb-7 sm:mb-12">
        <MdLockOutline className="text-gray-400 mr-4"></MdLockOutline>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="outline-none text-base"
        />
      </div>
      <button
        type="submit"
        className="w-full mt-8 sm:mt-12 flex justify-center text-white bg-gray-900 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-6 sm:px-8 py-4 sm:py-4 dark:bg-gray-800 dark:text-white"
      >
        Registrarse
      </button>
    </div>
  </form>
</div>

  );
}

export default Page;