import { Button, Table, Image } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import { getCheques } from '../services/ChequeApi';
import { useAuthHeader } from 'react-auth-kit';


const TableSummaries: React.FC = () => {
    const headerRow = ["Date Created", "Cheque Number", "Amount (GHC)", "Status", "Date Due", "Saved By", "Image", "Actions"];
    const auth = useAuthHeader();

    const { isLoading, isError, data, error } = useQuery('cheques', () => getCheques(auth()));

    return (
        <Table
            celled
            style={{width: '90%'}}
        >
            <Table.Header>
                <Table.Row>
                    { 
                        headerRow.map((header, i) => (
                            <Table.HeaderCell key={i} >{header}</Table.HeaderCell>
                        ))
                    }
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    data?.data?.map((row: any, i: number) => (
                        <Table.Row key={i}>
                            <Table.Cell>{row.date_issued}</Table.Cell>
                            <Table.Cell>{row.serial_no}</Table.Cell>
                            <Table.Cell>{row.amount}</Table.Cell>
                            <Table.Cell>{row.status}</Table.Cell>
                            <Table.Cell>{row.date_due}</Table.Cell>
                            <Table.Cell>{row.user.name}</Table.Cell>
                            <Table.Cell><Image 
                                src={`http://localhost:8000/storage/cheques/${row.img_url.substring(row.img_url.lastIndexOf("/"))}`} 
                                width={'100px'}
                                /></Table.Cell>
                            <Table.Cell>
                                <Button color='blue'>Edit</Button>
                                <Button color='red'>Delete</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Body>

        </Table>
    );
}

export default TableSummaries;