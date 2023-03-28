import React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { SemanticDatepickerProps } from 'react-semantic-ui-datepickers/dist/types';

interface AddNewChequeModalFormProps {
    setDateIssued: (date: Date) => void;
    setDateDue: (date: Date) => void;
    setSerialNumber: (serialNumber: string) => void;
    setAmount: (amount: string) => void;
    setImage: (image: File) => void;
    imageName: string;
}

const AddNewChequeForm:React.FC<AddNewChequeModalFormProps> = ({ setDateIssued, setDateDue, setSerialNumber, setAmount, setImage, imageName }) => {

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    const onDateIssuedChanged = (event: React.SyntheticEvent<Element, Event> | undefined, data: SemanticDatepickerProps) => {
        setDateIssued(data.value as Date);
    }

    const onDateDueChanged = (event: React.SyntheticEvent<Element, Event> | undefined, data: SemanticDatepickerProps) => {
        setDateDue(data.value as Date);
    }

    const onSerialNumberChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSerialNumber(event.target.value);
    }

    const onAmountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    }

    const onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    }

    return (
        <Form>
          <Form.Field>
            <label>Date Issued</label>
            <SemanticDatepicker onChange={onDateIssuedChanged} />
          </Form.Field>
          <Form.Field>
            <label>Cheque Serial Number</label>
            <input placeholder='XXXXXXXXX' onChange={onSerialNumberChanged} />
          </Form.Field>
          <Form.Field>
            <label>Amount</label>
            <input placeholder='Amount' onChange={onAmountChanged} />
          </Form.Field>
          <Form.Field>
            <label>Date Due</label>
            <SemanticDatepicker onChange={onDateDueChanged}/>
          </Form.Field>
          <Form.Field>
              <Button
                  content={  "Choose File"}
                  labelPosition="left"
                  icon="file"
                  onClick={() => fileInputRef?.current?.click()}
              />
              <label>{imageName}</label>
              <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={onFileChanged}
                  accept="image/*"
              />
          </Form.Field>
          <Form.Field>
          </Form.Field>
        </Form>
      )
}


export default AddNewChequeForm;