"use client";

import { useEffect, useState } from "react";
import { getUser, storage, db } from "./../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation"
import { update, ref as databasebRef } from "firebase/database";

const UploadPP = () => {
  const router = useRouter()
  const [user, setUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  //------------------------------------------------------------------------------------------
  const resizeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const newSize = 150;
          canvas.width = newSize;
          canvas.height = newSize;
          ctx.drawImage(img, 0, 0, newSize, newSize);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, file.type);
        };
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  };
  //------------------------------------------------------------------------------------------

  const upload = async () => {
    try {
      const resizedFile = await resizeImage(photoFile);
      const fileRef = storageRef(storage, `profilePicture/${user.uid}.png`);
      const snapshot = await uploadBytes(fileRef, resizedFile)
      const photoURL = await getDownloadURL(snapshot.ref)
      console.log(photoURL);
      const dbRef = databasebRef(db, 'users/' + user.uid)
      await update(dbRef, {
        photoURL: photoURL,
      })
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0])
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center">

        <div className="flex justify-center w-full mx-10 mt-5">
          <input className="block w-full  shadow-xs rounded-md text-xs focus:z-10 focus:ring-blue-500  dark:text-gray-400
          file:bg-transparent file:border-0
        file:bg-gray-300 file:mr-4
          file:py-3 file:px-4
        dark:file:bg-gray-400 dark:file:text-gray-400"
            type="file"
            onChange={handleChange} />
          <button className="text-[8px] cursor-pointer  shadow-xl font-semibold m-2 px-3  rounded-lg  text-gray-400 bg-gray-700 hover:bg-gray-300 disabled:opacity-10" disabled={!photoFile} onClick={upload}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPP;  