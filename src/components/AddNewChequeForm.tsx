import { Button, Checkbox, Form } from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const AddNewChequeForm:React.FC = () => (
  <Form>
    <Form.Field>
      <label>Date Issued</label>
      <SemanticDatepicker  />
    </Form.Field>
    <Form.Field>
      <label>Cheque Serial Number</label>
      <input placeholder='XXXXXXXXX' />
    </Form.Field>
    <Form.Field>
      <label>Amount</label>
      <input placeholder='Last Name' />
    </Form.Field>
    <Form.Field>
      <label>Date Due</label>
      <input placeholder='select date' />
    </Form.Field>
    <Form.Field>
      <label>Upload Image of Cheque</label>
      <input placeholder='select date' />
    </Form.Field>
    <Form.Field>
    </Form.Field>
  </Form>
)

export default AddNewChequeForm;