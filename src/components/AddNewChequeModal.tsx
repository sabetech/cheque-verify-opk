import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import chequeImage from '../assets/cheque-new.png'
import AddNewChequeForm from './AddNewChequeForm';
import { QueryClient, useMutation, useQueryClient } from 'react-query';
import { addNewCheque } from '../services/ChequeApi';
interface AddNewChequeModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface Cheque {
  cheque_date: string,
  cheque_number: string,
  amount: number,
  cheque_due_date: string,
  image: File
}

const AddNewChequeModal: React.FC<AddNewChequeModalProps> = ({ open, setOpen }): JSX.Element => {

    const [dateIssued, setDateIssued] = React.useState<Date | null>(null);
    const [serialNumber, setSerialNumber] = React.useState<string>('');
    const [amount, setAmount] = React.useState<string>('');
    const [dateDue, setDateDue] = React.useState<Date | null>(null);
    const [image, setImage] = React.useState<File | null>(null);
    const queryClient = useQueryClient();

    const { status, error, mutate} = useMutation({
        mutationFn: addNewCheque,
        onSuccess: newCheque => {
          queryClient.setQueryData('cheques', (oldCheques: any) => [...oldCheques, newCheque]);
          setOpen(false);
        }
    });

    const onSubmit = () => {
        
        if (!dateIssued) {
            alert('Date issued is required');
            return;
        }

        if (!dateDue) {
            alert('Date due is required');
            return;
        }

        if (dateIssued > dateDue) {
            alert('Date issued cannot be greater than date due');
            return;
        }

        if (image === null) {
            alert('Image is required');
            return;
        }

        const values = {
            cheque_date: dateIssued.toISOString() .split("T")[0],
            cheque_number: serialNumber,
            amount: parseFloat(amount),
            cheque_due_date: dateDue.toISOString() .split("T")[0],
            image: image,
        }
        console.log(values);
        mutate(values);

    }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>Add New Cheque</Modal.Header>
      <Modal.Content image>
        <Image size='medium' src={chequeImage} wrapped />
        <Modal.Description>
          <Header>Add New Cheque</Header>
          
          <AddNewChequeForm 
            setDateIssued={ setDateIssued }
            setDateDue={ setDateDue } 
            setSerialNumber={ setSerialNumber } 
            setAmount={ setAmount } 
            setImage={ setImage } 
            imageName={ image ? image.name : '' }
          />
          {
                image && <img src={URL.createObjectURL(image)} height="180"/>
          }
          
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Submit"
          labelPosition='right'
          icon='checkmark'
          positive
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default AddNewChequeModal