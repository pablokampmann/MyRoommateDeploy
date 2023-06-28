import { useRouter } from "next/navigation";

const ManageS = () =>{
    const router = useRouter();

    function handleClick() {
        router.push("/socialForm");
      }

    return (
    <div className="mt-5 text-center border-b-2 border-gray-200 pb-5 ">
    <button className="w-full mt-5 flex justify-center   text-white bg-gray-900 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-8 py-4 dark:bg-gray-800 dark:text-white" onClick={handleClick}>
          Añadir redes
        </button>
  </div>);
}
export default ManageS;