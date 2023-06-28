import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, update, get } from "firebase/database";

export const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const userCredentials = await signInWithPopup(auth, provider)
        if (userCredentials) {
            const dbRef_1 = ref(db, 'users/' + userCredentials.user.uid)
            await update(dbRef_1, {
                displayName: userCredentials.user.displayName,
                email: userCredentials.user.email,
                uid: userCredentials.user.uid,
            })
            const dbRef_2 = ref(db, 'users/' + userCredentials.user.uid + '/photoURL')
            const photo = await get(dbRef_2)
            if (!photo.val()) {
                await update(dbRef_1, {
                    photoURL: userCredentials.user.photoURL
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
};