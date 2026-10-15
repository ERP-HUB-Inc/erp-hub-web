import React, { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import LogService from '@services/LogService';
import { Activity, AlertCircle, CalendarDays, ChevronRight, Clipboard, Download, FileText, Filter, MoreHorizontal, RefreshCw, Search as SearchIcon, ShieldAlert, SlidersHorizontal, Trash2, X } from 'lucide-react';
import './SystemLogs.css';
import {
  Alert,
  Checkbox,
  Tabs,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Drawer,
  Dropdown,
  Menu,
  Modal,
  message,
} from 'antd';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const DEFAULT_LEVELS = ['info', 'error', 'warning'];
const getLogTab = (search) => new URLSearchParams(search).get('logTab') === 'activities' ? 'activities' : 'system';

const SystemLogs = ({ embedded = false, history, location }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState(() => getLogTab(location.search));
  const [userId, setUserId] = useState('');
  const [errorText, setErrorText] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const requestId = useRef(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLevels, setSelectedLevels] = useState(DEFAULT_LEVELS);
  const [dateRange, setDateRange] = useState([]);
  const [cleanupVisible, setCleanupVisible] = useState(false);
  const [cleanupRange, setCleanupRange] = useState([]);
  const [cleanupLevels, setCleanupLevels] = useState([]);
  const [cleanupPreview, setCleanupPreview] = useState(null);
  const [cleanupPreviewParams, setCleanupPreviewParams] = useState(null);
  const [cleanupError, setCleanupError] = useState('');
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupDeleting, setCleanupDeleting] = useState(false);
  const [cleanupConfirmed, setCleanupConfirmed] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const normalizeLogRow = (item) => ({
    ...item,
    key: `${item.fileName || 'log'}-${item.lineNumber || 0}-${item.timestampMs || item.timestamp || item.date || 'row'}`,
  });

  const buildQueryParams = (tab, page, pageSize, nextSearchText, nextLevels, nextDateRange, nextUserId) => {
    const params = {};
    const trimmedSearch = String(nextSearchText || '').trim();
    const safeDateRange = Array.isArray(nextDateRange) ? nextDateRange : [];

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (tab === 'system' && Array.isArray(nextLevels) && nextLevels.length > 0) {
      params.levels = nextLevels.join(',');
    }

    if (tab === 'activities' && String(nextUserId || '').trim()) {
      params.userId = String(nextUserId).trim();
    }

    if (safeDateRange[0]) {
      params.dateFrom = safeDateRange[0].format('YYYY-MM-DD');
    }

    if (safeDateRange[1]) {
      params.dateTo = safeDateRange[1].format('YYYY-MM-DD');
    }

    params.limit = pageSize;
    params.offset = (page - 1) * pageSize;

    return params;
  };

  const fetchLogs = async (options = {}) => {
    const tab = options.tab || activeTab;
    const nextPage = options.page || pagination.current;
    const nextPageSize = options.pageSize || pagination.pageSize;
    const nextSearchText = Object.prototype.hasOwnProperty.call(options, 'searchText')
      ? options.searchText
      : searchText;
    const nextLevels = Object.prototype.hasOwnProperty.call(options, 'selectedLevels')
      ? options.selectedLevels
      : selectedLevels;
    const nextDateRange = Object.prototype.hasOwnProperty.call(options, 'dateRange')
      ? options.dateRange
      : dateRange;
    const nextUserId = Object.prototype.hasOwnProperty.call(options, 'userId')
      ? options.userId
      : userId;

    const params = buildQueryParams(tab, nextPage, nextPageSize, nextSearchText, nextLevels, nextDateRange, nextUserId);
    const currentRequestId = ++requestId.current;

    setLoading(true);
    setErrorText('');
    try {
      const response = tab === 'system'
        ? await LogService.getSystemLogs(params)
        : await LogService.getActivities(params);
      if (currentRequestId !== requestId.current) return;
      const responseData = response?.data || {};
      const nextLogs = Array.isArray(responseData.data)
        ? responseData.data.map(tab === 'system' ? normalizeLogRow : (item) => ({ ...item, key: item.id }))
        : [];
      const nextPagination = responseData.pagination || {};

      setLogs(nextLogs);
      setPagination({
        current: nextPagination.current || nextPage,
        pageSize: nextPagination.limit || nextPageSize,
        total: nextPagination.total || 0,
      });
      setSelectedRowKeys([]);
    } catch (error) {
      if (currentRequestId !== requestId.current) return;
      const errorMessage =
        (error?.response?.status === 403
          ? tab === 'system'
            ? 'Access denied. System logs require full access and a user ID allowed by the server.'
            : 'Access denied. User activities require full access.'
          : null) ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to load logs';
      setErrorText(typeof errorMessage === 'string' ? errorMessage : 'Failed to load logs');
      setLogs([]);
      setSelectedRowKeys([]);
      setPagination((current) => ({ ...current, current: nextPage, total: 0 }));
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs({ page: 1 });
  }, []);

  useEffect(() => {
    const nextTab = getLogTab(location.search);
    if (nextTab === activeTab) return;
    setActiveTab(nextTab);
    setLogs([]);
    setSelectedRowKeys([]);
    setSelectedLog(null);
    fetchLogs({ tab: nextTab, page: 1 });
  }, [location.search]);

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(location.search);
    params.set('logTab', tab);
    history.push({ pathname: location.pathname, search: params.toString() });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchLogs({ page: 1, searchText: value });
  };

  const handleLevelsChange = (values) => {
    const nextLevels = values && values.length > 0 ? values : [];
    setSelectedLevels(nextLevels);
    fetchLogs({ page: 1, selectedLevels: nextLevels });
  };

  const handleDateRangeChange = (values) => {
    setDateRange(values || []);
    fetchLogs({ page: 1, dateRange: values || [] });
  };

  const handleUserIdSearch = (value) => {
    setUserId(value);
    fetchLogs({ page: 1, userId: value });
  };

  const handleTableChange = (nextPagination) => {
    fetchLogs({
      page: nextPagination.current,
      pageSize: nextPagination.pageSize,
    });
  };

  const openCleanup = () => {
    setCleanupRange(dateRange.length === 2 && dateRange.every(Boolean) ? dateRange : []);
    setCleanupLevels([]);
    setCleanupPreview(null);
    setCleanupPreviewParams(null);
    setCleanupConfirmed(false);
    setCleanupError('');
    setCleanupVisible(true);
  };

  const changeCleanupRange = (range) => {
    setCleanupRange(range || []);
    setCleanupPreview(null);
    setCleanupPreviewParams(null);
    setCleanupConfirmed(false);
  };

  const changeCleanupLevels = (levels) => {
    setCleanupLevels(levels);
    setCleanupPreview(null);
    setCleanupPreviewParams(null);
    setCleanupConfirmed(false);
  };

  const cleanupParams = useMemo(() => {
    const [from, to] = cleanupRange;
    if (!from || !to || !from.isValid() || !to.isValid() || from.isAfter(to, 'day') || cleanupLevels.length === 0) return null;
    return {
      dateFrom: from.format('YYYY-MM-DD'),
      dateTo: to.format('YYYY-MM-DD'),
      levels: cleanupLevels.join(','),
    };
  }, [cleanupRange, cleanupLevels]);

  const previewCleanup = async () => {
    if (!cleanupParams) return;
    setCleanupLoading(true);
    setCleanupError('');
    setCleanupPreview(null);
    setCleanupPreviewParams(null);
    setCleanupConfirmed(false);
    try {
      const response = await LogService.previewCleanup(cleanupParams);
      setCleanupPreview(response.data == null ? {} : response.data);
      setCleanupPreviewParams(cleanupParams);
    } catch (error) {
      setCleanupError(error?.response?.status === 403
        ? 'Access denied. Your account cannot preview log cleanup.'
        : error?.response?.data?.message || 'Failed to preview log cleanup.');
    } finally {
      setCleanupLoading(false);
    }
  };

  const deleteLogFiles = async () => {
    if (!cleanupPreviewParams || !cleanupConfirmed || cleanupDeleting) return;
    setCleanupDeleting(true);
    setCleanupError('');
    try {
      await LogService.deleteFiles(cleanupPreviewParams);
      message.success('Log files deleted');
      setCleanupVisible(false);
      fetchLogs({ page: 1 });
    } catch (error) {
      setCleanupError(error?.response?.status === 403
        ? 'Access denied. Your account cannot delete log files.'
        : error?.response?.data?.message || 'Failed to delete log files.');
    } finally {
      setCleanupPreview(null);
      setCleanupPreviewParams(null);
      setCleanupConfirmed(false);
      setCleanupDeleting(false);
    }
  };

  const copyText = async (text) => {
    if (!text) {
      message.warning('Nothing to copy');
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'readonly');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      message.success('Copied to clipboard');
    } catch (error) {
      message.error('Failed to copy log');
    }
  };

  const exportLog = (record) => {
    const content = JSON.stringify(record, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.fileName || 'log'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleRowAction = (action, record) => {
    switch (action) {
      case 'view':
        setSelectedLog(record);
        break;
      case 'copy':
        copyText(record.message || '');
        break;
      case 'export':
        exportLog(record);
        break;
      default:
        break;
    }
  };

  const handleExportSelected = () => {
    const selectedLogs = logs.filter((item) => selectedRowKeys.includes(item.key));

    if (selectedLogs.length === 0) {
      message.warning('Select at least one log first');
      return;
    }

    const blob = new Blob([JSON.stringify(selectedLogs, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${moment().format('YYYY-MM-DD-HH-mm-ss')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleCopySelected = () => {
    const selectedLogs = logs.filter((item) => selectedRowKeys.includes(item.key));
    const content = selectedLogs.map((item) => item.message || '').filter(Boolean).join('\n\n');
    copyText(content);
  };

  const columns = [
    {
      title: 'TIME',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (value, record) => (
        <span className="log-explorer-time">{value || record.date || '—'}</span>
      ),
    },
    {
      title: 'LEVEL',
      dataIndex: 'level',
      key: 'level',
      width: 112,
      render: (value) => (
        <span className={`log-explorer-level log-explorer-level-${String(value || '').toLowerCase()}`}>
          <span className="log-explorer-level-dot" />
          {String(value || 'Unknown').toUpperCase()}
        </span>
      ),
    },
    {
      title: 'MESSAGE',
      dataIndex: 'message',
      key: 'message',
      render: (value, record) => (
        <button type="button" className="log-explorer-message" onClick={() => setSelectedLog(record)}>
          {value || '—'} <ChevronRight size={14} aria-hidden="true" />
        </button>
      ),
    },
    {
      title: 'SOURCE',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 190,
      render: (value, record) => (
        <span className="log-explorer-source" title={value || ''}>
          {value || '—'}{record.lineNumber != null ? `:${record.lineNumber}` : ''}
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 48,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => handleRowAction(key, record)}>
              <Menu.Item key="view"><FileText size={14} /> View details</Menu.Item>
              <Menu.Item key="copy"><Clipboard size={14} /> Copy message</Menu.Item>
              <Menu.Item key="export"><Download size={14} /> Export JSON</Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button className="log-explorer-row-action" aria-label="Log actions"><MoreHorizontal size={17} aria-hidden="true" /></Button>
        </Dropdown>
      ),
    },
  ];

  const activityColumns = [
    {
      title: 'TIME',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (value) => <span className="log-explorer-time">{value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '—'}</span>,
    },
    { title: 'ACTION', dataIndex: 'action', key: 'action', width: 100,
      render: (value) => <span className="log-explorer-action-pill">{value || '—'}</span> },
    { title: 'EVENT', dataIndex: 'name', key: 'name',
      render: (value, record) => (
        <button type="button" className="log-explorer-message" onClick={() => setSelectedLog(record)}>
          {value || '—'} <ChevronRight size={14} aria-hidden="true" />
        </button>
      ) },
    { title: 'DESCRIPTION', dataIndex: 'description', key: 'description' },
    { title: 'USER ID', dataIndex: 'userId', key: 'userId', width: 170,
      render: (value) => <span className="log-explorer-source">{value || '—'}</span> },
    { title: 'STATUS', dataIndex: 'status', key: 'status', width: 86,
      render: (value) => value == null ? '—' : String(value) },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (nextSelectedRowKeys) => {
      setSelectedRowKeys(nextSelectedRowKeys);
    },
  };

  const logStats = useMemo(() => {
    const warningCount = logs.filter((item) => String(item.level || '').toUpperCase() === 'WARNING').length;
    const errorCount = logs.filter((item) => String(item.level || '').toUpperCase() === 'ERROR').length;

    return { warningCount, errorCount };
  }, [logs]);

  const activityBuckets = useMemo(() => {
    const timestamps = logs
      .map((item) => activeTab === 'system'
        ? item.timestampMs != null ? Number(item.timestampMs) : Date.parse(item.timestamp)
        : Date.parse(item.createdAt))
      .filter(Number.isFinite);
    const buckets = Array(16).fill(0);
    if (!timestamps.length) return buckets;
    const start = Math.min(...timestamps);
    const span = Math.max(...timestamps) - start || 1;
    timestamps.forEach((value) => {
      const index = Math.min(15, Math.floor(((value - start) / span) * 16));
      buckets[index] += 1;
    });
    return buckets;
  }, [logs, activeTab]);

  return (
    <div className={'log-explorer' + (embedded ? ' log-explorer-embedded' : '')}>
      <div className="log-explorer-header">
        <div className="log-explorer-heading">
          <span className="log-explorer-eyebrow"><Activity size={14} aria-hidden="true" /> OBSERVABILITY / LOG EXPLORER</span>
          <h2>Explore events</h2>
          <p>Search system events and user activity from one workspace.</p>
        </div>
        <div className="log-explorer-header-actions">
          {activeTab === 'system' && (
            <Button className="log-explorer-cleanup-trigger" onClick={openCleanup}>
              <Trash2 size={15} aria-hidden="true" /> Clean up logs
            </Button>
          )}
          <Button className="log-explorer-refresh" onClick={() => fetchLogs({ page: pagination.current })} loading={loading}>
            {!loading && <RefreshCw size={15} aria-hidden="true" />} Refresh
          </Button>
        </div>
      </div>

      <Tabs className="log-explorer-tabs" activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab={<span><FileText size={16} aria-hidden="true" /> System logs</span>} key="system" />
        <TabPane tab={<span><Activity size={16} aria-hidden="true" /> User activities</span>} key="activities" />
      </Tabs>

      <div className="log-explorer-query">
        <div className="log-explorer-search-row">
          <div className="log-explorer-query-input">
            <Search
              aria-label={activeTab === 'system' ? 'Search system logs' : 'Search user activities'}
              placeholder={activeTab === 'system' ? 'Search system logs' : 'Search user activities'}
              prefix={<SearchIcon size={16} aria-hidden="true" />}
              enterButton="Search"
              allowClear
              value={searchText}
              onSearch={handleSearch}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <div className="log-explorer-date">
            <CalendarDays size={16} aria-hidden="true" />
            <RangePicker
              aria-label="Date range"
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              allowClear
            />
          </div>
        </div>
        <div className="log-explorer-filter-row">
          <span className="log-explorer-filter-label"><SlidersHorizontal size={15} aria-hidden="true" /> Filters</span>
          {activeTab === 'system' ? (
            <Select
              mode="multiple"
              className="log-explorer-level-select"
              aria-label="Log levels"
              value={selectedLevels}
              onChange={handleLevelsChange}
              placeholder="All levels"
              maxTagCount={3}
            >
              <Option value="info">Info</Option>
              <Option value="warning">Warning</Option>
              <Option value="error">Error</Option>
            </Select>
          ) : (
            <Search
              className="log-explorer-user-filter"
              aria-label="Filter activities by user ID"
              placeholder="Filter by user ID"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              onSearch={handleUserIdSearch}
              allowClear
            />
          )}
          {dateRange.length > 0 && (
            <button type="button" className="log-explorer-filter-chip" onClick={() => handleDateRangeChange([])}>
              <CalendarDays size={13} aria-hidden="true" />
              {dateRange.filter(Boolean).map((date) => date.format('MMM D')).join(' – ')}
              <X size={13} aria-hidden="true" />
            </button>
          )}
          <span className="log-explorer-filter-hint"><Filter size={13} aria-hidden="true" /> Level and date filters update automatically</span>
        </div>
      </div>

      {errorText && (
        <Alert className="log-explorer-alert" type="error" showIcon message={errorText} />
      )}

      <div className="log-explorer-overview">
        <div className="log-explorer-metric">
          <span className="log-explorer-metric-icon log-explorer-metric-icon-blue"><FileText size={17} aria-hidden="true" /></span>
          <div><span>Total results</span><strong>{pagination.total.toLocaleString()}</strong></div>
        </div>
        <div className="log-explorer-metric">
          <span className="log-explorer-metric-icon log-explorer-metric-icon-slate"><Activity size={17} aria-hidden="true" /></span>
          <div><span>On this page</span><strong>{logs.length}</strong></div>
        </div>
        {activeTab === 'system' && (
          <>
            <div className="log-explorer-metric">
              <span className="log-explorer-metric-icon log-explorer-metric-icon-amber"><ShieldAlert size={17} aria-hidden="true" /></span>
              <div><span>Warnings on page</span><strong>{logStats.warningCount}</strong></div>
            </div>
            <div className="log-explorer-metric">
              <span className="log-explorer-metric-icon log-explorer-metric-icon-red"><AlertCircle size={17} aria-hidden="true" /></span>
              <div><span>Errors on page</span><strong>{logStats.errorCount}</strong></div>
            </div>
          </>
        )}
      </div>

      <div className="log-explorer-chart-panel">
        <div className="log-explorer-panel-heading">
          <div><h3>Event distribution</h3><span>Current page only · {logs.length} events</span></div>
          <span className="log-explorer-chart-key"><i /> Events</span>
        </div>
        <div className="log-explorer-chart" role="img" aria-label={'Distribution of ' + logs.length + ' events on the current page'}>
          {activityBuckets.map((count, index) => (
            <div className="log-explorer-chart-slot" key={index} title={count + ' events'}>
              <span style={{ height: (count ? Math.max(8, (count / Math.max(...activityBuckets)) * 100) : 2) + '%' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="log-explorer-results">
        <div className="log-explorer-results-header">
          <div>
            <h3>{activeTab === 'system' ? 'System events' : 'User activity'}</h3>
            <p>{pagination.total.toLocaleString()} matching {activeTab === 'system' ? 'logs' : 'activities'}</p>
          </div>
          {activeTab === 'system' && selectedRowKeys.length > 0 && (
            <div className="log-explorer-selection-actions">
              <span>{selectedRowKeys.length} selected</span>
              <Button size="small" onClick={handleCopySelected}><Clipboard size={14} aria-hidden="true" /> Copy</Button>
              <Button size="small" onClick={handleExportSelected}><Download size={14} aria-hidden="true" /> Export</Button>
            </div>
          )}
        </div>
        <Table
          className="log-explorer-table"
          rowSelection={activeTab === 'system' ? rowSelection : undefined}
          columns={activeTab === 'system' ? columns : activityColumns}
          dataSource={logs}
          loading={loading}
          locale={{ emptyText: errorText ? 'Results unavailable' : 'No events match these filters' }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) => range[0] + '–' + range[1] + ' of ' + total,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          size="middle"
          scroll={{ x: 900 }}
        />
      </div>

      <Drawer
        className="log-explorer-drawer"
        title={<span className="log-explorer-drawer-title"><FileText size={18} aria-hidden="true" /> Event details</span>}
        placement="right"
        width={Math.min(520, typeof window !== 'undefined' ? window.innerWidth : 520)}
        visible={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      >
        {selectedLog && (
          <div className="log-explorer-detail">
            <div className="log-explorer-detail-top">
              <span className="log-explorer-eyebrow">EVENT RECORD</span>
              <h3>{selectedLog.message || selectedLog.name || 'Event'}</h3>
              <p>{selectedLog.timestamp || (selectedLog.createdAt && moment(selectedLog.createdAt).format('YYYY-MM-DD HH:mm:ss')) || '—'}</p>
            </div>
            <dl>
              {(activeTab === 'system' ? [
                ['Level', selectedLog.level],
                ['File', selectedLog.fileName],
                ['Line', selectedLog.lineNumber],
                ['Date', selectedLog.date],
              ] : [
                ['User ID', selectedLog.userId],
                ['Action', selectedLog.action],
                ['Status', selectedLog.status],
                ['Description', selectedLog.description],
                ['Updated', selectedLog.updatedAt],
              ]).map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value == null || value === '' ? '—' : String(value)}</dd></div>
              ))}
            </dl>
            {activeTab === 'system' && (
              <div className="log-explorer-payload">
                <h4>Payload</h4>
                <pre>{selectedLog.payload == null ? 'No payload' : JSON.stringify(selectedLog.payload, null, 2)}</pre>
              </div>
            )}
            <div className="log-explorer-detail-actions">
              <Button onClick={() => copyText(selectedLog.message || selectedLog.name || '')}><Clipboard size={14} aria-hidden="true" /> Copy text</Button>
              <Button onClick={() => exportLog(selectedLog)}><Download size={14} aria-hidden="true" /> Export JSON</Button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        className="log-explorer-cleanup-modal"
        title={<span className="log-explorer-drawer-title"><Trash2 size={18} aria-hidden="true" /> Clean up log files</span>}
        visible={cleanupVisible}
        onCancel={() => { if (!cleanupLoading && !cleanupDeleting) setCleanupVisible(false); }}
        maskClosable={false}
        closable={!cleanupLoading && !cleanupDeleting}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setCleanupVisible(false)} disabled={cleanupLoading || cleanupDeleting}>Cancel</Button>,
          <Button key="delete" type="danger" loading={cleanupDeleting} disabled={!cleanupPreviewParams || !cleanupConfirmed || cleanupLoading} onClick={deleteLogFiles}>
            Delete matching files
          </Button>,
        ]}
      >
        <p className="log-explorer-cleanup-intro">Choose the files to remove by date and level. Preview the server response before deleting. This action cannot be undone.</p>
        <div className="log-explorer-cleanup-fields">
          <label>
            <span>Date range <em className="log-explorer-required" aria-hidden="true">*</em></span>
            <RangePicker
              value={cleanupRange}
              onChange={changeCleanupRange}
              format="YYYY-MM-DD"
              disabled={cleanupLoading || cleanupDeleting}
              allowClear
            />
          </label>
          <label>
            <span>Log levels <em className="log-explorer-required" aria-hidden="true">*</em></span>
            <Select
              mode="multiple"
              value={cleanupLevels}
              onChange={changeCleanupLevels}
              placeholder="Select levels to delete"
              disabled={cleanupLoading || cleanupDeleting}
            >
              <Option value="info">Info</Option>
              <Option value="warning">Warning</Option>
              <Option value="error">Error</Option>
            </Select>
          </label>
        </div>
        <Button className="log-explorer-preview-button" onClick={previewCleanup} loading={cleanupLoading} disabled={!cleanupParams || cleanupDeleting}>
          Preview matching files
        </Button>
        {cleanupError && <Alert type="error" showIcon message={cleanupError} style={{ marginTop: 16 }} />}
        {cleanupPreviewParams && cleanupPreview !== null && (
          <div className="log-explorer-cleanup-preview">
            <h4>Server preview</h4>
            <p>{cleanupPreviewParams.dateFrom} to {cleanupPreviewParams.dateTo} · {cleanupPreviewParams.levels}</p>
            <pre>{JSON.stringify(cleanupPreview, null, 2)}</pre>
            <Checkbox checked={cleanupConfirmed} onChange={(event) => setCleanupConfirmed(event.target.checked)}>
              I reviewed this preview and understand these log files will be permanently deleted.
            </Checkbox>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SystemLogs;
