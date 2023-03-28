import * as api from './API';
interface Cheque {
  cheque_date: string,
  cheque_number: string,
  amount: number,
  cheque_due_date: string,
  image: File | null,
}

export function addNewCheque(cheque: Cheque) {
  return api.post('/cheques', cheque);
}

export function getCheques() {
  return api.get('/cheques');
}


