import React, { useState } from 'react';
import { Button, Header,Icon, Menu, Segment, Sidebar, Grid } from 'semantic-ui-react'
import AddNewChequeModal from './AddNewChequeModal';
import TableSummaries from './TableSummaries';
import TopBar from './TopBar'
import { useQuery } from 'react-query';
import { Loader } from 'semantic-ui-react';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import SemanticDatepicker from "react-semantic-ui-datepickers";

const AppSidebar: React.FC = (props: any) => {
    const [open, setOpen] = useState<boolean>(false)
    const { isLoading } = useQuery(['cheques'])
    const user = useAuthUser();
    const loggedInUser = user();
    const navigate = useNavigate();
    const [dateFilter, setDateFilter] = useState<Date[]>([]);
    const showAddNewChequeModal = () => {
      setOpen((prev) => !prev);
    }

    const onDateRangeChange = (event: any, data: any) => {
      if (data.value.length == 2) {
        setDateFilter(data.value);
      }
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
              <Menu.Item as='a' >
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
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'baseline' }}>
              <Button size='big' style={{ alignSelf: 'flex-end', marginLeft:20, marginRight: 20 }} onClick={(e) => showAddNewChequeModal()}><Icon name='add' />Add New Cheque</Button>
              <SemanticDatepicker locale="en-US" onChange={onDateRangeChange} type="range" />  
            </div>
            <Header as='h3' style={{alignSelf: 'flex-start'}}>Dashboard Summary { isLoading && <Loader active inline /> } </Header>
            <TableSummaries dateFilter={dateFilter}/>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )

}

export default AppSidebar;