import React, { useState, useEffect } from "react";
import { BsHouse, BsHeart, BsChat, BsPerson, BsHouseFill, BsPersonFill, BsHeartFill, BsChatFill } from 'react-icons/bs';
import { useRouter, usePathname } from "next/navigation";
import Image from 'next/image';

export const Navigation = ({ changeValueLoading }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [activeButton, setActiveButton] = useState(pathname);

    const handleNavigation = (nextRoute) => {
        try {
            setActiveButton(nextRoute);
            router.push(nextRoute);
            changeValueLoading(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-50">
            <ul className="flex justify-center m-4">
                {activeButton === "/" ? (
                    <button className="m-auto scale-150">
                        <Image src="/cardsFill.png" width={25} height={25} className="mx-5 " alt="User Avatar" />
                    </button>
                ) : (
                    <button className="m-auto scale-150" onClick={() => { handleNavigation("/"); }}>
                        <Image src="/cards.png" width={25} height={25} className="mx-5 " alt="User Avatar" />
                    </button>
                )}

                {activeButton === "/likes" ? (
                    <button className="m-auto scale-150" onClick={() => handleNavigation("/likes")}>
                         <Image src="/heartFill.png" width={25} height={25} className="mx-5 rounded-full" alt="User Avatar" />
                    </button>
                ) : (
                    <button className="m-auto scale-150" onClick={() => { handleNavigation("/likes"); }}>
                        <Image src="/heart.png" width={25} height={25} className="mx-5 rounded-full" alt="User Avatar" />
                    </button>
                )}

                {activeButton === "/chat" ? (
                    <button className="m-auto scale-150">
                       <Image src="/chatFill1.png" width={25} height={25} className="mx-5 " alt="User Avatar" />
                    </button>
                ) : (
                    <button className="m-auto scale-150" onClick={() => handleNavigation("/chat")}>
                        <Image src="/chat1.png" width={25} height={25} className="mx-5 " alt="User Avatar" />
                    </button>
                )}

                {activeButton === "/profile" ? (
                    <button className="m-auto scale-150">
                        <Image src="/userFill.png" width={25} height={25} className="mx-5 " alt="User Avatar" />
                    </button>
                ) : (
                    <button className="m-auto scale-150" onClick={() => handleNavigation("/profile")}>
                        <Image src="/user.png" width={25} height={25} className="mx-5 " alt="User Avatar" />
                    </button>
                )}
            </ul>
        </nav>
    );
}

