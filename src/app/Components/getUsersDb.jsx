import { db } from "../firebase";
import { get, ref } from "firebase/database";

export const getUsersDb = async (id) => {
    try {
        const users = [];
        const usersNotIncluded = [];
        let dbRef = ref(db, 'users/');
        let snapshot = await get(dbRef);
        const values = snapshot.val();
        if (values) {
            if (snapshot.val()) {
                Object.keys(snapshot.val()).forEach((key) => {
                    if (snapshot.val()[key].likes) {
                        Object.keys(snapshot.val()[key].likes).forEach((likeKey) => {
                            if (snapshot.val()[key].likes[likeKey].remitterId === id) {
                                usersNotIncluded.push(key);
                            }
                        });
                    }
                });
            }
            dbRef = ref(db, 'users/' + id + '/matches/')
            snapshot = await get(dbRef);
            if (snapshot.val()) {
                Object.keys(snapshot.val()).forEach((key) => {
                    usersNotIncluded.push(snapshot.val()[key].userMateId);
                });
            }
            for (const key of Object.keys(values)) {
                if (!usersNotIncluded.includes(key) && key !== id) {
                    let user = values[key];
                    user.uid = key;
                    users.push(user);
                }
            }
        }
        return users;
    } catch (error) {
        console.log(error);
    }
}

