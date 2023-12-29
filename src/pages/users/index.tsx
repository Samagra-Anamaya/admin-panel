
import UsersList from './UsersList';
import UsersCreate from './UsersCreate'
import UsersView from './UsersView';

export default {
  list: UsersList,
  show: UsersView,
  create: UsersCreate,
  permissions: {
    // canList: ["super_admin_department"],
    canList: ["super_admin_department"],
    canView: ["super_admin_department"],
    canCreate: ["super_admin_department"]
  },
  recordRepresentation: 'title',
};
