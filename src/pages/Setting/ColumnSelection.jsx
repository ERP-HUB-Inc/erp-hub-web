import React, { useState, useCallback } from 'react';
import { Table, Button, Popover, Checkbox, Divider, message, Icon } from 'antd';

const ColumnSelection = () => {
  // Sample data
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      email: 'john@example.com',
      phone: '123-456-7890',
      department: 'Engineering',
      salary: 75000,
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      email: 'jim@example.com',
      phone: '123-456-7891',
      department: 'Marketing',
      salary: 65000,
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      email: 'joe@example.com',
      phone: '123-456-7892',
      department: 'Sales',
      salary: 70000,
    },
    {
      key: '4',
      name: 'Jane Smith',
      age: 28,
      address: 'Boston No. 2 Lake Park',
      email: 'jane@example.com',
      phone: '123-456-7893',
      department: 'HR',
      salary: 60000,
    },
  ]);

  // Loading state for refresh
  const [loading, setLoading] = useState(false);

  // All available columns definition
  const defaultColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      width: 100,
      render: (value) => `$${value.toLocaleString()}`,
    },
  ];

  // State for column order and visibility
  const [columnOrder, setColumnOrder] = useState(
    defaultColumns.map(col => col.key)
  );
  const [visibleColumns, setVisibleColumns] = useState(
    defaultColumns.map(col => col.key)
  );

  // Drag and drop states
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  // Get ordered columns based on current order
  const getOrderedColumns = useCallback(() => {
    const columnMap = {};
    defaultColumns.forEach(col => {
      columnMap[col.key] = col;
    });
    
    return columnOrder.map(key => columnMap[key]).filter(Boolean);
  }, [columnOrder]);

  // Handle column visibility toggle
  const handleColumnToggle = (columnKey, checked) => {
    if (checked) {
      setVisibleColumns([...visibleColumns, columnKey]);
    } else {
      // Prevent hiding all columns
      if (visibleColumns.length > 1) {
        setVisibleColumns(visibleColumns.filter(key => key !== columnKey));
      }
    }
  };

  // Handle select all/none
  const handleSelectAll = (checked) => {
    if (checked) {
      setVisibleColumns(columnOrder.slice());
    } else {
      // Keep at least one column visible (first in order)
      setVisibleColumns([columnOrder[0]]);
    }
  };

  // Reset to default columns and order
  const handleReset = () => {
    setColumnOrder(defaultColumns.map(col => col.key));
    setVisibleColumns(['name', 'age', 'address', 'email']);
  };

  // Drag handlers
  const handleDragStart = (e, columnKey) => {
    setDraggedItem(columnKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', columnKey);
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(columnKey);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, targetColumnKey) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetColumnKey) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetColumnKey);

    // Remove dragged item and insert at new position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    setColumnOrder(newOrder);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Refresh data function
  const handleRefresh = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In real application, you would fetch fresh data from API
      const refreshedData = dataSource.map(item => ({
        ...item,
        // Add some random variation to show refresh worked
        salary: item.salary + Math.floor(Math.random() * 2000) - 1000,
      }));
      
      setDataSource(refreshedData);
      setLoading(false);
      message.success('Data refreshed successfully');
    }, 1000);
  };

  // Get ordered and filtered columns
  const orderedColumns = getOrderedColumns();
  const displayColumns = orderedColumns.filter(col => 
    visibleColumns.includes(col.key)
  );

  // Column selector content
  const columnSelectorContent = (
    <div style={{ width: 280, maxHeight: 400, overflow: 'auto' }}>
      <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
        <Checkbox
          checked={visibleColumns.length === columnOrder.length}
          indeterminate={
            visibleColumns.length > 0 && visibleColumns.length < columnOrder.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Select All
        </Checkbox>
        <Button 
          type="link" 
          size="small" 
          onClick={handleReset}
          style={{ float: 'right', padding: 0 }}
        >
          Reset
        </Button>
      </div>
      
      <div style={{ padding: '8px 0' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginBottom: '8px',
          fontWeight: 'bold' 
        }}>
          Drag to reorder columns:
        </div>
        
        {columnOrder.map((columnKey, index) => {
          const column = defaultColumns.find(col => col.key === columnKey);
          const isDragging = draggedItem === columnKey;
          const isDragOver = dragOverItem === columnKey;
          
          return (
            <div 
              key={columnKey} 
              draggable
              onDragStart={(e) => handleDragStart(e, columnKey)}
              onDragOver={(e) => handleDragOver(e, columnKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, columnKey)}
              style={{ 
                padding: '6px 8px',
                margin: '2px 0',
                backgroundColor: isDragOver ? '#e6f7ff' : (isDragging ? '#f0f0f0' : 'transparent'),
                border: isDragOver ? '2px dashed #1890ff' : '2px solid transparent',
                borderRadius: '4px',
                cursor: 'move',
                opacity: isDragging ? 0.5 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  marginRight: '8px', 
                  color: '#999', 
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  ⋮⋮
                </span>
                <Checkbox
                  checked={visibleColumns.includes(columnKey)}
                  onChange={(e) => handleColumnToggle(columnKey, e.target.checked)}
                  disabled={columnKey === columnOrder[0] && visibleColumns.length === 1}
                  onClick={(e) => e.stopPropagation()}
                >
                  {column?.title}
                </Checkbox>
              </div>
              <span style={{ fontSize: '12px', color: '#999' }}>
                #{index + 1}
              </span>
            </div>
          );
        })}
      </div>
      
      <Divider style={{ margin: '8px 0' }} />
      <div style={{ fontSize: '12px', color: '#999' }}>
        Selected: {visibleColumns.length} of {columnOrder.length} columns
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h2>Employee Data Table</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            onClick={handleRefresh} 
            loading={loading}
            icon="reload"
            title="Refresh Data"
          />
          <Popover
            content={columnSelectorContent}
            title="Column Settings"
            trigger="click"
            placement="bottomRight"
          >
            <Button 
              icon="setting"
              title={`Column Options (${visibleColumns.length})`}
            />
          </Popover>
        </div>
      </div>

      <Table
        dataSource={dataSource}
        columns={displayColumns}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 'max-content' }}
        size="middle"
        bordered
      />

      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Features:</strong>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
          <li><strong>Refresh Data:</strong> Click the reload icon to refresh table content</li>
          <li><strong>Column Settings:</strong> Click the settings icon to show/hide columns</li>
          <li><strong>Drag to Reorder:</strong> Drag columns in the settings panel to change their order</li>
          <li><strong>Select All:</strong> Toggle all columns at once</li>
          <li><strong>Reset:</strong> Restore default column order and selection</li>
          <li><strong>Protection:</strong> At least one column must remain visible</li>
        </ul>
      </div>
    </div>
  );
};

export { ColumnSelection };