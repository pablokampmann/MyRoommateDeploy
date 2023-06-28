import { db } from "../firebase";
import { get, ref } from "firebase/database";
import { getChats } from './../Components/getChats';

export const getMatches = async (id) => {
    try {
        const usersUid = [];
        const matches = [];
        let dbRef = ref(db, 'users/' + id + '/matches/')
        let snapshot = await get(dbRef);
        if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach((key) => {
                usersUid.push(snapshot.val()[key].userMateId)
            });
            dbRef = ref(db, 'users/')
            snapshot = await get(dbRef);
            Object.keys(snapshot.val()).forEach((key) => {
                if (usersUid.includes(key)) {
                    const user = snapshot.val()[key];
                    matches.push(user);
                }
            });
            const chats = await getChats(id);
            for (let i = 0; i < matches.length; i++) {
                if (matches[i].lastMessage) {
                    for (let j = 0; j < chats.length; j++) {
                        const chatMessages = chats[j].messages;
                        const lastMessageId = matches[i].lastMessage.messageId;
                        if (chatMessages && Object.keys(chatMessages).includes(lastMessageId)) {
                            matches[i].message = chatMessages[lastMessageId];
                        }
                    }
                }
            }
        }
        return matches;
    } catch (error) {
        console.log(error);
    }
}

