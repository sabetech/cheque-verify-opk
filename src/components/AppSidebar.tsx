import React, { useState } from 'react';
import { Button, Header,Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'
import AddNewChequeModal from './AddNewChequeModal';
import TableSummaries from './TableSummaries';
import TopBar from './TopBar'
import { useQuery } from 'react-query';
import { Loader } from 'semantic-ui-react';
import { useAuthUser } from 'react-auth-kit';

const AppSidebar: React.FC = (props: any) => {
    const [open, setOpen] = useState<boolean>(false)
    const { isLoading } = useQuery(['cheques'])
    const user = useAuthUser();
    const loggedInUser = user();
    const showAddNewChequeModal = () => {
      setOpen((prev) => !prev);
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
          <Menu.Item as='a'>
            <Icon name='home' />
            Dashboard
          </Menu.Item>
          {
            loggedInUser?.user.role == 'admin' && 
            ( 
              <Menu.Item as='a' >
                <Icon name='cog' />
                Admin Settings
              </Menu.Item> 
            )
          }
        </Sidebar>
        <AddNewChequeModal open={open} setOpen={setOpen}/>
        <Sidebar.Pusher>
          <Segment basic>
          <TopBar />
            <Button size='big' style={{ alignSelf: 'flex-end' }} onClick={(e) => showAddNewChequeModal()}><Icon name='add' />Add New Cheque</Button>
            <Header as='h3' style={{alignSelf: 'flex-start'}}>Dashboard Summary { isLoading && <Loader active inline /> } </Header>
            <TableSummaries />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )

}

export default AppSidebar;