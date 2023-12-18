
import SchemesCreate from './SchemesCreate';
import SchemesList from './SchemesList'
import SchemesShow from './SchemesView';

export default {
  list: SchemesList,
  create: SchemesCreate,
  show: SchemesShow,
  permissions: {
    canList: ["department"],
    canCreate: ['department']
  },
  recordRepresentation: 'title',
};
