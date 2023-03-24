import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import chequeImage from '../assets/cheque-new.png'
import AddNewChequeForm from './AddNewChequeForm';

interface AddNewChequeModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const AddNewChequeModal: React.FC<AddNewChequeModalProps> = ({ open, setOpen }): JSX.Element => {

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
          <AddNewChequeForm />
          
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
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default AddNewChequeModal