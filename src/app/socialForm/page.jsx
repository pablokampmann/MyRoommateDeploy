"use client";
import { db, getUser } from "../firebase";
import { useState, useEffect } from "react";
import {ref, update } from "firebase/database";
import { useRouter } from "next/navigation";
import {BsCheckCircle, BsFillCheckCircleFill} from "react-icons/bs";
import { MdArrowBack } from 'react-icons/md';


const Page = () => {
  const router = useRouter()
  const [user, setUser] = useState(null);
  const [facebookLink, setFacebookLink] = useState(null);
  const [twitterLink, setTwitterLink] = useState(null);
  const [redditLink, setRedditLink] = useState(null);
  const [instagramLink, setInstagramLink] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (error) {
        router.push("/notSign")
      }
    };
    fetchUser();
  }, [router]);

  async function addSocialLink(media, link) {
    try {
      const dbRef = ref(db, 'users/' + user.uid + '/socialMedia/');
      await update(dbRef, {
        [media]: link,
      });
    } catch (error) {
      console.log("Ocurrió el siguiente error: " + error);
    }
  }

  const handleFacebookChange = () => {
    const link = "https://www.facebook.com/"+facebookLink;
    addSocialLink('FacebookLink', link);
  };
  const handleTwitterChange = () => {
    const link = "https://twitter.com/"+twitterLink;
    addSocialLink('TwitterLink', link);
  };
  const handleRedditChange = () => {
    const link = "https://www.reddit.com/user/"+redditLink;
    addSocialLink('RedditLink', link);
  };
  const handleInstagramChange = () => {
    const link = "https://www.instagram.com/"+instagramLink;
    addSocialLink('InstagramLink', link);
  };

  return (












    
    <div className="h-screen w-full">
  

    <div className="flex justify-between mb-4 mt-5 mx-4 text-center">
    <a href="/profile">
      <button className=" bg-gray-200 p-7 mr-20 rounded-full hover:bg-gray-500 hover:text-white shadow-xl" ><MdArrowBack /></button>
      </a>
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-neutral-700">MY</h1>
        <h1 className="text-xl text-neutral-700">ROOMMATE </h1>
      </div>
     <div>
     <button className=" bg-white  p-7 mr-20 rounded-full " ></button>
     </div>
    </div>
  
     
   
      <div className="w-11/12 p-12 bg-white sm:w-8/12  ml-5 mt-24 lg:w-5/12">
     

        <label htmlFor="facebookLink" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Facebook</label>
        <div className="flex items-center justify-center">
          <input type="text" id="facebook" onChange={(e) => setFacebookLink(e.target.value)} name="facebook" placeholder="link hacia tu perfil de facebook" className="block w-full p-3 mt-2 text-gray-700 rounded-lg bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" />
          {
          facebookLink === null || facebookLink === '' ? (
          <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-300 hover:bg-gray-300 disabled:opacity-10"> 
          + 
          </button>
          ) : (
            <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-900 hover:bg-gray-300 disabled:opacity-10"  onClick={handleFacebookChange}> 
            +
            </button>
          )
          }
        </div>

        
        <label htmlFor="twitterLink" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Twitter</label>
        <div className="flex items-center justify-center ">
          <input type="text" id="twitter" onChange={(e) => setTwitterLink(e.target.value)} name="twitter" placeholder="link hacia tu perfil de twitter" className=" rounded-lg  block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" />
          {
            twitterLink === null || twitterLink === '' ? (
              <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-300 hover:bg-gray-300 disabled:opacity-10"> 
               +
              </button>
              ) : (
                <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-900 hover:bg-gray-300 disabled:opacity-10" onClick={handleTwitterChange}> 
                +
                </button>
              )
          }
        </div>
       
        <label htmlFor="redditLink" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Reddit</label>
        <div className="flex items-center justify-center">
          <input type="text" id="reddit" onChange={(e) => setRedditLink(e.target.value)} name="reddit" placeholder="link hacia tu perfil de reddit" className=" rounded-lg block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" />
         {
          redditLink === null || redditLink === '' ? (
            <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-300 hover:bg-gray-300 disabled:opacity-10"> 
             +
            </button>
            ) : (
              <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-900 hover:bg-gray-300 disabled:opacity-10" onClick={handleRedditChange}> 
              + 
              </button>
            )
         }
        </div>
        <label htmlFor="instagramLink" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Instagram</label>
        <div className="flex items-center justify-center">
          <input type="text" id="twitter" onChange={(e) => setInstagramLink(e.target.value)} name="twitter" placeholder="link hacia tu perfil de instagram" className=" rounded-lg  block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" />
          {
            instagramLink === null || instagramLink === '' ? (
              <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-300 hover:bg-gray-300 disabled:opacity-10"> 
              +
              </button>
              ) : (
                <button className="text-[8px] cursor-pointer  shadow-xl font-semibold ml-2 px-4 py-3 rounded-lg  text-gray-400 bg-gray-900 hover:bg-gray-300 disabled:opacity-10" onClick={handleInstagramChange}> 
                +
                </button>
              )
          }
          
        </div>
       
      </div>
    </div>
  )
}
export default Page;