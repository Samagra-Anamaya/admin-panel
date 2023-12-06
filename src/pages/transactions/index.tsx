
import TransactionsList from './TransactionsList';
import TransactionsView from './TransactionsView';

export default {
  list: TransactionsList,
  show: TransactionsView,
  permissions: {
    canList: ["department"],
  },
  recordRepresentation: 'title',
};
