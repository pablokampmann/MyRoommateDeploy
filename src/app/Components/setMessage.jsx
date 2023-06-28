import { db } from "../firebase";
import { ref, push, get } from "firebase/database";
import { setLastMessage } from "./setLastMessage";

export const setMessage = async (userId, userMateId, message) => {
    try {
        let dbRef = ref(db, '/chats/' + (userId + userMateId) + '/messages/');
        let snapshot = await get(dbRef);
        const date = new Date()
        const hour = date.getHours();
        const minute = date.getMinutes();
        if (snapshot.val()) {
            const newPushRef = await push(dbRef, {
                senderId: userId,
                receiverId: userMateId,
                content: message,
                createdAt: hour + ':' + minute,
                seen: false
            });
            const messageId = newPushRef.key;
            await setLastMessage(userId, userMateId, messageId);
            dbRef = ref(db, 'users/' + userMateId + '/notifications/')
            await push(dbRef, {
                content: 'Nuevo mensaje!',
                seen: false,
                userMateId: userId
            });
        } else {
            dbRef = ref(db, '/chats/' + (userMateId + userId) + '/messages/');
            snapshot = await get(dbRef);
            if (snapshot.val()) {
                const newPushRef = await push(dbRef, {
                    senderId: userId,
                    receiverId: userMateId,
                    content: message,
                    createdAt: hour + ':' + minute,
                    seen: false
                });
                const messageId = newPushRef.key;
                await setLastMessage(userId, userMateId, messageId);
                dbRef = ref(db, 'users/' + userMateId + '/notifications/')
                await push(dbRef, {
                    content: 'Nuevo mensaje!',
                    seen: false,
                    userMateId: userId
                });
            } else {
                dbRef = ref(db, '/chats/' + (userId + userMateId) + '/messages/');
                const newPushRef = await push(dbRef, {
                    senderId: userId,
                    receiverId: userMateId,
                    content: message,
                    createdAt: hour + ':' + minute,
                    seen: false
                });
                const messageId = newPushRef.key;
                await setLastMessage(userId, userMateId, messageId);
                dbRef = ref(db, 'users/' + userMateId + '/notifications/')
                await push(dbRef, {
                    content: 'Nuevo mensaje!',
                    seen: false,
                    userMateId: userId
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}


