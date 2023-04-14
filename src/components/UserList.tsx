import React, {useEffect} from 'react'
import { Image, List, Button, Icon } from 'semantic-ui-react'
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getUsers } from '../services/UserApi';
import { editUser } from '../services/UserApi';
import { useAuthHeader } from 'react-auth-kit';

interface UserListProps {
  showAddNewUserModal: (open: boolean) => void;
  users: Array<User>;
  setUserId: (id: number) => void;
}
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

const UserList: React.FC<UserListProps> = ({ showAddNewUserModal, users, setUserId }) => {

  const onUserRemove = (id: number) => {
   

  }

  const onEditUser = (id: number) => {
    setUserId(id)
    showAddNewUserModal(true);
  }


return (
  <List animated selection verticalAlign='middle'>
    {
      users?.map((user: User) => {
        return (
          <List.Item key={user.id} >
            <List.Content floated='right'>
              <Button color='red' onClick={() => onUserRemove(user.id)} size={"tiny"}>X</Button>
            </List.Content>
            <Image avatar src='https://www.shareicon.net/download/128x128//2017/02/15/878685_user_512x512.png' />
            <List.Content onClick={() => onEditUser(user.id)}><strong>{ user.name } </strong><em>({user.roles.length > 0 ? user.roles[0].name : "No Assigned Role"})</em></List.Content>
          </List.Item>
        )
      })
    }
  </List>
  );
}

export default UserList;