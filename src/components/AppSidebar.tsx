import React from 'react';
import { Header,Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import reactLogo from '../assets/react.svg'
import TopBar from './TopBar'

const AppSidebar: React.FC = () => {
    
    return (
      <Sidebar.Pushable as={Segment} >
        <Sidebar
          as={Menu}
          animation='push'
          icon='labeled'
          inverted
          vertical
          visible
          width='thin'
        >
          <Menu.Item as='a'>
            <Icon name='home' />
            Dashboard
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='add' />
            Add New Cheque
          </Menu.Item>
        </Sidebar>
  
        <Sidebar.Pusher>
          <Segment basic>
          <TopBar />  
            <Header as='h3'>Dashboard Summary</Header>
            <Image src={reactLogo} />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )

}

export default AppSidebar;