import React from 'react';
import moment from 'moment';
import { Alert, Button, DatePicker, Input, InputNumber, Modal, Pagination, Radio, Select, Skeleton, Switch, Table, Tag, Tooltip, message } from 'antd';
import { Bell, CalendarDays, ChevronRight, Download, FileText, Plus, Receipt, RefreshCw, Repeat, Search, ShieldCheck, SlidersHorizontal, Wallet } from 'lucide-react';
import ExpenseService from '@services/ExpenseService';
import ExpenseForm from './ExpenseForm';
import { businessToday, commitmentFrequencies, commitmentRows as selectCommitmentRows, duplicateDetails, entity, errorText, expenseLocation, expenseLocations, expenseMoney, frequencies, loadSnapshot, periodRows } from './model';
import './expense.css';

const unavailable = 'This information is not available yet.';
const summaryReasonText = {
  COMMITMENT_DATA_UNAVAILABLE: 'Commitment schedule data is not connected.',
  BILL_SCHEDULE_DATA_UNAVAILABLE: 'Scheduled bill data is not connected.',
  PAYMENT_RECONCILIATION_DATA_UNAVAILABLE: 'Payment reconciliation data is not connected.',
  SCHEDULER_CONFIG_UNAVAILABLE: 'No automatic generation settings have been saved.'
};
const tabs = [
  { key: 'all', label: 'All Expenses', icon: Receipt },
  { key: 'drawers', label: 'Cash Drawers', icon: Wallet, style: { display: 'none' } },
  { key: 'approval', label: 'Needs Approval', icon: ShieldCheck },
  { key: 'recurring', label: 'Monthly Bills & Rent', icon: Repeat },
  { key: 'audit', label: 'Petty Cash Audit', icon: FileText, style: { display: 'none' } }
];

function PendingButton({ children, reason, ...props }) {
  return <Tooltip title={reason}><span className="expense-disabled-action"><Button disabled {...props}>{children}</Button></span></Tooltip>;
}

function summaryAmountText(items, amountField = 'amount') {
  if (!Array.isArray(items) || !items.length) return [];
  return items.map(item => {
    const amount = Number(item[amountField]);
    const formatted = Number.isFinite(amount) ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : 'Amount unavailable';
    const currency = item.currency || {};
    const money = currency.symbol ? `${currency.symbol}${formatted}` : `${currency.code ? `${currency.code} ` : ''}${formatted}`;
    return `${money}${currency.code ? ` ${currency.code}` : ''}`;
  });
}

function responseRows(response, label) {
  const body = response && response.data;
  const rows = Array.isArray(body) ? body : body && Array.isArray(body.data) ? body.data : null;
  if (!rows || rows.some(row => !row || typeof row.id !== 'string')) throw new Error(`${label} could not be read.`);
  return rows;
}

function expenseTabFromSearch(search) {
  const requestedTab = new URLSearchParams(search || '').get('tab');
  return ['all', 'approval', 'recurring'].includes(requestedTab) ? requestedTab : 'recurring';
}

export default class ExpensePage extends React.Component {
  state = {
    records: [], loading: false, loadError: '', payments: [], paymentListLoading: false, paymentListError: '', summary: null, summaryLoading: false, summaryError: '',
    commitments: [], commitmentLoading: false, commitmentError: '', currencyChoices: [],
    approvalBills: [], approvalBillsLoading: false, approvalBillsError: '', billActionId: '',
    month: businessToday().startOf('month'), tab: 'recurring', search: '', query: '', locationId: '', current: 1,
    payModalOpen: false, payableLoading: false, payableError: '', payableBills: [], payableBillId: '', payAmount: null,
    paymentSaving: false, paymentError: '', pendingReconciliation: null,
    generationModalOpen: false, generationSettingsLoading: false, generationSettingsSaving: false,
    generationSettingsError: '', generationDraft: { enabled: false, draftLeadDays: 0, timezone: 'Asia/Phnom_Penh' },
    editor: null, saving: false, saveError: '', duplicate: null, duplicateId: '',
    expenseActionId: '', detail: null, detailLoading: false, detailError: '', calendar: false
  };
  constructor(props) {
    super(props);
    this.state = { ...this.state, tab: expenseTabFromSearch(props.location && props.location.search) };
  }
  request = 0;
  summaryRequest = 0;
  detailRequest = 0;
  payableRequest = 0;
  paymentListRequest = 0;
  approvalBillsRequest = 0;
  componentDidMount() { this.load(); this.loadCommitments(); this.loadReconciledPayments(); this.loadApprovalBills(); this.loadSummary(); }
  componentDidUpdate(prevProps) {
    const previousSearch = prevProps.location && prevProps.location.search;
    const currentSearch = this.props.location && this.props.location.search;
    if (previousSearch === currentSearch) return;
    const tab = expenseTabFromSearch(currentSearch);
    if (tab !== this.state.tab) {
      this.setState({ tab, current: 1 });
      if (tab === 'approval') this.loadApprovalBills();
    }
  }
  componentWillUnmount() { this.unmounted = true; this.request++; this.summaryRequest++; this.detailRequest++; this.payableRequest++; this.paymentListRequest++; this.approvalBillsRequest++; clearTimeout(this.searchTimer); }

  changeTab = tab => {
    if (!['all', 'approval', 'recurring'].includes(tab)) return;
    this.setState({ tab, current: 1 });
    if (tab === 'approval') this.loadApprovalBills();
    const { history, location } = this.props;
    if (history && location) {
      const params = new URLSearchParams(location.search || '');
      params.set('tab', tab);
      history.push({ pathname: location.pathname, search: params.toString() });
    }
  };

