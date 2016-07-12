import usersAPI from './users/users-api'
import roleAPI from './role/role-api' // Tipos de usuario EJ: Administrador, Profesor, etc..

const rulesAPI = [].concat(usersAPI, roleAPI);
export default rulesAPI;