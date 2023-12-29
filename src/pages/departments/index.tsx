
import DepartmentsCreate from './DepartmentsCreate';
import DepartmentsList from './DepartmentsList'
import DepartmentsView from './DepartmentsView';

export default {
  list: DepartmentsList,
  show: DepartmentsView,
  create: DepartmentsCreate,
  permissions: {
    // canList: ["super_admin_department"],
    canList: ["super_admin_department"],
    canView: ["super_admin_department"],
    canCreate: ["super_admin_department"]
  },
  recordRepresentation: 'title',
};
