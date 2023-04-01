import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { useMutation, useQueryClient } from 'react-query';
import { deleteCheque } from '../services/ChequeApi';
import { useAuthHeader } from 'react-auth-kit';

interface ConfirmDeleteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    chequeId: number;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({open, setOpen, chequeId}) => {
    const queryClient = useQueryClient();
    const auth = useAuthHeader();

    const { status, error, mutate} = useMutation({
        mutationFn: (id: number) => deleteCheque(id, auth()),
        onSuccess: () => {
          queryClient.invalidateQueries('cheques');
          queryClient.setQueryData(['cheques'], (oldCheques: any) => oldCheques ? oldCheques.data.filter((c: any) => c.id !== chequeId) : []);
          setOpen(false);
        }
    });

    const onConfirmDelete = () => {
        setOpen(false);
        mutate(chequeId);
    }
    
    return (
        <Modal
            basic
            open={open}
            size='small'
        >
        <Header icon>
            <Icon name='delete' />
            Delete Cheque?
      </Header>
      <Modal.Content>
        <p>
            Are you sure you want to delete this cheque?
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={() => setOpen(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted onClick={() => onConfirmDelete()}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
    )
}

export default ConfirmDeleteModal;