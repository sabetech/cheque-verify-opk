import React from 'react';
import { Button, Table, Image, Label } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import { getCheques } from '../services/ChequeApi';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Icon } from 'semantic-ui-react'
import EditChequeModal from './EditChequeModal';
import { SERVER_URL } from '../services/API';

interface TableSummariesProps {
    dateFilter: Date[];
}

const TableSummaries: React.FC<TableSummariesProps> = ({ dateFilter }) => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false)
    const [openEditModal, setOpenEditModal] = React.useState(false)
    const [chequeId, setChequeId] = React.useState<number>(0);
    const headerRow = ["Date Created", "Cheque Number", "Amount (GHC)", "Status", "Date Due", "Saved By", "Image", "Actions"];
    const auth = useAuthHeader();
    const user = useAuthUser();
    const loggedInUser = user();
    const [tableData, setTableData] = React.useState<any>([]);

    const { data } = useQuery(['cheques'], () => getCheques(auth()));

    React.useEffect(() => {

        if (data) {
            const newData = data.filter((item: any) => {
                if (dateFilter == null) return true;
                if (dateFilter.length === 0) return true;
                
                return new Date(item.date_due).getTime() >= dateFilter[0].getTime() && 
                    new Date(item.date_due).getTime() <= dateFilter[1].getTime();
            })
            ?.sort((a:any, b:any) => 
            new Date(a.date_due).getTime() - new Date(b.date_due).getTime())
            ?.map((d: any) => {
                const date_due = new Date(d.date_due);
                const date_issued = new Date(d.date_issued);
                const dateDueString = date_due.toLocaleDateString();
                const dateCreatedString = date_issued.toLocaleDateString();
                const savedBy = d?.user?.name;
                const status = d.status;
                const amount = d.amount;
                const chequeNumber = d.serial_no;
                const image = d.img_url;
                const id = d.id;
                return { 
                    actualDateIssued: d.date_issued,
                    actualDateDue: d.date_due,
                    dateDueString,
                    dateCreatedString,
                    savedBy, 
                    status, 
                    amount, 
                    chequeNumber, 
                    img_url: image, 
                    id 
                }
            });
            setTableData(newData);
        }
    }, [data, dateFilter]);

    const onDelete = (id: number) => {
        setOpenDeleteModal(true);
        setChequeId(id);
    }

    const onEdit = (id: number) => {
        setOpenEditModal(true);
        setChequeId(id);
    }

    const checkDate = (date: string) : boolean => {
        const today = new Date();
        const dateDue = new Date(date);
        const diffTime = Math.abs(dateDue.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 3;
    }

    const checkDateOverDue = (date: string) : boolean => {
        const today = new Date();
        const dateDue = new Date(date);
        return dateDue.getTime() < today.getTime();
    }

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
                    tableData.map((row: any, i: number) => (
                        <Table.Row key={i} warning={checkDate(row.actualDateDue)} negative={false}>
                            <Table.Cell>{row.dateCreatedString}</Table.Cell>
                            <Table.Cell>{row.chequeNumber}</Table.Cell>
                            <Table.Cell>{row.amount}</Table.Cell>
                            <Table.Cell>
                                {
                                (checkDate(row.actualDateDue) && 
                                    <>
                                        <Icon name='attention' />   
                                    </>)}
                                {row.status}
                            </Table.Cell>
                            <Table.Cell>{row.dateDueString}</Table.Cell>
                            <Table.Cell>{row.savedBy}</Table.Cell>
                            <Table.Cell>
                                <Image 
                                src={`${SERVER_URL}/storage/cheques/${row.img_url?.substring(row?.img_url.lastIndexOf("/") + 1)}`} 
                                width={'100px'}
                                /></Table.Cell>
                            <Table.Cell> 
                                {
                                    (loggedInUser?.user.role == 'admin') && ( 
                                    <>
                                        <Button color='blue' onClick={() => onEdit(row.id)} >Edit</Button>
                                        <Button color='red' onClick={() => onDelete(row.id)} >Delete</Button>
                                    </>)
                                }
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Body>
            <ConfirmDeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} chequeId={chequeId} />
            {chequeId > 0 && <EditChequeModal open={openEditModal} setOpen={setOpenEditModal} chequeId={chequeId} />}
        </Table>
    );
}

export default TableSummaries;