import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { useMutation, useQueryClient } from 'react-query';
import { useAuthHeader } from 'react-auth-kit';
import { deleteUser } from '../services/UserApi';

interface ConfirmDeleteModalUserProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    userId: number;
}

const ConfirmDeleteUserModal: React.FC<ConfirmDeleteModalUserProps> = ({open, setOpen, userId}) => {
    const queryClient = useQueryClient();
    const auth = useAuthHeader();

    const { status, error, mutate} = useMutation({
        mutationFn: (id: number) => deleteUser(id, auth()),
        onSuccess: () => {
          queryClient.invalidateQueries('users');
          queryClient.setQueryData(['users'], (oldUsers: any) => oldUsers ? oldUsers?.data?.filter((c: any) => c.id !== userId) : []);
          setOpen(false);
        }
    });

    const onConfirmDelete = () => {
        setOpen(false);
        mutate(userId);
    }
    
    return (
        <Modal
            basic
            open={open}
            size='small'
        >
        <Header icon>
            <Icon name='delete' />
            Delete User?
      </Header>
      <Modal.Content>
        <p>
            Are you sure you want to delete this user?
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

export default ConfirmDeleteUserModal;