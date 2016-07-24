import usersAPI from './users/users-api'
import roleAPI from './role/role-api' // Tipos de usuario EJ: Administrador, Profesor, etc..
import levelAPI from './level/level-api' // Tipos de usuario EJ: Administrador, Profesor, etc..
import studentAPI from './student/student-api' // Tipos de usuario EJ: Administrador, Profesor, etc..
import parentAPI from './parent/parent-api' // Tipos de usuario EJ: Administrador, Profesor, etc..

const rulesAPI = [].concat(usersAPI, roleAPI, levelAPI, studentAPI, parentAPI);
export default rulesAPI;