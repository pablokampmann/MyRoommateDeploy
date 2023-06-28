import { db } from "../firebase";
import { get, ref, remove } from "firebase/database";

export const deleteLike = async (id, userMateId) => {
    try {
        const dbRef = ref(db, 'users/' + id + '/likes/')
        let snapshot = await get(dbRef);
        if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach((key) => {
                if (snapshot.val()[key].remitterId === userMateId) {
                    const likeRef = ref(db, 'users/' + id + '/likes/' + key);
                    remove(likeRef);
                }
            }); 
        }
    } catch (error) {
        console.log(error);
    }
}

