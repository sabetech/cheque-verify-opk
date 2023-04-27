import {useState} from "react";
import { Header, Button, Icon, Loader } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { useQuery } from 'react-query';
import { useAuthHeader } from 'react-auth-kit'; 
import TableSummaries from "../components/TableSummaries";
import { getCheques } from "../services/ChequeApi";
import AddNewChequeModal from "../components/AddNewChequeModal";

const Dashboard = () => {
    const auth = useAuthHeader();
    const { isLoading } = useQuery(['cheques'], () => getCheques(auth()));
    const [open, setOpen] = useState<boolean>(false)
    const [dateFilter, setDateFilter] = useState<Date[]>([]);
    const showAddNewChequeModal = () => {
      setOpen((prev) => !prev);
    }

    const onDateRangeChange = (event: any, data: any) => {
        if (!data.value) {
          setDateFilter([]);
          return;
        }
  
        if (data.value.length == 2) {
          setDateFilter(data.value);
        }
      }

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'baseline' }}>
              <Button size='big' style={{ alignSelf: 'flex-end', marginLeft:20, marginRight: 20 }} onClick={(e) => showAddNewChequeModal()}><Icon name='add' />Add New Cheque</Button>
              <SemanticDatepicker locale="en-US" onChange={onDateRangeChange} type="range" />  
            </div>
            <Header as='h3' style={{alignSelf: 'flex-start'}}>Dashboard Summary { isLoading && <Loader active inline /> } </Header>
            <TableSummaries dateFilter={dateFilter}/>
            <AddNewChequeModal setOpen={setOpen} open={open}/>
        </>
    );
}

export default Dashboard;