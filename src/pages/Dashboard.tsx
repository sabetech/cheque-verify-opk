import {SyntheticEvent, useState} from "react";
import { Header, Button, Icon, Loader, Input } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { useQuery } from 'react-query';
import { useAuthHeader } from 'react-auth-kit'; 
import TableSummaries from "../components/TableSummaries";
import { getCheques } from "../services/ChequeApi";
import AddNewChequeModal from "../components/AddNewChequeModal";
import { debounce } from 'lodash';

const Dashboard = () => {
    const auth = useAuthHeader();
    const { isLoading } = useQuery(['cheques'], () => getCheques(auth()));
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState<boolean>(false)
    const [dateFilter, setDateFilter] = useState<Date[]>([]);
    const [nameFilter, setNameFilter] = useState<string>("");

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

      const search = debounce((value) => {
        setNameFilter(value)
        setLoading(false)
    }, 500);

      const searchChequeHolder = (e: any) => {
        setLoading(true);
        search(e.target.value)
      }

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'baseline' }}>
              <Button size='big' style={{ alignSelf: 'flex-end', marginLeft:20, marginRight: 20 }} onClick={(e) => showAddNewChequeModal()}><Icon name='add' />Add New Cheque</Button>
              <SemanticDatepicker onChange={onDateRangeChange} type="range" size={"big"} />  
              <Input loading={loading} icon='user' placeholder='Search...' style={{marginLeft: 20}} onChange={searchChequeHolder}/>
            </div>
            <Header as='h3' style={{alignSelf: 'flex-start'}}>Dashboard Summary { isLoading && <Loader active inline /> } </Header>
            <TableSummaries dateFilter={dateFilter} nameFilter={nameFilter}/>
            <AddNewChequeModal setOpen={setOpen} open={open}/>
        </>
    );
}

export default Dashboard;