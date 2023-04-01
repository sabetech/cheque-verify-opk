import React from 'react';
import { Button, Table, Image, Label } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import { getCheques } from '../services/ChequeApi';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Icon } from 'semantic-ui-react'


const TableSummaries: React.FC = () => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false)
    const [chequeId, setChequeId] = React.useState<number>(0);
    const headerRow = ["Date Created", "Cheque Number", "Amount (GHC)", "Status", "Date Due", "Saved By", "Image", "Actions"];
    const auth = useAuthHeader();
    const user = useAuthUser();
    const loggedInUser = user();

    const { isLoading, isError, data, error } = useQuery(['cheques'], () => getCheques(auth()));

    const onDelete = (id: number) => {
        setOpenDeleteModal(true);
        setChequeId(id);
    }

    const checkDate = (date: string) : boolean => {
        //check if the difference between today's date the date passed in is less than 7 days
        const today = new Date();
        const dateDue = new Date(date);
        const diffTime = Math.abs(dateDue.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 3;
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
                    data?.data?.map((row: any, i: number) => (
                        <Table.Row key={i} warning={checkDate(row.date_due)} >
                            <Table.Cell>{row.date_issued}</Table.Cell>
                            <Table.Cell>{row.serial_no}</Table.Cell>
                            <Table.Cell>{row.amount}</Table.Cell>
                            <Table.Cell>
                                {(checkDate(row.date_due) && 
                                    <>
                                        <Icon name='attention' />   
                                    </>)}
                                {row.status}
                            </Table.Cell>
                            <Table.Cell>{row.date_due}</Table.Cell>
                            <Table.Cell>{row.user.name}</Table.Cell>
                            <Table.Cell>
                                <Image 
                                src={`http://localhost:8000/storage/cheques/${row.img_url.substring(row.img_url.lastIndexOf("/"))}`} 
                                width={'100px'}
                                /></Table.Cell>
                            <Table.Cell> 
                                {
                                    (loggedInUser?.user.role == 'admin') && ( 
                                    <>
                                        <Button color='blue' >Edit</Button>
                                        <Button color='red' onClick={() => onDelete(row.id)} >Delete</Button>
                                    </>)
                                }
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Body>
            <ConfirmDeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} chequeId={chequeId}/>
        </Table>
    );
}

export default TableSummaries;