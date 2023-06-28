import UploadPropertyPhotos from "./UploadPropertyPhotos";
import { useDisclosure } from '@mantine/hooks';
import { Modal, useMantineTheme } from '@mantine/core';


const PropertyPhotosModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  return (
    <div >
      <div className="mt-5 text-center ">
        <button className="w-full mt-12 flex justify-center text-white bg-gray-900 border border-gray-300 focus:outline-none font-medium rounded-2xl text-sm px-8 py-4 dark:bg-gray-800 dark:text-white" onClick={open}>
          Subir fotos de la propiedad
        </button>
        <Modal
          opened={opened}
          onClose={close}
          centered
          overlayProps={{
            color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
            opacity: 0.55,
            blur: 3,
          }}
          size="55rem"
          >
          <UploadPropertyPhotos />
        </Modal>

      </div>
    </div>);
}
export default PropertyPhotosModal;