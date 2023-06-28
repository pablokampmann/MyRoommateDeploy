import { db } from "../firebase";
import { get, ref } from "firebase/database";

export const getChats = async (id) => {
    try {
        const matches = [];
        let dbRef = ref(db, 'chats/')
        let snapshot = await get(dbRef);
        if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach((key) => {
                if (key.includes(id)) {
                    matches.push(snapshot.val()[key]);
                }
            });
        }
        return matches;
    } catch (error) {
        console.log(error);
    }
}

