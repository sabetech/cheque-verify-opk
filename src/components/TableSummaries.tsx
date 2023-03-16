import { Button, Table } from 'semantic-ui-react';

const TableSummaries: React.FC = () => {
    const headerRow = ["Date Created", "Cheque Number", "Amount (GHC)", "Status", "Date Due", "Saved By", "Actions"];
    const tableData = [
        {date_created: '2021-01-01', chequeNumber: '123456', amount: '1000', status: 'Pending',dueDate: '2023-03-22', savedBY: 'Samuel Banini'},
    ];

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
                    tableData.map((data, i) => (
                        <Table.Row key={i}>
                            <Table.Cell>{data.date_created}</Table.Cell>
                            <Table.Cell>{data.chequeNumber}</Table.Cell>
                            <Table.Cell>{data.amount}</Table.Cell>
                            <Table.Cell>{data.status}</Table.Cell>
                            <Table.Cell>{data.dueDate}</Table.Cell>
                            <Table.Cell>{data.savedBY}</Table.Cell>
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