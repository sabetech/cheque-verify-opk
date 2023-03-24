import React, { useState } from 'react';
import { Button, Header,Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'
import AddNewChequeModal from './AddNewChequeModal';
import TableSummaries from './TableSummaries';
import TopBar from './TopBar'

const AppSidebar: React.FC = (props: any) => {
    const [open, setOpen] = useState<boolean>(false)
    
    const showAddNewChequeModal = () => {
      console.log('showAddNewChequeModal', open)  
      setOpen((prev) => !prev);
    }

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
          <Menu.Item as='a' >
            <Icon name='add' />
            Add New Cheque
          </Menu.Item>
        </Sidebar>
        <AddNewChequeModal open={open} setOpen={setOpen}/>
        <Sidebar.Pusher>
          <Segment basic>
          <TopBar />
            <Button size='big' style={{ alignSelf: 'flex-end' }} onClick={(e) => showAddNewChequeModal()}><Icon name='add' />Add New Cheque</Button>
            <Header as='h3' style={{alignSelf: 'flex-start'}}>Dashboard Summary</Header>
            <TableSummaries />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )

}

export default AppSidebar;