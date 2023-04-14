import React, { useEffect } from "react";
import { Segment, Grid, Button, Divider, Header, Modal, Form, Radio, CheckboxProps  } from "semantic-ui-react";
import UserList from "./UserList";
import { useQuery, useMutation, QueryClient } from "react-query";
import { addNewUser, editUser, getUsers } from "../services/UserApi";
import { useAuthHeader } from "react-auth-kit";

interface Role {
    id: number;
    name: string;
  }
  interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<Role>;
  }

const AdminSettings: React.FC = () => {
    const [heading, setHeading] = React.useState<string>('Add New User');
    const [users, setUsers] = React.useState<User[]>([]);
    const [open, setOpen] = React.useState<boolean>(false);
    const [userId, setUserId] = React.useState<number>(0);
    const [selectedUser, setSelectedUser] = React.useState<User | undefined>(undefined); //selected user
    const [role, setRole] = React.useState<string>(''); //admin or clerk
    const [name, setName] = React.useState<string>(''); //user name
    const [email, setEmail] = React.useState<string>(''); //user email
    const [password, setPassword] = React.useState<string>('');
    
    const auth = useAuthHeader(); //get the auth header
    const queryClient = new QueryClient(); //create a new query client

    //use react query to fetch users from the database
    const { data } = useQuery(['users'], () => getUsers(auth()));
    const { mutate } = useMutation({
        mutationFn: (values: any) => {
            if (userId === 0) {
                return addNewUser(values, auth())
            }
            return editUser(userId, values, auth())
        },
        
        onSuccess: newUser => {
          queryClient.invalidateQueries('users');
          queryClient.setQueryData(['users'], (oldUsers: any) => oldUsers ? [...oldUsers, newUser] : []);
          setOpen(false);
        }
    });
    useEffect(() => {
        setUsers(data);
    }, [data]);
    
    useEffect(() => {
        
        if(userId > 0){
            setSelectedUser(users.find((user: User) => user.id === userId));
        }

    },[ userId ]);

    useEffect(() => {
        if(selectedUser){
            setName(selectedUser.name);
            setRole(selectedUser.roles.length > 0 ? selectedUser.roles[0].name : '');
            setEmail(selectedUser.email);
        }
    }, [selectedUser]);

    const addNewUserClick = () => {
        setUserId(0);
        setName('');
        setRole('');
        setEmail('');
        selectedUser && setSelectedUser(undefined);
        showAddNewUserModal(true);
    }

    const showAddNewUserModal = (open: boolean) => {
        setOpen(open);
    }

    const handleSelectRole = ( e: React.FormEvent<HTMLInputElement>, { value }: CheckboxProps) => {
        setRole(value as string);
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSave = () => {
        
        const values = {
            name: name,
            email: email,
            password: password,
            role: role
        }

        mutate(values);

    }

    return (
        <>
    <Segment placeholder>
        <Header as='h3' style={{alignSelf: 'flex-start'}}>Users </Header>
        <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
                
                <UserList showAddNewUserModal={showAddNewUserModal} users={users} setUserId={setUserId}/>
                
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
                <Button content='Add New User' icon='signup' size='big' onClick={() => addNewUserClick()} />
            </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
    </Segment>
    <Modal
        size={'small'}
        open={open}
      >
        <Modal.Header>{ userId > 0? "Edit User":"Add New User" }</Modal.Header>
        <Modal.Content>
        <Form>
            <Form.Field>
                <label>Name</label>
                <input placeholder='Name' value={ name } onChange={handleNameChange}/>
            </Form.Field>
            <Form.Field>
                <label>Email</label>
                <input placeholder='email@mail.com' type="email" value={ email } readOnly={userId !== 0} onChange={(e) => setEmail(e.target.value)}/>
            </Form.Field>
            <Form.Field>
                <label>Password <em>(Leave blank to maintain old password)</em></label>
                <input placeholder='Type in a new password' type="password" defaultValue={""} value={password} onChange={handlePasswordChange}/>
            </Form.Field>
            <Form.Field>
                <label>Role: {role}</label>
                <Radio label='Admin' name='role' value='admin' checked={role === 'admin'} onChange={handleSelectRole} />
                <Radio label='Clerk' name='role' value='clerk' checked={role === 'clerk'} onChange={handleSelectRole} />
            </Form.Field>
            <Button type='submit' onClick={handleSave}>Submit</Button>
        </Form>
            
        </Modal.Content>
        <Modal.Actions>
          <Button color={"black"} onClick={() => showAddNewUserModal(false)}>
           Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
);
}

export default AdminSettings;

