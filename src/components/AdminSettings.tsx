import React from "react";
import { Segment, Grid, Button, Divider, Header, Modal, Form, Radio, CheckboxProps  } from "semantic-ui-react";
import UserList from "./UserList";

const AdminSettings: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [role, setRole] = React.useState<string>('');
    const showAddNewUserModal = () => {
        setOpen((prev) => !prev);
    }

    const handleSelectRole = ( e: React.FormEvent<HTMLInputElement>, { value }: CheckboxProps) => {
        setRole(value as string);
    }

    return (
        <>
    <Segment placeholder>
        <Header as='h3' style={{alignSelf: 'flex-start'}}>Users </Header>
        <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
                
                <UserList showAddNewUserModal={showAddNewUserModal} />
                
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
                <Button content='Add New User' icon='signup' size='big' onClick={showAddNewUserModal} />
            </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
    </Segment>
    <Modal
        size={'small'}
        open={open}
      >
        <Modal.Header>Users Modification</Modal.Header>
        <Modal.Content>
        <Form>
            <Form.Field>
                <label>Name</label>
                <input placeholder='First Name' />
            </Form.Field>
            <Form.Field>
                <label>Email</label>
                <input placeholder='email@mail.com' type="email" readOnly/>
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input placeholder='Password' type="password" />
            </Form.Field>
            <Form.Field>
                <label>Role: {role}</label>
                <Radio label='Admin' name='role' value='admin' checked={role === 'admin'} onChange={handleSelectRole} />
                <Radio label='Clerk' name='role' value='clerk' checked={role === 'clerk'} onChange={handleSelectRole} />
            </Form.Field>
            <Button type='submit'>Submit</Button>
        </Form>
            
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={showAddNewUserModal}>
            No
          </Button>
          <Button positive onClick={showAddNewUserModal}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </>
);
}

export default AdminSettings;

