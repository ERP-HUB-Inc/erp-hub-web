import React from 'react';
import { Tabs, Button, Tag, Icon, Input } from 'antd';
import { ListFilter } from 'lucide-react';
import SystemLogs from './SystemLogs';
import ModuleSettings from './ModuleSettings';
import './SettingPage.css';

const { TabPane } = Tabs;
const SETTING_TABS = ['general', 'modules', 'integration', 'backup', 'workflows', 'reports', 'logs'];

const ERPSettings = ({ history, location }) => {
  const [search, setSearch] = React.useState('');
  const searchRef = React.useRef(null);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const query = new URLSearchParams(location.search);
  const requestedTab = query.get('tab');
  const activeTab = SETTING_TABS.includes(requestedTab) ? requestedTab : 'general';

  React.useEffect(() => {
    const focusSearch = event => {
      if (event.key === '/' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    history.push({ pathname: location.pathname, search: params.toString() });
  };

  return (
    <div className="system-settings">
      <header className="settings-page-heading">
        <div>
          <h1>System Settings</h1>
          <p>Configure global preferences, business modules, workflow automation, and master ERP parameters.</p>
        </div>
        <Input
          ref={searchRef}
          className="settings-search"
          aria-label="Filter settings or toggles"
          placeholder="Filter settings or toggles…"
          prefix={<ListFilter size={18} aria-hidden="true" />}
          suffix={<kbd aria-hidden="true">{isMac ? '⌘/' : 'Ctrl+/'}</kbd>}
          value={search}
          onChange={event => {
            setSearch(event.target.value);
            if (activeTab !== 'modules') handleTabChange('modules');
          }}
        />
      </header>
      <Tabs className="settings-tabs" activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="General" key="general">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Company Information</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Configure your company details, time zones, and general ERP system preferences.
            </p>
            {/* General settings content */}
          </div>
        </TabPane>
        
        <TabPane tab="Modules" key="modules">
          {activeTab === 'modules' && <ModuleSettings search={search} onClearSearch={() => {
            setSearch('');
            if (searchRef.current) searchRef.current.focus();
          }} />}
        </TabPane>

        <TabPane tab="Integration & APIs" key="integration">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Third-Party Integrations</h3>
            <p style={{ color: '#595959', marginBottom: '32px' }}>
              Connect your ERP with Cambodia's leading payment gateways, banking systems, and delivery services for seamless business operations.
            </p>
            
            {/* Integration Categories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              
              {/* Payment Gateways */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="credit-card" style={{ color: '#52c41a' }} />
                  Payment Gateways
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Integrate with Cambodia's popular payment methods and gateways
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        AP
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>ABA PayWay</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Digital wallet & banking</div>
                      </div>
                    </div>
                    <Tag color="#52c41a" style={{ fontSize: '11px' }}>Connected</Tag>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#faad14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        PG
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Pi Pay</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Mobile payment solution</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#722ed1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        WM
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Wing Money</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Mobile financial services</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f5222d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        BC
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Bakong (NBC)</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>National payment system</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                </div>
              </div>

              {/* Banking Integration */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="bank" style={{ color: '#1890ff' }} />
                  Banking Systems
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Connect with major Cambodian banks for automated reconciliation
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ABA
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>ABA Bank</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Account reconciliation API</div>
                      </div>
                    </div>
                    <Tag color="#52c41a" style={{ fontSize: '11px' }}>Active</Tag>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#52c41a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        AC
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>ACLEDA Bank</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Corporate banking API</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Setup</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#faad14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        PP
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Prasac Bank</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Transaction monitoring</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Setup</Button>
                  </div>
                </div>
              </div>

              {/* Delivery Systems */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="car" style={{ color: '#faad14' }} />
                  Delivery & Logistics
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Integrate with local delivery services for order fulfillment
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f5222d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        NJ
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Nham24</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Food & package delivery</div>
                      </div>
                    </div>
                    <Tag color="#52c41a" style={{ fontSize: '11px' }}>Integrated</Tag>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#52c41a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        PD
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>PassApp Delivery</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>On-demand logistics</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        EX
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Express Mail Service</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Cambodia Post logistics</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#722ed1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        JT
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>J&T Express</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>International courier</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                </div>
              </div>

              {/* E-commerce Platforms */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="shop" style={{ color: '#722ed1' }} />
                  E-commerce Integration
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Sync with popular online marketplaces and platforms
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#fa8c16',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        SP
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Shopee</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Marketplace integration</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f5222d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        LZ
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Lazada</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Product & order sync</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        FB
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Facebook Shop</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Social commerce</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Quick Actions */}
            <div style={{ 
              marginTop: '32px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ marginBottom: '16px', color: '#262626' }}>Quick Actions</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button type="primary" ghost icon="api">
                  API Documentation
                </Button>
                <Button type="default" icon="setting">
                  Webhook Settings
                </Button>
                <Button type="default" icon="sync">
                  Sync All Data
                </Button>
                <Button type="default" icon="file-text">
                  Integration Logs
                </Button>
              </div>
            </div>
          </div>
        </TabPane>
        
        <TabPane tab="Backup & Security" key="backup">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Data Backup & Security</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Configure automated backups, data retention policies, and security settings for your ERP system.
            </p>
            {/* Backup and security content */}
          </div>
        </TabPane>
        
        <TabPane tab="Workflows & Automation" key="workflows">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Business Workflows</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Set up approval workflows, automated processes, and business rules for different modules.
            </p>
            {/* Workflow configuration content */}
          </div>
        </TabPane>
        
        <TabPane tab="Reports & Exports" key="reports">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Report Settings</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Configure report templates, scheduled reports, and dashboard settings for different user roles.
            </p>
            {/* Reports configuration content */}
          </div>
        </TabPane>
        
        <TabPane tab="System Logs & Audit" key="logs">
          {activeTab === 'logs' && <SystemLogs embedded history={history} location={location} />}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ERPSettings;
