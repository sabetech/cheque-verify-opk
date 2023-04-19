import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import chequeImage from '../assets/cheque-new.png'
import AddNewChequeForm from './AddNewChequeForm';
import { useMutation, useQueryClient } from 'react-query';
import { addNewCheque } from '../services/ChequeApi';
import { useAuthHeader } from 'react-auth-kit';
interface AddNewChequeModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface Cheque {
  date_issued: string,
  cheque_holder_name: string,
  serial_no: string,
  amount: number,
  date_due: string,
  image: File
}

const AddNewChequeModal: React.FC<AddNewChequeModalProps> = ({ open, setOpen }): JSX.Element => {

    const [dateIssued, setDateIssued] = React.useState<Date | null>(null);
    const [chequeHoldername, setChequeHoldername] = React.useState<string>('');
    const [serialNumber, setSerialNumber] = React.useState<string>('');
    const [amount, setAmount] = React.useState<string>('');
    const [dateDue, setDateDue] = React.useState<Date | null>(null);
    const [image, setImage] = React.useState<File | null>(null);
    const queryClient = useQueryClient();
    const auth = useAuthHeader();

    const { mutate } = useMutation({
      
        mutationFn: (values: Cheque) => addNewCheque(values, auth()),
        onSuccess: newCheque => {
          queryClient.invalidateQueries('cheques');
          queryClient.setQueryData(['cheques'], (oldCheques: any) => oldCheques ? [...oldCheques, newCheque] : []);
          setOpen(false);
          setImage(null);
        }
    });

    const onSubmit = () => {
        if (!dateIssued) {
            alert('Date issued is required');
            return;
        }

        if (!chequeHoldername) {
            alert('Cheque holder name is required');
            return;
        } 

        if (!serialNumber) {
            alert('Serial number is required');
            return;
        }

        if (!amount) {
            alert('Amount is required');
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
            date_issued: dateIssued.toISOString().split("T")[0],
            cheque_holder_name: chequeHoldername,
            serial_no: serialNumber,
            amount: parseFloat(amount),
            date_due: dateDue.toISOString().split("T")[0],
            image: image,
        } as Cheque;
        
        mutate(values);

    }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Add New Cheque</Modal.Header>
      <Modal.Content image>
        <Image size='medium' src={chequeImage} wrapped />
        <Modal.Description>
          <Header>Add New Cheque</Header>
          
          <AddNewChequeForm 
            setDateIssued={ setDateIssued }
            setChequeHoldername={ setChequeHoldername }
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