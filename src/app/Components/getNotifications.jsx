import { db } from "../firebase";
import { get, ref } from "firebase/database";

export const getNotifications = async (id) => {
    try {
        const notifications = [];
        let dbRef = ref(db, 'users/' + id + '/notifications/');
        let snapshot = await get(dbRef);
        if (snapshot.val()) {
            for (const key of Object.keys(snapshot.val())) {
                dbRef = ref(db, 'users/' + snapshot.val()[key].userMateId);
                const userSnapshot = await get(dbRef);
                const name = userSnapshot.val().displayName;
                const photo = userSnapshot.val().photoURL;
                const updatedObj = {
                  ...snapshot.val()[key],
                  displayName: name, 
                  photoURL: photo 
                };
                notifications.push(updatedObj);
            }
            return notifications;
        } else {
            return 'NoNotifications'
        }
    } catch (error) {
        console.log(error);
    }
}

