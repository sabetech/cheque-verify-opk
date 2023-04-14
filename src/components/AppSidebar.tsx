import React, { useState } from 'react';
import { Button, Header,Icon, Menu, Segment, Sidebar, Grid } from 'semantic-ui-react'
import AddNewChequeModal from './AddNewChequeModal';
import TopBar from './TopBar'
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

interface AppSidebarProps {
  SubPage: React.FC;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ SubPage }) => {
    const [open, setOpen] = useState<boolean>(false)
    const user = useAuthUser();
    const loggedInUser = user();
    const navigate = useNavigate();

    const onAdminSettingsClick = () => {
      navigate('/admin');
    }

    return (
      <Sidebar.Pushable as={Segment} style={{height: '100vh' }}>
        <Sidebar
          as={Menu}
          animation='push'
          icon='labeled'
          inverted
          vertical
          visible
          width='thin'
        >
          <Menu.Item as='a' onClick={() => navigate('/')}>
            <Icon name='home' />
            Dashboard
          </Menu.Item>
          {
            loggedInUser?.user.role == 'admin' && 
            ( <>
              <Menu.Item as='a' onClick={onAdminSettingsClick}>
                <Icon name='cog' />
                Admin Settings
              </Menu.Item> 
              <Menu.Item as='a' >
              <Icon name='download' />
              Check for Updates
            </Menu.Item> 
            </>
            )
          }
        </Sidebar>
        <AddNewChequeModal open={open} setOpen={setOpen}/>
        <Sidebar.Pusher>
          <Segment basic>
          <TopBar />
            <SubPage />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )

}

export default AppSidebar;