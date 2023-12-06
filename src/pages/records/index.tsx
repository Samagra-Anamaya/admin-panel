
import RecordsList from './RecordsList'

export default {
  list: RecordsList,
  permissions: {
    canList: ["department"],
  },
  recordRepresentation: 'title',
};
