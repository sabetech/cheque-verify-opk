import * as api from './API';
interface Cheque {
  cheque_date: string,
  cheque_number: string,
  amount: number,
  cheque_date_due: string,
  image: File | null,
}

export function addNewCheque(cheque: Cheque, token: string) : Promise<any> {
  return api.post('/cheques', cheque, {'Authorization': token});
}

export function getCheques(token: string) : Promise<any> {
  return api.get('/cheques', {'Authorization': token}).then(response => response.data.data);
}

export function deleteCheque(chequeId: number, token: string) : Promise<any> {
  return api.deleteRequest('/cheques/'+chequeId, {'Authorization': token});
}

export function getChequeById(chequeId: number, token: string) : Promise<any> {
  return api.get('/cheques/'+chequeId, {'Authorization': token}).then(response => response.data.data);
}

export function editCheque(chequeId: Number, cheque: Cheque, token: string) : Promise<any> {
  return api.put('/cheques/'+chequeId, cheque, {'Authorization': token});
}

export function logout(token: string) {
  return api.post('/logout', {}, {'Authorization': token});
}


