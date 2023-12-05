
import SubmissionsEdit from './SubmissionsEdit';
import SubmissionsList from './SubmissionsList';
import SubmissionsView from './SubmissionsView';

export default {
  list: SubmissionsList,
  edit: SubmissionsEdit,
  show: SubmissionsView,
  permissions: {
    canList: ["admin"],
    canEdit: ['admin']
  },
};
