"use client";

import { getUser, storage, db } from "../firebase";
import { useState, useEffect } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { update, ref as databasebRef } from "firebase/database";

const UploadPropertyPhotos = () => {
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

    const handleChange = (event) => {
        const files = event.target.files[0];
        setPhotoFile(files);
    };

    const handleUpload = async () => {
        try {
            console.log(user);
            let ref = storageRef(storage, 'profileImages/' + user.uid + '/' + photoFile.name);
            await uploadBytes(ref, photoFile);
            const photos = await getPropertyPhotos();
            ref = databasebRef(db, 'users/' + user.uid)
            await update(ref, {
                propertyPhotos: photos
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getPropertyPhotos = async () => {
        try {
            const ref = storageRef(storage, 'profileImages/' + user.uid + '/');
            const snapshot = await listAll(ref)
            const photos = [];
            for (const photoRef of snapshot.items) {
                const downloadURL = await getDownloadURL(photoRef);
                photos.push(downloadURL);
            }
            return (photos);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="">
            <div className="flex flex-col items-center">
                <h2 className="">Fotos de la propiedad</h2>
                <div className="flex justify-center w-full mx-10 mt-5">
                    <input className="block w-full  shadow-xs rounded-md text-xs focus:z-10 focus:ring-blue-500  dark:text-gray-400 file:bg-transparent file:border-0 file:bg-gray-300 file:mr-4 file:py-3 file:px-4 dark:file:bg-gray-400 dark:file:text-gray-400" type="file" multiple onChange={handleChange} />
                    <button className="flex justify-center text-white bg-gray-900 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-4 ml-2 py-2 dark:bg-gray-800 dark:text-white" disabled={!photoFile} onClick={handleUpload}></button>
                </div>
            </div>
        </div>
    );
}

export default UploadPropertyPhotos;