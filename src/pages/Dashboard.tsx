import {useEffect, useState } from "react";
import { Header, Button, Icon, Loader, Input, Message } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { useQuery } from 'react-query';
import { useAuthHeader } from 'react-auth-kit'; 
import TableSummaries from "../components/TableSummaries";
import { getCheques } from "../services/ChequeApi";
import AddNewChequeModal from "../components/AddNewChequeModal";
import { debounce } from 'lodash';

interface Data {
  message: string,
  success: boolean
}

const Dashboard = () => {
    const auth = useAuthHeader();
    const { isLoading } = useQuery(['cheques'], () => getCheques(auth()));
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState<boolean>(false)
    const [dateFilter, setDateFilter] = useState<Date[]>([]);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [response, setResponse] = useState<Data | null>(null);

    useEffect(() => {

      if (response) {
        setShowMessage(true)
        setTimeout(() => {  
          setShowMessage(false)
          setResponse(null)
        }, 6000)
      }

    }, [response]);

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

      const print = () => {

        console.log(tableRef.current);
        const tableToPrint = document.getElementById("table-to-print");
        
        if (tableToPrint) {
          const newWin = window.open("", "", "height=1000,width=1000");
          newWin?.document.write(tableToPrint.outerHTML);
          newWin?.print();
          // newWin?.close();
        }
        
      }

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'baseline' }}>
              <Button size='big' style={{ alignSelf: 'flex-end', marginLeft:20, marginRight: 20 }} onClick={(e) => showAddNewChequeModal()}><Icon name='add' />Add New Cheque</Button>
              <SemanticDatepicker onChange={onDateRangeChange} type="range" size={"big"} />  
              <Input loading={loading} icon='user' placeholder='Search...' style={{marginLeft: 20}} onChange={searchChequeHolder}/>
            </div>
            <Header as='h3' style={{alignSelf: 'flex-start'}}>Dashboard Summary { isLoading && <Loader active inline /> } </Header>
            <Button size='big' onClick={print}>Print</Button>
            { 
            showMessage &&
              <Message size='big' style={{width: '90%'}} color={ response?.success ? "olive":"red" }  >
                <Message.Header>Notification</Message.Header>
                <p>
                  { response?.message }
                </p>
              </Message>
            }
            <TableSummaries dateFilter={dateFilter} nameFilter={nameFilter} />

            <AddNewChequeModal setOpen={setOpen} open={open} setResponse={setResponse} />
        </>
    );
}

export default Dashboard;