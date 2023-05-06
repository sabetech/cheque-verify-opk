import React from 'react';
import { Button, Table, Image, Label } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import { getCheques } from '../services/ChequeApi';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Icon } from 'semantic-ui-react'
import EditChequeModal from './EditChequeModal';
import ImageModal from './ImageModal';

interface TableSummariesProps {
    dateFilter: Date[];
    nameFilter: string;
}

const TableSummaries: React.FC<TableSummariesProps> = ({ dateFilter, nameFilter }) => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false)
    const [openEditModal, setOpenEditModal] = React.useState(false)
    const [chequeId, setChequeId] = React.useState<number>(0);
    const headerRow = ["Date Created", "Cheque Holder", "Cheque Number", "Amount (GHC)", "Status", "Date Due", "Saved By", "Image", "Actions"];
    const auth = useAuthHeader();
    const user = useAuthUser();
    const loggedInUser = user();
    const [tableData, setTableData] = React.useState<any>([]);
    const [selectedImage, setSelectedImage] = React.useState<string>('');
    const [openImageModal, setOpenImageModal] = React.useState(false);

    const { data } = useQuery(['cheques'], () => getCheques(auth()));

    React.useEffect(() => {

        if (data) {
            const newData = data.filter((item: any) => {
                if (dateFilter == null) return true;
                if (dateFilter.length === 0) return true;
                
                return (new Date(item.date_due).getTime() >= dateFilter[0].getTime() && 
                    new Date(item.date_due).getTime() <= dateFilter[1].getTime())
            })
            ?.filter((filtered: any) => {
                return filtered.cheque_holder_name?.toLowerCase().includes(nameFilter?.toLocaleLowerCase());
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
                const chequeHolder = d.cheque_holder_name;
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
                    chequeHolder,
                    img_url: image, 
                    id 
                }
            });
            setTableData(newData);
        }
    }, [data, dateFilter, nameFilter]);

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
        return diffDays < 2;
    }

    const checkDateOverDue = (date: string) : boolean => {
        const today = new Date();
        const dateDue = new Date(date);
        return dateDue.getTime() < today.getTime();
    }

    const checkDDay = (date: string) : boolean => {
        const today = new Date();
        const dateDue = new Date(date);
        const diffTime = Math.abs(dateDue.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 0;
    }

    function getLabelColor(status: string, date: string) {
        
        if (status.toString().toLowerCase() === 'pending') {
            if (checkDateOverDue(date)) return '#FF6647';
            if (checkDDay(date)) return '#FC7676';
            if (checkDate(date)) return '#ECB24C';
        }
        return 'white';
    }

    function getStatus(status: string, date: string){
        if (status.toString().toLowerCase() === 'pending' && checkDateOverDue(date)) return 'Overdue';
       
        return status;
    }

    const onImageClick = (url: string) => {
        setSelectedImage(url);
        setOpenImageModal(true);
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
                    tableData && tableData.map((row: any, i: number) => (
                        <Table.Row key={i} style={
                            {backgroundColor: (row.status != 'canceled' || row.status != 'cleared') && getLabelColor(row.status, row.actualDateDue)}
                        }>
                            <Table.Cell>{row.dateCreatedString}</Table.Cell>
                            <Table.Cell>{row.chequeHolder}</Table.Cell>
                            <Table.Cell>{row.chequeNumber}</Table.Cell>
                            <Table.Cell>{row.amount}</Table.Cell>
                            <Table.Cell>
                                {
                                (checkDate(row.actualDateDue) && row.status.toLowerCase() === 'pending') && (
                                    <>
                                        <Icon name='attention' />   
                                    </>)}
                                { getStatus(row.status, row.actualDateDue) }
                            </Table.Cell>
                            <Table.Cell>{row.dateDueString}</Table.Cell>
                            <Table.Cell>{row.savedBy}</Table.Cell>
                            <Table.Cell>
                                <Image 
                                src={row.img_url} 
                                width={'100px'}
                                style={{cursor: 'pointer'}}
                                onClick={() => onImageClick(row.img_url)}
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
            <ImageModal image={ selectedImage } isOpen={openImageModal} setOpen={setOpenImageModal} />
        </Table>
    );
}

export default TableSummaries;