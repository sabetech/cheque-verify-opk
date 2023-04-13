import * as api from './API';
interface User {
  name: string,
  email: string | undefined,
  password: string | undefined,
  role?: string,
}

export function addNewUser(user: User, token: string) : Promise<any> {
  return api.post('/users', user, {'Authorization': token});
}

export function getUsers(token: string) : Promise<any> {
  return api.get('/users', {'Authorization': token}).then(response => response.data.data);
}

export function deleteUser(userId: number, token: string) : Promise<any> {
  return api.deleteRequest('/users/'+userId, {'Authorization': token});
}

export function editUser(userId: Number, user: User, token: string) : Promise<any> {
  return api.put('/users/'+userId, user, {'Authorization': token});
}

