import { Modal, Image } from 'semantic-ui-react';

interface ImageModalProps {
    image: string;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

const ImageModal:React.FC<ImageModalProps> = ({ image, isOpen, setOpen }) => {
    return (
        <Modal basic closeIcon open={ isOpen } onClose={() => setOpen(false)}>
            <Modal.Content>
                <Image centered size={"medium"} src={image} />
            </Modal.Content>
        </Modal>
    );
};


export default ImageModal;