  loadSummary = async (month = this.state.month, locationId = this.state.locationId) => {
    const request = ++this.summaryRequest;
    const monthKey = moment.isMoment(month) ? month.format('YYYY-MM') : String(month);
    this.setState({ summary: null, summaryLoading: true, summaryError: '' });
    try {
      const response = await ExpenseService.summary({ month: monthKey, locationId });
      const body = response && response.data;
      const summary = body && body.data && body.data.cards ? body.data : body;
      if (!summary || !summary.cards || !summary.period || summary.period.month !== monthKey) {
        throw new Error('The expense summary response could not be read.');
      }
      if (!this.unmounted && request === this.summaryRequest) this.setState({ summary, summaryLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.summaryRequest) this.setState({
        summary: null,
        summaryLoading: false,
        summaryError: errorText(error, 'Unable to load expense summary.')
      });
    }
  };

  changeMonth = month => {
    if (!month) return;
    const selectedMonth = month.clone().startOf('month');
    this.setState({ month: selectedMonth, current: 1 }, () => {
      this.loadSummary(selectedMonth);
      this.loadReconciledPayments(selectedMonth);
    });
  };

  load = async () => {
    const request = ++this.request;
    this.setState({ loading: true, loadError: '', records: [] });
    try {
      const records = await loadSnapshot(options => ExpenseService.get(options), () => !this.unmounted && request === this.request);
      if (records && !this.unmounted && request === this.request) this.setState(state => ({
        records, loading: false, current: 1,
        locationId: expenseLocations([...records, ...state.payments]).some(location => location.id === state.locationId) ? state.locationId : ''
      }));
    } catch (error) {
      if (!this.unmounted && request === this.request) this.setState({ records: [], loading: false, loadError: errorText(error, 'Unable to load expenses.') });
    }
  };

  loadCommitments = async () => {
    this.setState({ commitmentLoading: true, commitmentError: '' });
    try {
      const response = await ExpenseService.commitments();
      const commitments = responseRows(response, 'Recurring commitments');
      const optionalSnapshot = promise => promise.then(value => ({ value })).catch(() => ({ value: [] }));
      const currencyResult = await optionalSnapshot(loadSnapshot(options => ExpenseService.currencies(options), () => !this.unmounted));
      if (!this.unmounted) this.setState({
        commitments, commitmentLoading: false,
        currencyChoices: currencyResult.value || []
      });
    } catch (error) {
      if (!this.unmounted) this.setState({ commitments: [], commitmentLoading: false, commitmentError: errorText(error, 'Unable to load recurring commitments.') });
    }
  };

  loadReconciledPayments = async (month = this.state.month, locationId = this.state.locationId) => {
    const request = ++this.paymentListRequest;
    const monthKey = moment.isMoment(month) ? month.format('YYYY-MM') : String(month);
    this.setState({ paymentListLoading: true, paymentListError: '' });
    try {
      const payments = await loadSnapshot(options => ExpenseService.reconciledPaymentAllocations({ ...options, month: monthKey, locationId }), () => !this.unmounted && request === this.paymentListRequest);
      if (!this.unmounted && request === this.paymentListRequest) this.setState({ payments: payments || [], paymentListLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.paymentListRequest) this.setState({ payments: [], paymentListLoading: false, paymentListError: errorText(error, 'Unable to load reconciled bill payments.') });
    }
  };

  loadApprovalBills = async (locationId = this.state.locationId) => {
    const request = ++this.approvalBillsRequest;
    this.setState({ approvalBillsLoading: true, approvalBillsError: '' });
    try {
      const response = await ExpenseService.bills({ status: 'draft', locationId });
      const bills = responseRows(response, 'Bills awaiting approval');
      if (!this.unmounted && request === this.approvalBillsRequest) this.setState({ approvalBills: bills, approvalBillsLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.approvalBillsRequest) this.setState({ approvalBills: [], approvalBillsLoading: false, approvalBillsError: errorText(error, 'Unable to load bills awaiting approval.') });
    }
  };

  confirmBillStatus = (bill, status) => {
    const approving = status === 'approved';
    Modal.confirm({
      title: approving ? 'Approve generated bill?' : 'Void generated bill?',
      content: `${bill.name || 'Recurring bill'} · ${expenseMoney(bill).amount}${approving ? ' will become payable.' : ' will be removed from active obligations.'}`,
      okText: approving ? 'Approve bill' : 'Void bill',
      okType: approving ? 'primary' : 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        if (this.state.billActionId) return;
        this.setState({ billActionId: bill.id });
        try {
          const updated = entity(await ExpenseService.updateBillStatus({ id: bill.id, status }));
          if (updated.id !== bill.id || updated.status !== status) throw new Error('The bill status change could not be confirmed.');
          if (!this.unmounted) this.setState({ billActionId: '' });
          message.success(approving ? 'Bill approved.' : 'Bill voided.');
          this.loadApprovalBills();
          this.loadSummary();
        } catch (error) {
          if (!this.unmounted) this.setState({ billActionId: '' });
          message.error(errorText(error, 'Unable to update this bill.'));
          throw error;
        }
      }
    });
  };

  search = event => {
    const search = event.target.value;
    clearTimeout(this.searchTimer);
    this.setState({ search });
    this.searchTimer = setTimeout(() => this.setState({ query: search, current: 1 }), 300);
  };

  changeLocation = locationId => this.setState({ locationId, current: 1 }, () => {
    this.loadSummary(this.state.month, locationId);
    this.loadReconciledPayments(this.state.month, locationId);
    this.loadApprovalBills(locationId);
  });

  openGenerationSettings = async () => {
    this.setState({ generationModalOpen: true, generationSettingsLoading: true, generationSettingsError: '' });
    try {
      const response = await ExpenseService.generationSettings();
      const body = response && response.data;
      const settings = Array.isArray(body) ? body : body && Array.isArray(body.data) ? body.data : null;
      if (!settings) throw new Error('Generation settings could not be read.');
      const locationId = this.state.locationId;
      const exact = settings.find(row => String(row.locationId == null ? '' : row.locationId) === String(locationId || ''));
      const global = settings.find(row => row.locationId == null);
      const setting = exact || (locationId ? global : null);
      if (!this.unmounted) this.setState({
        generationSettingsLoading: false,
        generationDraft: {
          enabled: Boolean(setting && setting.enabled),
          draftLeadDays: Number(setting && setting.draftLeadDays) || 0,
          timezone: setting && setting.timezone || 'Asia/Phnom_Penh'
        }
      });
    } catch (error) {
      if (!this.unmounted) this.setState({ generationSettingsLoading: false, generationSettingsError: errorText(error, 'Unable to load generation settings.') });
    }
  };

  saveGenerationSettings = async () => {
    const { enabled, draftLeadDays, timezone } = this.state.generationDraft;
    if (!Number.isInteger(Number(draftLeadDays)) || Number(draftLeadDays) < 0 || Number(draftLeadDays) > 365) {
      this.setState({ generationSettingsError: 'Draft lead time must be between 0 and 365 days.' });
      return;
    }
    this.setState({ generationSettingsSaving: true, generationSettingsError: '' });
    try {
      await ExpenseService.saveGenerationSettings({
        locationId: this.state.locationId || null,
        enabled: Boolean(enabled),
        draftLeadDays: Number(draftLeadDays),
        timezone: timezone || null
      });
      this.setState({ generationSettingsSaving: false, generationModalOpen: false });
      message.success('Generation preferences saved.');
      this.loadSummary();
    } catch (error) {
      this.setState({ generationSettingsSaving: false, generationSettingsError: errorText(error, 'Unable to save generation settings.') });
    }
  };

  openPaymentModal = async () => {
    const request = ++this.payableRequest;
    this.setState({ payModalOpen: true, payableLoading: true, payableError: '', paymentError: '' });
    try {
      const response = await ExpenseService.payableBills({ locationId: this.state.locationId });
      const bills = responseRows(response, 'Payable bills').filter(row => Number(row.outstandingAmount) > 0);
      const selected = bills[0];
      if (!this.unmounted && request === this.payableRequest) this.setState({
        payableBills: bills,
        payableBillId: selected ? selected.id : '',
        payAmount: selected ? Number(selected.outstandingAmount) : null,
        payableLoading: false
      });
    } catch (error) {
      if (!this.unmounted && request === this.payableRequest) this.setState({ payableBills: [], payableLoading: false, payableError: errorText(error, 'Unable to load payable bills.') });
    }
  };

  selectPayableBill = id => {
    const bill = this.state.payableBills.find(row => row.id === id);
    this.setState({ payableBillId: id, payAmount: bill ? Number(bill.outstandingAmount) : null, paymentError: '' });
  };

  reconcilePendingPayment = async pending => {
    if (!pending || this.paymentSaving) return;
    this.paymentSaving = true;
    this.setState({ paymentSaving: true, paymentError: '' });
    try {
      const response = await ExpenseService.reconcilePayment({
        id: pending.id,
        allocations: [{ allocationId: pending.allocationId, reconciledAmount: pending.amount }]
      });
      const reconciled = entity(response);
      if (reconciled.id !== pending.id) throw new Error('The payment reconciliation could not be confirmed.');
      if (!this.unmounted) this.setState({ paymentSaving: false, payModalOpen: false, pendingReconciliation: null });
      message.success('Payment recorded and reconciled.');
      if (!this.unmounted) {
        this.loadSummary();
        this.loadReconciledPayments();
      }
    } catch (error) {
      if (!this.unmounted) this.setState({ paymentSaving: false, paymentError: `Payment ${pending.id} was recorded but is not reconciled. Retry reconciliation; do not create another payment. ${errorText(error, 'Reconciliation failed.')}` });
    } finally {
      this.paymentSaving = false;
    }
  };

  submitBillPayment = async () => {
    if (this.state.pendingReconciliation) return this.reconcilePendingPayment(this.state.pendingReconciliation);
    if (this.paymentSaving) return;
    const bill = this.state.payableBills.find(row => row.id === this.state.payableBillId);
    const amount = Number(this.state.payAmount);
    const outstanding = bill && Number(bill.outstandingAmount);
    if (!bill || !Number.isFinite(amount) || amount <= 0 || amount > outstanding + 0.00005) {
      this.setState({ paymentError: 'Enter a payment amount greater than zero and no more than the bill balance.' });
      return;
    }
    this.paymentSaving = true;
    this.setState({ paymentSaving: true, paymentError: '' });
    try {
      const payload = {
        currencyId: bill.currencyId,
        amount,
        allocations: [{ billId: bill.id, amount }]
      };
      if (bill.locationId != null) payload.locationId = bill.locationId;
      const payment = entity(await ExpenseService.recordPayment(payload));
      const allocation = Array.isArray(payment.allocations) && payment.allocations[0];
      if (!allocation || typeof allocation.id !== 'string') throw new Error(`Payment ${payment.id} was created, but its allocation could not be confirmed. Refresh before retrying.`);
      const pending = { id: payment.id, allocationId: allocation.id, amount: amount.toFixed(4) };
      if (!this.unmounted) this.setState({ pendingReconciliation: pending, paymentSaving: false });
      this.paymentSaving = false;
      return this.reconcilePendingPayment(pending);
    } catch (error) {
      if (!this.unmounted) this.setState({ paymentSaving: false, paymentError: errorText(error, 'Unable to record payment.') });
    } finally {
      this.paymentSaving = false;
    }
  };

  openDetail = async row => {
    const request = ++this.detailRequest;
    if (row.accountingCommitment || row.accountingPayment) {
      this.setState({ detail: row, detailLoading: false, detailError: '' });
      return;
    }
    this.setState({ detail: row, detailLoading: true, detailError: '' });
    try {
      const detail = entity(await ExpenseService.getById(row.id));
      if (detail.id !== row.id) throw new Error('This expense could not be confirmed.');
      if (!this.unmounted && request === this.detailRequest) this.setState({ detail, detailLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.detailRequest) this.setState({ detailLoading: false, detailError: errorText(error, 'Unable to load this expense.') });
    }
  };

  openExpenseAction = async (row, action) => {
    if (row.accountingPayment || row.accountingCommitment || Number(row.isSystem) === 1 || this.expenseActionPending) return;
    this.expenseActionPending = true;
    this.setState({ expenseActionId: row.id });
    try {
      const detail = entity(await ExpenseService.getById(row.id));
      if (detail.id !== row.id) throw new Error('This expense could not be confirmed.');
      if (Number(detail.isSystem) === 1) throw new Error('System expense records cannot be edited or deleted.');
      if (this.unmounted) return;
      if (action === 'edit') this.setState({ editor: detail, saveError: '', duplicate: null });
      else Modal.confirm({
        title: 'Delete expense?',
        content: `Delete "${detail.name || 'Untitled expense'}"? This cannot be undone.`,
        okText: 'Delete expense', okType: 'danger', cancelText: 'Cancel',
        onOk: () => this.deleteExpense(detail)
      });
    } catch (error) {
      if (!this.unmounted) message.error(errorText(error, 'Unable to load this expense.'));
    } finally {
      this.expenseActionPending = false;
      if (!this.unmounted) this.setState({ expenseActionId: '' });
    }
  };

  disableCommitment = row => {
    if (!row.accountingCommitment || row.status !== 'active' || this.expenseActionPending) return;
    Modal.confirm({
      title: 'Disable recurring bill?',
      content: `Pause "${row.name || 'Untitled commitment'}"? It will stop being treated as an active commitment.`,
      okText: 'Disable', cancelText: 'Cancel',
      onOk: async () => {
        this.expenseActionPending = true;
        this.setState({ expenseActionId: row.id });
        try {
          const saved = entity(await ExpenseService.updateCommitment({ id: row.id, status: 'paused' }));
          if (saved.id !== row.id || saved.status !== 'paused') throw new Error('The commitment disable could not be confirmed. Refresh before retrying.');
          if (this.unmounted) return;
          message.success('Recurring commitment disabled.');
          await Promise.all([this.loadCommitments(), this.loadSummary()]);
        } catch (error) {
          if (!this.unmounted) message.error(errorText(error, 'Unable to disable this recurring commitment.'));
        } finally {
          this.expenseActionPending = false;
          if (!this.unmounted) this.setState({ expenseActionId: '' });
        }
      }
    });
  };

  enableCommitment = row => {
    if (!row.accountingCommitment || row.status !== 'paused' || this.expenseActionPending) return;
    Modal.confirm({
      title: 'Enable recurring bill?',
      content: `Resume "${row.name || 'Untitled commitment'}" as an active commitment?`,
      okText: 'Enable', cancelText: 'Cancel',
      onOk: async () => {
        this.expenseActionPending = true;
        this.setState({ expenseActionId: row.id });
        try {
          const saved = entity(await ExpenseService.updateCommitment({ id: row.id, status: 'active' }));
          if (saved.id !== row.id || saved.status !== 'active') throw new Error('The commitment enable could not be confirmed. Refresh before retrying.');
          if (this.unmounted) return;
          message.success('Recurring commitment enabled.');
          await Promise.all([this.loadCommitments(), this.loadSummary()]);
        } catch (error) {
          if (!this.unmounted) message.error(errorText(error, 'Unable to enable this recurring commitment.'));
        } finally {
          this.expenseActionPending = false;
          if (!this.unmounted) this.setState({ expenseActionId: '' });
        }
      }
    });
  };

  deleteCommitment = row => {
    if (!row.accountingCommitment || this.expenseActionPending) return;
    Modal.confirm({
      title: 'Delete recurring bill?',
      content: `Permanently delete "${row.name || 'Untitled commitment'}"? This is only possible when no bills are linked.`,
      okText: 'Delete', okType: 'danger', cancelText: 'Cancel',
      onOk: async () => {
        this.expenseActionPending = true;
        this.setState({ expenseActionId: row.id });
        try {
          const response = await ExpenseService.deleteCommitment(row.id);
          const result = response && response.data && response.data.data || response && response.data;
          if (!result || result.id !== row.id || result.deleted !== true) throw new Error('The commitment deletion could not be confirmed. Refresh before retrying.');
          if (this.unmounted) return;
          message.success('Recurring commitment deleted.');
          await Promise.all([this.loadCommitments(), this.loadSummary()]);
        } catch (error) {
          const body = error && error.response && error.response.data;
          const code = body && body.error && body.error.code || body && body.code;
          const text = code === 'EXPENSE_COMMITMENT_DELETE_BLOCKED'
            ? 'This commitment has linked bills and cannot be deleted.'
            : errorText(error, 'Unable to delete this recurring commitment.');
          if (!this.unmounted) message.error(text);
          throw error;
        } finally {
          this.expenseActionPending = false;
          if (!this.unmounted) this.setState({ expenseActionId: '' });
        }
      }
    });
  };

  deleteExpense = async row => {
    if (row.accountingPayment || row.accountingCommitment || Number(row.isSystem) === 1 || this.expenseActionPending) return;
    this.expenseActionPending = true;
    this.setState({ expenseActionId: row.id });
    try {
      const response = await ExpenseService.archive(row.id);
      if (!response.data || response.data.affected !== 1) throw new Error('The expense deletion could not be confirmed. Refresh before retrying.');
      if (this.unmounted) return;
      message.success('Expense deleted.');
      await Promise.all([this.load(), this.loadSummary()]);
    } catch (error) {
      if (!this.unmounted) message.error(errorText(error, 'Unable to delete this expense.'));
      throw error;
    } finally {
      this.expenseActionPending = false;
      if (!this.unmounted) this.setState({ expenseActionId: '' });
    }
  };

  save = async (payload, confirmation = {}) => {
    const { editor, saving } = this.state;
    if (!editor || Number(editor.isSystem) === 1 || saving || this.saving) return;
    const isCommitment = Boolean(editor.accountingCommitment);
    this.saving = true;
    this.setState({ saving: true, saveError: '' });
    try {
      const response = isCommitment
        ? editor.id ? await ExpenseService.updateCommitment({ ...payload, id: editor.id }) : await ExpenseService.addCommitment(payload)
        : editor.id ? await ExpenseService.update({ ...payload, id: editor.id }) : await ExpenseService.add({ ...payload, type: 0, ...confirmation });
      const saved = entity(response);
      if (editor.id && saved.id !== editor.id) throw new Error('The updated expense could not be confirmed.');
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, duplicate: null, duplicateId: '' });
      message.success(isCommitment ? 'Recurring commitment saved.' : 'Expense saved.');
      if (isCommitment) {
        this.loadCommitments();
        this.loadSummary();
      } else this.load();
    } catch (error) {
      if (this.unmounted) return;
      const duplicate = !isCommitment && !editor.id && duplicateDetails(error);
      this.setState({ saving: false, saveError: errorText(error, isCommitment ? 'Unable to save recurring commitment.' : 'Unable to save this expense.'),
        duplicate: duplicate ? { ...duplicate, payload } : null, duplicateId: '' });
    } finally {
      this.saving = false;
    }
  };

  exportRows = rows => {
    // Keep raw amounts and their currency identity in separate CSV columns.
    const cell = value => `"${String(value == null ? '' : value).replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""')}"`;
    const csv = [['Purpose', 'Category', 'Branch name', 'Branch code', 'Location ID', 'Amount', 'Currency code', 'Currency name', 'Currency symbol', 'Currency ID', 'Start / entry date', 'Record type', 'Frequency', 'Status'], ...rows.map(row => {
      const currency = expenseMoney(row);
      const location = expenseLocation(row);
      return [row.name, row.category, location.name, location.code, location.id, row.amount, currency.code, currency.name, currency.symbol, row.currencyId || row.currency && row.currency.id, row.accountingCommitment ? row.startsOn : row.date, row.accountingPayment ? 'Bill payment' : row.accountingCommitment ? 'Commitment' : 'Recorded expense', row.accountingCommitment ? commitmentFrequencies[row.frequency] : row.accountingPayment ? '' : Number(row.isRecurring) === 1 ? frequencies[row.recurringType] : 'One-off', row.accountingPayment ? 'Reconciled' : row.accountingCommitment ? row.status : 'Recorded'];
    })].map(row => row.map(cell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `expenses-${this.state.month.format('YYYY-MM')}.csv`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  render() {
    const state = this.state;
    const locations = expenseLocations([...state.records, ...state.payments, ...state.approvalBills.map(bill => ({ ...bill, type: 0 }))]);
    if (state.editor && state.editor.accountingCommitment && state.editor.locationId != null && !locations.some(row => String(row.id) === String(state.editor.locationId))) {
      locations.push({ id: state.editor.locationId, name: `Location ${state.editor.locationId}` });
    }
    const activityRecords = [...state.records, ...state.payments];
    const allRows = periodRows(activityRecords, state.month, 'all', '', state.locationId);
    const recurringRows = selectCommitmentRows(state.commitments, state.month, state.query, state.locationId, locations, state.currencyChoices);
    const approvalRows = state.approvalBills.filter(bill => !state.query || `${bill.name || ''} ${bill.categoryName || ''} ${bill.payeeName || ''}`.toLocaleLowerCase().includes(state.query.trim().toLocaleLowerCase()));
    const rows = state.tab === 'recurring' ? recurringRows : state.tab === 'approval' ? approvalRows : periodRows(activityRecords, state.month, 'all', state.query, state.locationId);
    const ready = !state.loading && !state.loadError;
    const supportedTab = ['all', 'recurring', 'approval'].includes(state.tab);
    const summaryCard = (key, fallback) => {
      const card = state.summary && state.summary.cards && state.summary.cards[key];
      if (state.summaryLoading) return 'Loading summary…';
      if (state.summaryError) return 'Summary could not be loaded.';
      if (!card) return fallback;
      if (card.available) {
        if (key === 'fixedBills' && !(card.currencySummaries || []).length) return 'No active commitments for this month.';
        if (key === 'dueSoon' && !(card.currencySummaries || []).length) return 'No approved unpaid bills due within 7 days.';
        if (key === 'paidThisMonth' && !(card.currencySummaries || []).length) return 'No reconciled bill payments recorded this month.';
        return '';
      }
      return summaryReasonText[card.reasonCode] || fallback;
    };
    const fixedBills = state.summary && state.summary.cards && state.summary.cards.fixedBills;
    const dueSoon = state.summary && state.summary.cards && state.summary.cards.dueSoon;
    const paidThisMonth = state.summary && state.summary.cards && state.summary.cards.paidThisMonth;
    const autoGenerate = state.summary && state.summary.cards && state.summary.cards.autoGenerate;
    const fixedBillAmounts = summaryAmountText(fixedBills && fixedBills.currencySummaries);
    const dueSoonAmounts = summaryAmountText(dueSoon && dueSoon.currencySummaries);
    const paidAmounts = summaryAmountText(paidThisMonth && paidThisMonth.currencySummaries);
    const fixedBillCount = (fixedBills && fixedBills.currencySummaries || []).reduce((total, item) => total + (Number(item.activeCommitments) || 0), 0);
    const dueBillCount = (dueSoon && dueSoon.currencySummaries || []).reduce((total, item) => total + (Number(item.billCount) || 0), 0);
    const reconciledBillCount = (paidThisMonth && paidThisMonth.currencySummaries || []).reduce((total, item) => total + (Number(item.reconciledBills) || 0), 0);
    const paidBillCount = (paidThisMonth && paidThisMonth.currencySummaries || []).reduce((total, item) => total + (Number(item.totalBills) || 0), 0);
    const selectedPayableBill = state.payableBills.find(bill => bill.id === state.payableBillId);
    const selectedPayableCurrency = selectedPayableBill && state.currencyChoices.find(currency => String(currency.id) === String(selectedPayableBill.currencyId));
    const selectedOutstanding = selectedPayableBill ? Number(selectedPayableBill.outstandingAmount) : 0;
    const columns = [
      { title: 'BILL PURPOSE & CONTRACT', key: 'purpose', width: 265, render: (_, row) => <div className="expense-purpose"><span className="expense-icon-tile"><Receipt size={19} /></span><div><button className="expense-record-link" onClick={() => this.openDetail(row)}>{row.name || 'Untitled expense'}</button><small>{row.category || 'No category supplied'}</small></div></div> },
      { title: 'LANDLORD / VENDOR PAYEE', key: 'payee', width: 190, render: (_, row) => row.payeeName || <span className="expense-muted">Unknown</span> },
      { title: 'BRANCH SHOP', key: 'branch', width: 145, render: (_, row) => {
        const location = expenseLocation(row);
        return location.name ? <Tag color="blue">{location.name}</Tag> : <span className="expense-muted">Location unavailable</span>;
      } },
      { title: 'AMOUNT / CYCLE', key: 'amount', width: 170, align: 'right', render: (_, row) => {
        const money = expenseMoney(row);
        return <div><strong>{money.amount}</strong><small>{money.label}</small></div>;
      } },
      { title: 'NEXT DUE DATE', key: 'due', width: 165, render: (_, row) => row.accountingCommitment
        ? <div><span>{row.dueDay ? `Day ${row.dueDay} of month` : 'Start-day schedule'}</span><small>{commitmentFrequencies[row.frequency] || 'Frequency unavailable'} · from {moment(row.startsOn).format('DD MMM YYYY')}</small></div>
        : row.accountingPayment ? <div><span>Payment reconciled</span><small>{moment(row.reconciledAt).format('DD MMM YYYY')}</small></div>
        : <div><span>Schedule unavailable</span><small>Entry: {moment(row.date).format('DD MMM YYYY')}</small></div> },
      { title: 'METHOD', key: 'method', width: 135, render: (_, row) => row.accountingPayment ? row.reference || row.paymentMethodId || 'Payment' : <span className="expense-muted">Not supplied</span> },
      state.tab === 'all' ? { title: 'ACTIONS', key: 'actions', width: 130, render: (_, row) => row.accountingPayment || Number(row.isSystem) === 1
        ? <span className="expense-muted">{row.accountingPayment ? 'Bill payment' : 'System record'}</span>
        : <div className="expense-bill-actions"><Button size="small" disabled={Boolean(state.expenseActionId)} onClick={() => this.openExpenseAction(row, 'edit')}>Edit</Button><Button size="small" type="danger" loading={state.expenseActionId === row.id} disabled={Boolean(state.expenseActionId)} onClick={() => this.openExpenseAction(row, 'delete')}>Delete</Button></div>
      } : { title: 'STATUS', key: 'status', width: 165, render: (_, row) => row.accountingCommitment
        ? <Tag color={row.status === 'active' ? 'green' : row.status === 'paused' ? 'orange' : 'default'}>{row.status}</Tag>
        : row.accountingPayment ? <Tag color="green">Bill payment</Tag>
        : <Tag color={Number(row.isRecurring) === 1 ? 'green' : 'blue'}>{Number(row.isRecurring) === 1 ? 'Recurring record' : 'Recorded expense'}</Tag> },
      ...(state.tab === 'recurring' ? [{ title: 'ACTIONS', key: 'actions', width: 220, render: (_, row) => <div className="expense-bill-actions">
        <Button size="small" disabled={Boolean(state.expenseActionId)} onClick={() => this.setState({ editor: { ...row }, saveError: '' })}>Edit</Button>
        {row.status === 'active' && <Button size="small" loading={state.expenseActionId === row.id} disabled={Boolean(state.expenseActionId)} onClick={() => this.disableCommitment(row)}>Disable</Button>}
        {row.status === 'paused' && <Button size="small" loading={state.expenseActionId === row.id} disabled={Boolean(state.expenseActionId)} onClick={() => this.enableCommitment(row)}>Enable</Button>}
        <Button size="small" type="danger" loading={state.expenseActionId === row.id} disabled={Boolean(state.expenseActionId)} onClick={() => this.deleteCommitment(row)}>Delete</Button>
      </div> }] : [])
    ];
    const approvalColumns = [
      { title: 'BILL TO APPROVE', key: 'bill', width: 260, render: (_, bill) => <div className="expense-purpose"><span className="expense-icon-tile"><Receipt size={19} /></span><div><strong>{bill.name || 'Recurring bill'}</strong><small>{bill.categoryName || 'No category supplied'}{bill.payeeName ? ` · ${bill.payeeName}` : ''}</small></div></div> },
      { title: 'BRANCH SHOP', key: 'location', width: 160, render: (_, bill) => {
        const location = expenseLocation(bill);
        return location.name ? <Tag color="blue">{location.name}</Tag> : <span className="expense-muted">Business-wide</span>;
      } },
      { title: 'BILL PERIOD', key: 'period', width: 190, render: (_, bill) => <div>{moment(bill.periodStart).format('DD MMM YYYY')}<small>through {moment(bill.periodEnd).format('DD MMM YYYY')}</small></div> },
      { title: 'DUE DATE', key: 'dueDate', width: 145, render: (_, bill) => <span>{moment(bill.dueDate).format('DD MMM YYYY')}</span> },
      { title: 'AMOUNT', key: 'amount', width: 165, align: 'right', render: (_, bill) => {
        const money = expenseMoney(bill);
        return <div><strong>{money.amount}</strong><small>{money.label}</small></div>;
      } },
      { title: 'ACTIONS', key: 'actions', width: 190, render: (_, bill) => <div className="expense-bill-actions">
        <Button type="primary" size="small" disabled={Boolean(state.billActionId)} loading={state.billActionId === bill.id} onClick={() => this.confirmBillStatus(bill, 'approved')}>Approve</Button>
        <Button size="small" disabled={Boolean(state.billActionId)} onClick={() => this.confirmBillStatus(bill, 'void')}>Void</Button>
      </div> }
    ];

    return <main className="expense-page">
      <nav aria-label="Breadcrumb" className="expense-breadcrumb"><span>Finance</span><ChevronRight size={13} /><span>Expenses & Money Out</span><ChevronRight size={13} /><strong>Fixed & Recurring Overhead</strong></nav>
      <header className="expense-header">
        <div><h1>Expenses & Money Out</h1><p>Track daily store spending and recurring monthly bills across your shops.</p></div>
        <div className="expense-header-controls">
          <div className="expense-control-line expense-header-actions">
            <Button style={{ display: 'none' }} onClick={() => this.setState({ calendar: true })}><CalendarDays size={15} />Payment Calendar</Button>
            <Button onClick={() => this.setState({ editor: {}, saveError: '' })}><Receipt size={15} />Record Expense</Button>
            <Button className="expense-primary" onClick={() => this.setState({ editor: { accountingCommitment: true }, saveError: '' })}><Plus size={16} />Add Recurring Bill</Button>
          </div>
        </div>
      </header>
        <nav className="expense-tabs" aria-label="Expense views">{tabs.map(tab => { const Icon = tab.icon; return <button key={tab.key} style={tab.style} aria-current={state.tab === tab.key ? 'page' : undefined} className={state.tab === tab.key ? 'selected' : ''} onClick={() => this.changeTab(tab.key)}><Icon size={16} />{tab.label}{ready && !state.paymentListLoading && !state.paymentListError && tab.key === 'all' && <span>{allRows.length}</span>}{!state.approvalBillsLoading && !state.approvalBillsError && tab.key === 'approval' && <span>{approvalRows.length}</span>}{!state.commitmentLoading && tab.key === 'recurring' && <span>{recurringRows.length} commitments</span>}</button>; })}</nav>
        <section className="expense-metrics" aria-label="Expense summary">
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Total Monthly Fixed Bills<Repeat size={17} /></div><h2>{fixedBills && fixedBills.available ? fixedBillAmounts.length === 1 ? fixedBillAmounts[0] : fixedBillAmounts.length ? `${fixedBillAmounts.length} currencies` : 'No bills' : 'Not available'}</h2><p>{summaryCard('fixedBills', 'Fixed bill summary is unavailable.')}</p><div className="expense-metric-bottom">{fixedBills && fixedBills.available ? <>{fixedBillAmounts.map(amount => <small key={amount}>{amount}</small>)}{fixedBillCount} active commitments</> : 'Commitment count unavailable'}</div></article>
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Upcoming Bills Due Soon<CalendarDays size={17} /></div><h2>{dueSoon && dueSoon.available ? dueSoonAmounts.length === 1 ? dueSoonAmounts[0] : dueSoonAmounts.length ? `${dueSoonAmounts.length} currencies` : 'No bills' : 'Not available'}</h2><p>{summaryCard('dueSoon', 'Due bill summary is unavailable.')}</p><div className="expense-metric-bottom expense-callout"><Bell size={18} /><span>{dueSoon && dueSoon.available ? `${dueBillCount} bills due within ${dueSoon.windowDays || 7} days` : 'Due bill count unavailable'}{dueSoonAmounts.map(amount => <small key={amount}>{amount}</small>)}</span><Button disabled={!dueSoon || !dueSoon.available || dueBillCount === 0} onClick={this.openPaymentModal}>Pay Now</Button></div></article>
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Paid This Month ({state.month.format('MMM')})<Wallet size={17} /></div><h2>{paidThisMonth && paidThisMonth.available ? paidAmounts.length === 1 ? paidAmounts[0] : paidAmounts.length ? `${paidAmounts.length} currencies` : 'No payments' : 'Not available'}</h2><p>{summaryCard('paidThisMonth', 'Payment summary is unavailable.')}</p><div className="expense-metric-bottom">Settlement Progress<span className="expense-neutral-track" />{paidThisMonth && paidThisMonth.available ? paidBillCount ? `${reconciledBillCount} of ${paidBillCount} bills reconciled` : 'No bills reconciled this month' : 'Reconciled bill count unavailable'}{paidAmounts.map(amount => <small key={amount}>{amount}</small>)}</div></article>
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Automatic Draft Setting<SlidersHorizontal size={17} /></div><span className={`expense-neutral-badge${autoGenerate && autoGenerate.configured ? ' expense-configured-badge' : ''}`}>{autoGenerate && autoGenerate.configured != null ? autoGenerate.configured ? 'Configured' : 'Not configured' : 'Status unavailable'}</span><h2 className="expense-engine-title">{autoGenerate && autoGenerate.active != null ? autoGenerate.active ? 'Preference enabled' : 'Preference disabled' : 'Status unavailable'}</h2><p>{summaryCard('autoGenerate', 'Automatic generation settings are unavailable.')}</p><div className="expense-metric-bottom expense-generation-settings-footer">{autoGenerate && autoGenerate.nextRunAt ? `Next run ${moment(autoGenerate.nextRunAt).format('DD MMM YYYY, HH:mm')}` : 'Scheduler not connected'}<Button onClick={this.openGenerationSettings}>Settings</Button></div></article>
        </section>
        {state.summaryError && <Alert type="error" showIcon role="alert" message={state.summaryError} description={<Button onClick={() => this.loadSummary()}>Retry summary</Button>} style={{ marginBottom: 21 }} />}
        {supportedTab ? <section className="expense-card expense-table-card" aria-label={state.tab === 'approval' ? 'Bills awaiting approval' : 'Expense records'}>
          <div className="expense-toolbar"><Input prefix={<Search size={16} />} aria-label={state.tab === 'approval' ? 'Search bills awaiting approval' : 'Search expense purpose or category'} placeholder={state.tab === 'approval' ? 'Search bill, category, or payee…' : 'Search bill name or category…'} value={state.search} onChange={this.search} allowClear />
            {state.tab !== 'approval' && <DatePicker.MonthPicker className="expense-reporting-month" aria-label="Reporting month" allowClear={false} value={state.month} format="MMMM YYYY" onChange={this.changeMonth} />}
            <Select value={locations.some(location => location.id === state.locationId) ? state.locationId : ''} disabled={!locations.length} aria-label="Branch filter" onChange={this.changeLocation}>
              <Select.Option value="">All returned branches ({locations.length})</Select.Option>
              {locations.map(location => <Select.Option key={location.id} value={location.id}>{location.name || 'Location unavailable'}</Select.Option>)}
            </Select>
            {state.tab !== 'approval' && <Select value={state.tab} aria-label="Expense view filter" onChange={this.changeTab}><Select.Option value="recurring">Recurring commitments</Select.Option><Select.Option value="all">All recorded expenses</Select.Option></Select>}
            {state.tab !== 'approval' && <Tooltip title="Payment and active/paused states are not supplied."><span><Select value="unknown" disabled aria-label="Status filter"><Select.Option value="unknown">Status: Not supplied</Select.Option></Select></span></Tooltip>}
            <Button aria-label="Refresh expenses and commitments" loading={state.loading || state.commitmentLoading || state.paymentListLoading || state.approvalBillsLoading} onClick={() => { this.load(); this.loadCommitments(); this.loadReconciledPayments(); this.loadApprovalBills(); }}><RefreshCw size={16} /></Button>
            {state.tab !== 'approval' && <Button aria-label="Export filtered expense rows as CSV" disabled={state.tab === 'recurring' ? state.commitmentLoading || Boolean(state.commitmentError) || !rows.length : !ready || state.paymentListLoading || Boolean(state.paymentListError) || !rows.length} onClick={() => this.exportRows(rows)}><Download size={16} /></Button>}
          </div>
          <p className="expense-table-note">{state.tab === 'approval' ? 'Generated draft bills awaiting approval. Approving a bill makes it eligible for payment.' : state.tab === 'recurring' ? `Commitments active during ${state.month.format('MMMM YYYY')}. A commitment is not a generated bill or a payment.` : `Recorded expenses and reconciled bill payments in ${state.month.format('MMMM YYYY')}.`}</p>
          {state.tab === 'approval' && state.approvalBillsError && <Alert type="error" showIcon role="alert" message={state.approvalBillsError} description={<Button onClick={() => this.loadApprovalBills()}>Retry bills</Button>} />}
          {state.tab === 'recurring' && state.commitmentError && <Alert type="error" showIcon role="alert" message={state.commitmentError} description={<Button onClick={this.loadCommitments}>Retry commitments</Button>} />}
          {state.tab === 'all' && state.loadError && <Alert type="error" showIcon role="alert" message={state.loadError} description={<Button onClick={this.load}>Retry</Button>} />}
          {state.tab === 'all' && state.paymentListError && <Alert type="error" showIcon role="alert" message={state.paymentListError} description={<Button onClick={() => this.loadReconciledPayments()}>Retry bill payments</Button>} />}
          <Table columns={state.tab === 'approval' ? approvalColumns : columns} dataSource={rows.slice((state.current - 1) * 10, state.current * 10)} rowKey="id" loading={state.tab === 'approval' ? state.approvalBillsLoading : state.tab === 'recurring' ? state.commitmentLoading : state.loading || state.paymentListLoading} pagination={false} scroll={{ x: state.tab === 'approval' ? 980 : state.tab === 'recurring' ? 1455 : 1235 }} locale={{ emptyText: state.tab === 'approval' ? state.approvalBillsError ? 'Bills awaiting approval could not be loaded.' : 'No generated bills are awaiting approval.' : state.tab === 'recurring' ? state.commitmentError ? 'Commitments could not be loaded.' : 'No commitments match this month and search.' : state.loadError ? 'Expenses could not be loaded.' : state.paymentListError ? 'Payment records could not be loaded.' : 'No expenses or reconciled bill payments match this period and search.' }} />
          <footer className="expense-table-footer"><span>{state.tab === 'approval' ? !state.approvalBillsLoading && !state.approvalBillsError ? `Showing ${rows.length ? (state.current - 1) * 10 + 1 : 0}–${Math.min(state.current * 10, rows.length)} of ${rows.length} bills awaiting approval` : 'Approval bills unavailable' : (state.tab === 'recurring' ? !state.commitmentLoading && !state.commitmentError : ready && !state.paymentListLoading && !state.paymentListError) ? `Showing ${rows.length ? (state.current - 1) * 10 + 1 : 0}–${Math.min(state.current * 10, rows.length)} of ${rows.length} ${state.tab === 'recurring' ? 'commitments' : 'expense and payment records'}` : state.tab === 'recurring' ? 'Commitments unavailable' : 'Expense list unavailable'}</span>
            <div className="expense-cycle"><Button onClick={() => this.changeMonth(state.month.clone().subtract(1, 'month'))}>Previous Cycle</Button><Button onClick={() => this.changeMonth(state.month.clone().add(1, 'month'))}>Next Cycle ({state.month.clone().add(1, 'month').format('MMM YYYY')})</Button></div>
            {rows.length > 10 && <Pagination current={state.current} pageSize={10} total={rows.length} onChange={current => this.setState({ current })} />}
          </footer>
        </section> : <section className="expense-card expense-unavailable"><h2>{tabs.find(tab => tab.key === state.tab).label}</h2><p>{state.tab === 'drawers' ? 'Cash drawer balances and shop register records are not connected to this view yet.' : 'Petty cash audit records are not available yet.'}</p><Button onClick={() => this.setState({ tab: 'recurring' })}>Back to Monthly Bills & Rent</Button></section>}
        <div className="expense-lower-grid">
          <section className="expense-card expense-timeline" style={{ display: 'none' }}><div className="expense-section-heading"><h2><CalendarDays size={20} />Upcoming Rent & Lease Timeline</h2><span>Next 30 Days</span></div><p>Scheduled unpaid obligations will appear here when bill and payment tracking are connected.</p>
            <div className="expense-timeline-empty"><span className="expense-icon-tile"><CalendarDays size={26} /></span><strong>Payment schedule unavailable</strong><p>Saved recurrence dates do not establish outstanding amounts or payment approval.</p></div>
            <footer><PendingButton reason="Actual unpaid obligations and a PDF reporting API are required.">Export 30-Day Cash Flow Outflow (PDF) →</PendingButton><strong>Total Next 30D: Unavailable</strong></footer>
          </section>
          <div className="expense-right-column"><section className="expense-wht" style={{ display: 'none' }}><h2><ShieldCheck size={21} />SME Tip: Lease Withholding Tax (WHT)</h2><p>Applicable lease payments may require withholding according to your business’s configured tax treatment.</p>
            <div className="expense-wht-calculation"><div><span>Gross Agreed Lease</span><strong>Not configured</strong></div><div><span>WHT payable</span><strong>Rate unavailable</strong></div><div><span>Net Paid to Landlord</span><strong>Not calculated</strong></div></div>
            <p>Gross-agreed and net-agreed leases require separate calculations. Lease tax rules, payment deductions and WHT slips are not connected to expense records yet.</p>
            <div className="expense-wht-actions"><PendingButton reason="Lease contracts and WHT slips are not available."><FileText size={15} />View Lease Contracts & WHT Slips</PendingButton><PendingButton reason="No expense WHT configuration contract is available."><SlidersHorizontal size={15} />Configure WHT %</PendingButton></div>
          </section>
          </div>
        </div>
      <Modal visible={state.payModalOpen} title="Record bill payment" onCancel={() => { if (!state.paymentSaving) { this.payableRequest++; this.setState({ payModalOpen: false }); } }} closable={!state.paymentSaving} maskClosable={false}
        footer={[
          <Button key="close" disabled={state.paymentSaving} onClick={() => { this.payableRequest++; this.setState({ payModalOpen: false }); }}>Close</Button>,
          <Button key="submit" type="primary" loading={state.paymentSaving} disabled={state.paymentSaving || !state.pendingReconciliation && (!selectedPayableBill || !Number.isFinite(Number(state.payAmount)) || Number(state.payAmount) <= 0 || Number(state.payAmount) > selectedOutstanding + 0.00005)} onClick={this.submitBillPayment}>{state.pendingReconciliation ? 'Retry reconciliation' : 'Record and reconcile'}</Button>
        ]}>
        <p>Select an approved bill and enter a full or partial payment. The payment is recorded first and then reconciled to update the bill balance.</p>
        {state.paymentError && <Alert type="error" showIcon role="alert" message={state.paymentError} style={{ marginBottom: 16 }} />}
        {state.pendingReconciliation && <Alert type="warning" showIcon message="Payment is saved but not yet reconciled." description={`Payment ID: ${state.pendingReconciliation.id}. Retry reconciliation to update the bill balance. Do not create another payment.`} style={{ marginBottom: 16 }} />}
        {!state.pendingReconciliation && state.payableLoading && <Skeleton active />}
        {!state.pendingReconciliation && !state.payableLoading && state.payableError && <Alert type="error" message={state.payableError} description={<Button onClick={this.openPaymentModal}>Retry bills</Button>} />}
        {!state.pendingReconciliation && !state.payableLoading && !state.payableError && !state.payableBills.length && <Alert type="info" message="No approved unpaid bills are due in the next seven days." />}
        {!state.pendingReconciliation && !state.payableLoading && !state.payableError && state.payableBills.length > 0 && <>
          <label className="expense-payment-field" htmlFor="expense-payable-bill">Bill</label>
          <Select id="expense-payable-bill" value={state.payableBillId} onChange={this.selectPayableBill} style={{ width: '100%', marginBottom: 16 }}>
            {state.payableBills.map(bill => {
              const currency = state.currencyChoices.find(row => String(row.id) === String(bill.currencyId)) || { code: bill.currencyId };
              const money = expenseMoney({ amount: bill.outstandingAmount, currency });
              return <Select.Option key={bill.id} value={bill.id}>{bill.name || 'Recurring bill'} · Due {moment(bill.dueDate).format('DD MMM YYYY')} · Balance {money.amount}</Select.Option>;
            })}
          </Select>
          {selectedPayableBill && <>
            <p className="expense-muted">Outstanding balance: {expenseMoney({ amount: selectedPayableBill.outstandingAmount, currency: selectedPayableCurrency || { code: selectedPayableBill.currencyId } }).amount}</p>
            <label className="expense-payment-field" htmlFor="expense-payment-amount">Payment amount</label>
            <InputNumber id="expense-payment-amount" min={0.0001} max={selectedOutstanding} precision={4} value={state.payAmount} onChange={value => this.setState({ payAmount: value, paymentError: '' })} style={{ width: '100%' }} />
          </>}
        </>}
      </Modal>
      <Modal visible={state.generationModalOpen} title={`Automatic bill draft settings${state.locationId ? ' · selected branch' : ' · business-wide'}`} onCancel={() => { if (!state.generationSettingsSaving) this.setState({ generationModalOpen: false }); }} closable={!state.generationSettingsSaving} maskClosable={false}
        footer={[<Button key="cancel" disabled={state.generationSettingsSaving} onClick={() => this.setState({ generationModalOpen: false })}>Cancel</Button>, <Button key="save" type="primary" loading={state.generationSettingsSaving} disabled={state.generationSettingsLoading} onClick={this.saveGenerationSettings}>Save settings</Button>]}>
        {state.generationSettingsLoading ? <Skeleton active /> : <>
          {state.generationSettingsError && <Alert type="error" showIcon message={state.generationSettingsError} style={{ marginBottom: 16 }} />}
          <Alert type="info" showIcon message="Automatic bill drafts are created by the expense scheduler." description="The worker checks every five minutes. Start the separate expense-scheduler process, and enable automatic generation on each recurring bill you want it to draft." style={{ marginBottom: 16 }} />
          <div className="expense-payment-field"><span>Enable automatic draft generation</span><Switch checked={state.generationDraft.enabled} onChange={enabled => this.setState(state => ({ generationDraft: { ...state.generationDraft, enabled } }))} /></div>
          <label className="expense-payment-field" htmlFor="expense-generation-lead">Draft lead time (days)</label>
          <InputNumber id="expense-generation-lead" min={0} max={365} precision={0} value={state.generationDraft.draftLeadDays} onChange={draftLeadDays => this.setState(state => ({ generationDraft: { ...state.generationDraft, draftLeadDays: draftLeadDays == null ? 0 : draftLeadDays } }))} style={{ width: '100%', marginBottom: 16 }} />
          <label className="expense-payment-field" htmlFor="expense-generation-timezone">Timezone (IANA)</label>
          <Input id="expense-generation-timezone" value={state.generationDraft.timezone} placeholder="Asia/Phnom_Penh" onChange={event => this.setState(state => ({ generationDraft: { ...state.generationDraft, timezone: event.target.value } }))} />
        </>}
      </Modal>
      {state.editor && <ExpenseForm key={state.editor.id || (state.editor.accountingCommitment ? 'new-commitment' : `new-${state.editor.isRecurring || 0}`)} record={state.editor} locations={locations} recurring={Number(state.editor.isRecurring) === 1} commitment={Boolean(state.editor.accountingCommitment)} busy={state.saving} error={state.saveError} onSave={this.save} onCancel={() => { if (!state.saving) this.setState({ editor: null, duplicate: null }); }} />}
      <Modal visible={Boolean(state.duplicate)} title="Matching expense found" footer={null} closable={!state.saving} maskClosable={false} onCancel={() => { if (!state.saving) this.setState({ duplicate: null }); }}>
        {state.duplicate && <><p>Choose whether to create another expense or override a matching record. Cancel makes no further changes.</p><Radio.Group value={state.duplicateId} disabled={state.saving} onChange={event => this.setState({ duplicateId: event.target.value })}>{state.duplicate.duplicates.map(row => <Radio key={row.id} value={row.id} style={{ display: 'block', marginBottom: 10 }}>{row.name} · {row.amount} · {row.registerDate && String(row.registerDate).slice(0, 10)}</Radio>)}</Radio.Group><div className="expense-duplicate-actions"><Button disabled={state.saving} onClick={() => this.setState({ duplicate: null })}>Cancel</Button>{state.duplicate.allowedActions.includes('create') && <Button loading={state.saving} onClick={() => this.save(state.duplicate.payload, { duplicateAction: 'create' })}>Create New</Button>}{state.duplicate.allowedActions.includes('override') && <Button type="primary" loading={state.saving} disabled={!state.duplicateId} onClick={() => this.save(state.duplicate.payload, { duplicateAction: 'override', duplicateExpenseId: state.duplicateId })}>Override Selected</Button>}</div></>}
      </Modal>
      <Modal visible={Boolean(state.detail)} title={state.detail && state.detail.accountingCommitment ? 'Commitment details' : state.detail && state.detail.accountingPayment ? 'Bill payment details' : 'Expense record details'} footer={null} onCancel={() => { this.detailRequest++; this.setState({ detail: null }); }}>
        {state.detailLoading ? <Skeleton active /> : state.detailError ? <Alert type="error" message={state.detailError} description={<Button onClick={() => this.openDetail(state.detail)}>Retry</Button>} /> : state.detail && <div className="expense-detail"><h2>{state.detail.name}</h2><dl>{state.detail.accountingCommitment ? [
          ['Category', state.detail.categoryName], ['Amount', state.detail.amount], ['Currency', state.detail.currencyId],
          ['Branch', state.detail.location && state.detail.location.name || state.detail.locationId], ['Payee', state.detail.payeeName],
          ['Frequency', commitmentFrequencies[state.detail.frequency]], ['Interval', `Every ${state.detail.intervalCount || 1}`],
          ['Due day', state.detail.dueDay], ['Starts on', state.detail.startsOn && moment(state.detail.startsOn).format('DD MMM YYYY')],
          ['Ends on', state.detail.endsOn && moment(state.detail.endsOn).format('DD MMM YYYY')], ['Status', state.detail.status],
          ['Automatic generation', state.detail.autoGenerate ? 'Enabled on commitment' : 'Not enabled']
        ] : state.detail.accountingPayment ? [
          ['Bill', state.detail.name], ['Category', state.detail.category], ['Amount allocated', state.detail.amount],
          ['Currency reference', state.detail.currencyId], ['Branch', state.detail.location && state.detail.location.name || state.detail.locationId],
          ['Paid at', state.detail.paidAt && moment(state.detail.paidAt).format('DD MMM YYYY, HH:mm')],
          ['Reconciled at', state.detail.reconciledAt && moment(state.detail.reconciledAt).format('DD MMM YYYY, HH:mm')],
          ['Payment ID', state.detail.paymentId], ['Bill ID', state.detail.billId],
          ['Payment method', state.detail.paymentMethodId], ['Reference', state.detail.reference], ['Status', state.detail.paymentStatus]
        ] : [
          ['Category', state.detail.categoryName || state.detail.category && state.detail.category.name], ['Amount', state.detail.amount],
          ['Currency reference', state.detail.currencyId], ['Branch', state.detail.location && state.detail.location.name || state.detail.locationId],
          ['Entry date', state.detail.registerDate && moment(state.detail.registerDate).format('DD MMM YYYY')],
          ['Frequency', Number(state.detail.isRecurring) === 1 ? frequencies[state.detail.recurringType] || 'Not supplied' : 'One-off'],
          ['Recurrence date', state.detail.recurringDate && moment(state.detail.recurringDate).isValid() ? moment(state.detail.recurringDate).format('DD MMM YYYY') : 'Not supplied'],
          ['Supporting document', state.detail.attachment ? 'Document linked to this record' : 'No document linked']
        ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value == null || value === '' ? unavailable : String(value)}</dd></div>)}</dl>{state.detail.accountingCommitment
          ? <><Alert type="info" message="A commitment describes a recurring obligation. Bills and payments are managed separately." /><Button onClick={() => this.setState({ editor: { ...state.detail }, detail: null, saveError: '' })}>Edit commitment</Button></>
          : state.detail.accountingPayment ? <Alert type="info" message="This reconciled payment is allocated to a generated bill. It is separate from recorded expense entries." />
            : <><Alert type="info" message="This record does not confirm a payment, reconciliation or unpaid obligation." />{Number(state.detail.isSystem) !== 1 && <Button onClick={() => this.setState({ editor: state.detail, detail: null, saveError: '' })}>Edit record / attach document</Button>}</>}
        </div>}
      </Modal>
      <Modal visible={state.calendar} title="Payment Calendar" footer={<Button onClick={() => this.setState({ calendar: false })}>Close</Button>} onCancel={() => this.setState({ calendar: false })}><Alert type="info" showIcon message="Payment schedule unavailable" description="Saved recurrence dates do not confirm due bills or payment allocations. A payment calendar will be available when those records are connected." /></Modal>
    </main>;
  }
}
