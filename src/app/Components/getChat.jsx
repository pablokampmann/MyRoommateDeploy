import { db } from "../firebase";
import { ref, get } from "firebase/database";

export const getChat = async (userId, userMateId) => {
    try {
        let messages = [];
        let dbRef = ref(db, '/chats/' + (userId + userMateId) + '/messages/');
        let snapshot = await get(dbRef);
        if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach((key) => {
                messages.push(snapshot.val()[key]);
            });
        } else {
            dbRef = ref(db, '/chats/' + (userMateId + userId) + '/messages/');
            snapshot = await get(dbRef);
            if (snapshot.val()) {
                Object.keys(snapshot.val()).forEach((key) => {
                    messages.push(snapshot.val()[key]);
                });
            }
        }
        return messages;
    } catch (error) {
        console.log(error);
    }
}


