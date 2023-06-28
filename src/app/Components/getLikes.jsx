import { db } from "../firebase";
import { get, ref } from "firebase/database";

export const getLikes = async (id) => {
    try {
        const usersUid = [];
        const users = [];
        let dbRef = ref(db, 'users/' + id + '/likes/')
        let snapshot = await get(dbRef);
        let values = snapshot.val();
        if (values) {
            Object.keys(values).forEach((key) => {
                usersUid.push(values[key].remitterId)
            });
            dbRef = ref(db, 'users/')
            snapshot = await get(dbRef);
            values = snapshot.val();
            Object.keys(values).forEach((key) => {
                if (usersUid.includes(key)) {
                    users.push(values[key]);
                }
            });
            return users;
        } else {
            return('NoLikes')
        }
    } catch (error) {
        console.log(error);
    }
}

