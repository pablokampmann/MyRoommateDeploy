"use client";
import { db, getUser } from "../firebase";
import { useState, useEffect } from "react";
import { ref, update } from "firebase/database";

const DescriptionF = ({ changeValue }) => {
    const [user, setUser] = useState(null);
    const [description, setDescription] = useState(null);

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

    async function addDescription(content) {
        try {
            const dbRef = ref(db, 'users/' + user.uid);
            await update(dbRef, {
                description: content
            });
            setUser(prevUser => ({ ...prevUser, description: description }));
        } catch (error) {
            console.log("Ocurrió el siguiente error: " + error);
        }
    }

    const handleSubmit = () => {
        addDescription(description)
    }

    return (
        <div className="mx-8">

            <div className="flex items-center justify-center">
                <textarea cols="40" rows="5" type="text" id="description" onChange={(e) => setDescription(e.target.value)} name="description" placeholder="Deja tu información para otros usuarios" className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner rounded-lg" />
                {
                    description === null || description === '' ? (
                        <button className="flex justify-center text-white bg-gray-300 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-4 ml-2 py-2 dark:bg-gray-800 dark:text-white">
                            +
                        </button>
                    ) : (
                        <button className="flex justify-center text-white bg-gray-900 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-4 ml-2 py-2 dark:bg-gray-800 dark:text-white" onClick={handleSubmit}>
                            +
                        </button>
                    )
                }
            </div>
        </div>
    );
}
export default DescriptionF;