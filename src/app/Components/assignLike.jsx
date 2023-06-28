import { db } from "../firebase";
import { get, ref, push } from "firebase/database";
import { setMatch } from "./setMatch";
import { deleteLike } from "./deleteLike";

export const assignLike = async (userMateId, user) => {
    try {
        let send = true;
        let dbRef = ref(db, 'users/' + user.uid + '/likes/')
        let snapshot = await get(dbRef);
        if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach((key) => {
                if (snapshot.val()[key].user.uid === userMateId) {
                    deleteLike(user.uid, userMateId)
                    setMatch(user.uid, userMateId);
                    send = false;
                }
            });
        }
        if (send === true) {
            dbRef = ref(db, 'users/' + userMateId + '/likes/')
            const remitterId = user.uid;
            await push(dbRef, {
                remitterId
            });
            console.log(userMateId);
            dbRef = ref(db, 'users/' + userMateId + '/notifications/')
            await push(dbRef, {
                content: 'Nuevo like!',
                seen: false,
                "userMateId": remitterId 
            });
        }
    } catch (error) {
        console.log(error);
    }
}



