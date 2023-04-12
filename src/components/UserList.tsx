import React from 'react'
import { Image, List, Button, Icon } from 'semantic-ui-react'
import { useQuery } from 'react-query';
import { getUsers } from '../services/UserApi';
import { useAuthHeader } from 'react-auth-kit';

interface UserListProps {
  showAddNewUserModal: () => void;
}

const UserList: React.FC<UserListProps> = ({ showAddNewUserModal }) => {
  const auth = useAuthHeader(); //get the auth header

  //use react query to fetch users from the database
  const { data } = useQuery(['users'], () => getUsers(auth()));

  const onUserRemove = (id: number) => {
    console.log("TO BE DELTED" + id);
  }

return (
  <List animated selection verticalAlign='middle'>
    {
      data?.map((user: any) => {
        return (
          <List.Item key={user.id} >
            <List.Content floated='right'>
              <Button color='red' onClick={() => onUserRemove(user.id)}>Remove</Button>
            </List.Content>
            <Image avatar src='https://www.shareicon.net/download/128x128//2017/02/15/878685_user_512x512.png' />
            <List.Content onClick={() => showAddNewUserModal()}>{ user.name }</List.Content>
          </List.Item>
        )
      })
    }
  </List>
  );
}

export default UserList;