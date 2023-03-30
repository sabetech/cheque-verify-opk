import React, { useEffect } from 'react';
import { Button, Menu, Header } from 'semantic-ui-react'
import { useSignOut, useAuthUser, useAuthHeader } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/ChequeApi';

const TopBar: React.FC = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const user = useAuthUser();
  const authHeader = useAuthHeader();
  const [name, setName] = React.useState<string>('');

  console.log();
  useEffect(() => {
    const userInfo = user();
    if (userInfo) {
      setName(userInfo.user.name);
    }
  }, []);

  const logout = () => {
    api.logout(authHeader());
    signOut();
    navigate('/login');
  }

  return (
  <Menu style={{width: '90%', display: 'flex', justifyContent: 'flex-end'}} >
    <Menu.Item>
        <Header as='h5'>{ name } (Admin)</Header>
    </Menu.Item>
    <Menu.Item>
      <Button color='red' onClick={ logout }>Logout</Button>
    </Menu.Item>
  </Menu>
  )
}

export default TopBar;