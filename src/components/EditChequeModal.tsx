import React, { useEffect } from 'react';
import { Button, Label, Input, Image, Modal, Form, Dropdown } from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { SemanticDatepickerProps } from 'react-semantic-ui-datepickers/dist/types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getChequeById } from '../services/ChequeApi';
import { editCheque } from '../services/ChequeApi';
import { useAuthHeader } from 'react-auth-kit';
import { SERVER_URL } from '../services/API';
import chequeImage from '../assets/cheque-new.png'

interface AddNewChequeModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    chequeId: number;
}

interface Cheque {
    date_issued: string,
    serial_no: string,
    amount: number,
    date_due: string,
    status: string,
    image: File,
    img_url: string
}

const EditChequeModal: React.FC<AddNewChequeModalProps> = ({ open, setOpen, chequeId }): JSX.Element => {
    const [dateIssued, setDateIssued] = React.useState<Date | null>(null);
    const [serialNumber, setSerialNumber] = React.useState<string>('');
    const [amount, setAmount] = React.useState<number>(0);
    const [dateDue, setDateDue] = React.useState<Date | null>(null);
    const [status, setStatus] = React.useState<string>('');
    const [image, setImage] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const auth = useAuthHeader();
    const queryClient = useQueryClient();
    
    const { data } = useQuery<Cheque>({queryKey: ['cheques', chequeId], queryFn: () => getChequeById(chequeId, auth())})
    const { mutate } = useMutation({
      
        mutationFn: (values: Cheque) => editCheque(chequeId, values, auth()),
        onSuccess: newCheque => {
          queryClient.invalidateQueries('cheques');
          queryClient.setQueryData(['cheques'], (oldCheques: any) => oldCheques ? [...oldCheques, newCheque] : []);
          setOpen(false);
          setImage(null);
        }
    });

    useEffect(() => {

        if (data) {
            setDateIssued(new Date(data.date_issued));
            setSerialNumber(data.serial_no);
            setAmount(data.amount);
            setDateDue(new Date(data.date_due));
            setStatus(data.status);
            getFileFromImage(`${SERVER_URL}/storage/cheques/${data.img_url?.substring(data?.img_url.lastIndexOf("/"))}`)
        }

    },[data]);

    const getFileFromImage = async (imgUrl: string) => {
        await fetch(imgUrl)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                setImage(file)
            });
    }

    const onDateIssuedChanged = (event: React.SyntheticEvent<Element, Event> | undefined, data: SemanticDatepickerProps) => {
        setDateIssued(data.value as Date);
    }

    const onSerialNumberChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSerialNumber(event.target.value);
    }

    const onAmountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '' || event.target.value === '0')
            setAmount(0);
        else
            setAmount(parseInt(event.target.value));
    }

    const onDateDueChanged = (event: React.SyntheticEvent<Element, Event> | undefined, data: SemanticDatepickerProps) => {
        setDateDue(data.value as Date);
    }

    const onStatusChanged = (event: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
        setStatus(data.value);
    }

    const onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    }

    const onSubmit = () => {
        setOpen(false)
        if (!dateIssued) {
            alert('Date issued is required');
            return;
        }

        if (!serialNumber) {
            alert('Serial number is required');
            return;
        }

        if (!amount) {
            alert('Amount is required');
            return;
        }

        if (!dateDue) {
            alert('Date due is required');
            return;
        }

        if (!status) {
            alert('Status is required');
            return;
        }

        if (!image) {
            alert('Image is required');
            return;
        }

        const values = {
            date_issued: dateIssued.toISOString().split("T")[0],
            serial_no: serialNumber,
            amount: amount,
            date_due: dateDue.toISOString().split("T")[0],
            status: status,
            image: image,
        } as Cheque;

        console.log(values);
        mutate(values);

    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header> 
                Edit Cheque Information
            </Modal.Header>
            <Modal.Content image>
                <Image size='medium' src={chequeImage} wrapped />
                <Modal.Description> 
                    Edt the Cheque Information 
                    <Form style={{marginTop: '5%'}}>
                        <Form.Field>
                            <label>Date Issued</label>
                            <SemanticDatepicker onChange={onDateIssuedChanged} value={data && new Date(data.date_issued)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Cheque Serial Number</label>
                            <input placeholder='XXXXXXXXX' onChange={onSerialNumberChanged} value={serialNumber}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Amount</label>
                            <Input label type='text' placeholder='Amount'>
                                <Label basic>GHC</Label>
                                <input placeholder='Amount' onChange={onAmountChanged} value={amount} />
                            </Input>
                        </Form.Field>
                        <Form.Field>
                            <label>Date Due</label>
                            <SemanticDatepicker onChange={onDateDueChanged} value={data && new Date(data.date_due)}/>
                        </Form.Field>
                        <Form.Field>
                            Status: <Dropdown button labeled placeholder='Status' value={data?.status} options={['Pending', 'Canceled', 'Cleared', 'Overdue'].map((status) => ({ key: status, text: status, value: status }))} onClick={onStatusChanged}  />
                        </Form.Field>
                        <Form.Field>
                            <Button
                                content={  "Choose File"}
                                labelPosition="left"
                                icon="file"
                                onClick={() => fileInputRef?.current?.click()}
                            />
                            <label>{ image ? image.name : '' }</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                onChange={onFileChanged}
                                accept="image/*"
                            />
                            <Image 
                                src={`http://localhost:8000/storage/cheques/${data?.img_url?.substring(data?.img_url.lastIndexOf("/"))}`} 
                                width={'150px'}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Description>
                
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    content="Save"
                    labelPosition='right'
                    icon='checkmark'
                    positive
                    onClick={() => onSubmit()}
                />
            </Modal.Actions>
        </Modal>
    )
}

export default EditChequeModal