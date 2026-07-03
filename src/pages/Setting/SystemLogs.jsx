import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Icon,
  Dropdown,
  Menu,
  message,
  Modal,
} from 'antd';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DEFAULT_LEVELS = ['info', 'error', 'warning'];

const SystemLogs = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedLevels, setSelectedLevels] = useState(DEFAULT_LEVELS);
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const apiBaseUrl = useMemo(() => {
    const host = process.env.REACT_APP_API_HOST || 'http://localhost';
    const port = process.env.REACT_APP_API_PORT || '3080';
    return `${host}:${port}`;
  }, []);

  const getLevelColor = (level) => {
    switch (String(level || '').toUpperCase()) {
      case 'ERROR':
        return '#f5222d';
      case 'WARNING':
        return '#faad14';
      case 'INFO':
        return '#1890ff';
      default:
        return '#d9d9d9';
    }
  };

  const normalizeLogRow = (item) => ({
    ...item,
    key: `${item.fileName || 'log'}-${item.lineNumber || 0}-${item.timestampMs || item.timestamp || item.date || 'row'}`,
  });

  const buildQueryParams = (page = pagination.current, pageSize = pagination.pageSize, nextSearchText = searchText, nextLevels = selectedLevels, nextDateRange = dateRange) => {
    const params = new URLSearchParams();
    const trimmedSearch = String(nextSearchText || '').trim();
    const safeDateRange = Array.isArray(nextDateRange) ? nextDateRange : [];

    if (trimmedSearch) {
      params.set('search', trimmedSearch);
    }

    if (Array.isArray(nextLevels) && nextLevels.length > 0) {
      params.set('levels', nextLevels.join(','));
    }

    if (safeDateRange[0]) {
      params.set('dateFrom', safeDateRange[0].format('YYYY-MM-DD'));
    }

    if (safeDateRange[1]) {
      params.set('dateTo', safeDateRange[1].format('YYYY-MM-DD'));
    }

    params.set('limit', String(pageSize));
    params.set('offset', String((page - 1) * pageSize));

    return params;
  };

  const fetchLogs = async (options = {}) => {
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

    const params = buildQueryParams(nextPage, nextPageSize, nextSearchText, nextLevels, nextDateRange);

    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/logs/v1/search?${params.toString()}`);
      const responseData = response?.data || {};
      const nextLogs = Array.isArray(responseData.data) ? responseData.data.map(normalizeLogRow) : [];
      const nextPagination = responseData.pagination || {};

      setLogs(nextLogs);
      setPagination({
        current: nextPagination.current || nextPage,
        pageSize: nextPagination.limit || nextPageSize,
        total: nextPagination.total || 0,
      });
      setSelectedRowKeys([]);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load system logs';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs({ page: 1 });
  }, []);

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

  const handleTableChange = (nextPagination) => {
    fetchLogs({
      page: nextPagination.current,
      pageSize: nextPagination.pageSize,
    });
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
        Modal.info({
          title: `${record.level || 'LOG'} - ${record.timestamp || ''}`,
          width: 900,
          content: (
            <div style={{ wordBreak: 'break-word' }}>
              <div style={{ marginBottom: 12 }}>
                <strong>File:</strong> {record.fileName || '-'}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Line:</strong> {record.lineNumber || '-'}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Message:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{record.message || '-'}</pre>
              </div>
              <div>
                <strong>Raw:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{record.raw || '-'}</pre>
              </div>
            </div>
          ),
        });
        break;
      case 'copy':
        copyText(record.raw || record.message || '');
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
    const content = selectedLogs.map((item) => item.raw || item.message || '').filter(Boolean).join('\n\n');
    copyText(content);
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp, record) => (
        <div style={{ fontSize: '13px', color: '#595959' }}>
          <div>{timestamp || '-'}</div>
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
            {record.date || '-'}
          </div>
        </div>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 110,
      render: (level) => (
        <Tag
          color={getLevelColor(level)}
          style={{ fontSize: '11px', fontWeight: 500 }}
        >
          {String(level || '-').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'File',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 180,
      render: (fileName) => (
        <span style={{ fontSize: '13px', color: '#262626' }}>
          {fileName || '-'}
        </span>
      ),
    },
    {
      title: 'Line',
      dataIndex: 'lineNumber',
      key: 'lineNumber',
      width: 90,
      render: (lineNumber) => (
        <span style={{ fontSize: '13px', color: '#595959' }}>
          {lineNumber ?? '-'}
        </span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (messageText, record) => (
        <div>
          <div style={{ fontSize: '14px', color: '#262626', marginBottom: '4px' }}>
            {messageText || '-'}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', wordBreak: 'break-word' }}>
            {record.raw || '-'}
          </div>
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => handleRowAction(key, record)}>
              <Menu.Item key="view">
                <Icon type="eye" /> View Details
              </Menu.Item>
              <Menu.Item key="copy">
                <Icon type="copy" /> Copy Log
              </Menu.Item>
              <Menu.Item key="export">
                <Icon type="download" /> Export
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="link" icon="more" style={{ color: '#8c8c8c' }} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (nextSelectedRowKeys) => {
      setSelectedRowKeys(nextSelectedRowKeys);
    },
  };

  const logStats = useMemo(() => {
    const total = pagination.total || 0;
    const infoCount = logs.filter((item) => String(item.level || '').toUpperCase() === 'INFO').length;
    const warningCount = logs.filter((item) => String(item.level || '').toUpperCase() === 'WARNING').length;
    const errorCount = logs.filter((item) => String(item.level || '').toUpperCase() === 'ERROR').length;

    return {
      total,
      infoCount,
      warningCount,
      errorCount,
    };
  }, [logs, pagination.total]);

  return (
    <div
      style={{
        padding: '32px 40px',
        backgroundColor: '#fafafa',
        minHeight: '100vh',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 500,
                margin: 0,
                color: '#262626',
              }}
            >
              System Activity Logs
            </h1>
            <p style={{ color: '#8c8c8c', margin: '8px 0 0' }}>
              Search system logs by keyword, level, and date range
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button icon="download" onClick={handleExportSelected} disabled={selectedRowKeys.length === 0}>
              Export Selected
            </Button>
            <Button icon="copy" onClick={handleCopySelected} disabled={selectedRowKeys.length === 0}>
              Copy Selected
            </Button>
            <Button type="primary" icon="sync" onClick={() => fetchLogs({ page: pagination.current })} loading={loading}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Results"
              value={logStats.total}
              prefix={<Icon type="file-text" style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Info"
              value={logStats.infoCount}
              prefix={<Icon type="info-circle" style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Warnings"
              value={logStats.warningCount}
              prefix={<Icon type="exclamation-circle" style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Errors"
              value={logStats.errorCount}
              prefix={<Icon type="close-circle" style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <span style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#595959' }}>
              Search
            </span>
            <Search
              placeholder="Search logs..."
              style={{ width: 240 }}
              allowClear
              value={searchText}
              onSearch={handleSearch}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <div>
            <span style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#595959' }}>
              Log Level
            </span>
            <Select
              mode="multiple"
              value={selectedLevels}
              onChange={handleLevelsChange}
              style={{ width: 220 }}
              placeholder="Select levels"
              maxTagCount={3}
            >
              <Option value="info">Info</Option>
              <Option value="warning">Warning</Option>
              <Option value="error">Error</Option>
            </Select>
          </div>

          <div>
            <span style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#595959' }}>
              Date Range
            </span>
            <RangePicker
              style={{ width: 260 }}
              value={dateRange}
              onChange={handleDateRangeChange}
              allowClear
            />
          </div>

          <div>
            <Button type="primary" ghost onClick={() => fetchLogs({ page: 1 })} loading={loading}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {selectedRowKeys.length > 0 && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            backgroundColor: '#e6f7ff',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: '#1890ff' }}>
            {selectedRowKeys.length} log(s) selected
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button size="small" icon="download" onClick={handleExportSelected}>
              Export Selected
            </Button>
            <Button size="small" icon="copy" onClick={handleCopySelected}>
              Copy Selected
            </Button>
          </div>
        </div>
      )}

      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={logs}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} logs`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          size="middle"
          scroll={{ x: 1150 }}
          rowClassName={(record) => {
            if (String(record.level || '').toUpperCase() === 'ERROR') return 'log-row-error';
            if (String(record.level || '').toUpperCase() === 'WARNING') return 'log-row-warning';
            return '';
          }}
        />
      </Card>

      <style jsx>{`
        .log-row-error {
          background-color: #fff2f0 !important;
        }
        .log-row-warning {
          background-color: #fffbe6 !important;
        }
      `}</style>
    </div>
  );
};

export default SystemLogs;
