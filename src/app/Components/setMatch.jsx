import { db } from "../firebase";
import { ref, push } from "firebase/database";

export const setMatch = async (userId, userMateId) => {
    try {
        let dbRef = ref(db, 'users/' + userId + '/matches/')
        await push(dbRef, {
            "userMateId": userMateId
        });
        dbRef = ref(db, 'users/' + userId + '/notifications/')
        await push(dbRef, {
            content: 'Tienes un nuevo match!',
            seen: false,
            userMateId 
        });
        dbRef = ref(db, 'users/' + userMateId + '/matches/')
        await push(dbRef, {
            "userMateId": userId
        });
        dbRef = ref(db, 'users/' + userMateId + '/notifications/')
        await push(dbRef, {
            content: 'Tienes un nuevo match!',
            seen: false,
            "userMateId": userId 
        });
    } catch (error) {
        console.log(error);
    }
}


