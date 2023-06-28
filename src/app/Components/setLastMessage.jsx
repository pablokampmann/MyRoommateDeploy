import { db } from "../firebase";
import { ref, set } from "firebase/database";

export const setLastMessage = async (userId, userMateId, messageId) => {
    try {
        let dbRef = ref(db, '/users/' + userId + '/lastMessage');
        await set(dbRef, {
            messageId
        })
        dbRef = ref(db, '/users/' + userMateId + '/lastMessage');
        await set(dbRef, {
            messageId
        })
    } catch (error) {
        console.log(error);
    }
}


