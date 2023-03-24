import { Button, Menu, Header } from 'semantic-ui-react'
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate('/login');
  }

  return (
  <Menu style={{width: '90%', display: 'flex', justifyContent: 'flex-end'}} >
    <Menu.Item>
        <Header as='h5'>Samuel Banini (Admin)</Header>
    </Menu.Item>
    <Menu.Item>
      <Button color='red' onClick={ logout }>Logout</Button>
    </Menu.Item>
  </Menu>
  )
}

export default TopBar;