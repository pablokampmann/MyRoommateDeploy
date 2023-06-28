import { db } from "../firebase";
import { ref, update, serverTimestamp, get } from "firebase/database";

export const setMessageSeen = async (userId, userMateId) => {
    try {
        let dbRef = ref(db, '/chats/' + (userId + userMateId) + '/messages/');
        let snapshot = await get(dbRef);
        if (snapshot.val()) {
            if (snapshot.val()) {
                Object.keys(snapshot.val()).forEach(async (key) => {
                    const message = snapshot.val()[key];
                    if (message.receiverId === userId) {
                        const messageRef = ref(db, `/chats/${userId + userMateId}/messages/${key}`);
                        await update(messageRef, {
                            seen: true
                        });
                    }
                });
            }
        } else {
            dbRef = ref(db, '/chats/' + (userMateId + userId) + '/messages/');
            snapshot = await get(dbRef);
            if (snapshot.val()) {
                Object.keys(snapshot.val()).forEach(async (key) => {
                    const message = snapshot.val()[key];
                    if (message.receiverId === userId) {
                        const messageRef = ref(db, `/chats/${userMateId + userId}/messages/${key}`);
                        await update(messageRef, {
                            seen: true
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}


