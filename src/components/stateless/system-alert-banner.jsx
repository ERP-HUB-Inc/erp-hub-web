import React, { Component } from 'react';
import { Alert, Icon, Button } from 'antd';
import styled from 'styled-components';

const AlertWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  
  .ant-alert {
    border-radius: 0;
    border: none;
    padding: 0;
    font-size: 14px;
    margin: 0;
    
    &.animated {
      animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .alert-inner {
    padding: 16px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .alert-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
  }
  
  .alert-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    flex-shrink: 0;
  }
  
  .alert-icon {
    font-size: 20px;
  }
  
  .alert-content {
    flex: 1;
    min-width: 0;
  }
  
  .alert-title {
    font-weight: 600;
    font-size: 15px;
    line-height: 1.4;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }
  
  .alert-description {
    font-size: 13px;
    line-height: 1.5;
    opacity: 0.92;
    letter-spacing: -0.01em;
  }
  
  .alert-right {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-shrink: 0;
  }
  
  .alert-countdown {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }
  
  .alert-link-btn {
    height: 32px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 13px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-1px);
    }
  }
  
  .alert-close-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 14px;
    
    &:hover {
      transform: scale(1.1);
    }
  }

  /* Maintenance Theme */
  &.theme-maintenance {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15);
    
    .alert-icon-wrapper {
      background: rgba(251, 191, 36, 0.15);
      color: #d97706;
    }
    
    .alert-title, .alert-description {
      color: #78350f;
    }
    
    .alert-countdown {
      background: rgba(251, 191, 36, 0.2);
      color: #92400e;
    }
    
    .alert-link-btn {
      background: #fbbf24;
      border-color: #fbbf24;
      color: #78350f;
      
      &:hover {
        background: #f59e0b;
        border-color: #f59e0b;
        color: #78350f;
      }
    }
    
    .alert-close-btn {
      background: rgba(251, 191, 36, 0.15);
      color: #92400e;
      
      &:hover {
        background: rgba(251, 191, 36, 0.25);
      }
    }
  }

  /* Incident Theme */
  &.theme-incident {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    
    .alert-icon-wrapper {
      background: rgba(239, 68, 68, 0.15);
      color: #dc2626;
    }
    
    .alert-title, .alert-description {
      color: #7f1d1d;
    }
    
    .alert-countdown {
      background: rgba(239, 68, 68, 0.15);
      color: #991b1b;
    }
    
    .alert-link-btn {
      background: #ef4444;
      border-color: #ef4444;
      color: #fff;
      
      &:hover {
        background: #dc2626;
        border-color: #dc2626;
        color: #fff;
      }
    }
    
    .alert-close-btn {
      background: rgba(239, 68, 68, 0.15);
      color: #991b1b;
      
      &:hover {
        background: rgba(239, 68, 68, 0.25);
      }
    }
  }

  /* Announcement Theme - Using Your Brand Colors */
  &.theme-announcement {
    background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.15);
    
    .alert-icon-wrapper {
      background: rgba(20, 184, 166, 0.15);
      color: #14b8a6;
    }
    
    .alert-title, .alert-description {
      color: #134e4a;
    }
    
    .alert-countdown {
      background: rgba(20, 184, 166, 0.15);
      color: #115e59;
    }
    
    .alert-link-btn {
      background: #14b8a6;
      border-color: #14b8a6;
      color: #fff;
      
      &:hover {
        background: #0d9488;
        border-color: #0d9488;
        color: #fff;
      }
    }
    
    .alert-close-btn {
      background: rgba(20, 184, 166, 0.15);
      color: #115e59;
      
      &:hover {
        background: rgba(20, 184, 166, 0.25);
      }
    }
  }

  /* Success Theme */
  &.theme-success {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    
    .alert-icon-wrapper {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
    
    .alert-title, .alert-description {
      color: #064e3b;
    }
    
    .alert-countdown {
      background: rgba(16, 185, 129, 0.15);
      color: #065f46;
    }
    
    .alert-link-btn {
      background: #10b981;
      border-color: #10b981;
      color: #fff;
      
      &:hover {
        background: #059669;
        border-color: #059669;
        color: #fff;
      }
    }
    
    .alert-close-btn {
      background: rgba(16, 185, 129, 0.15);
      color: #065f46;
      
      &:hover {
        background: rgba(16, 185, 129, 0.25);
      }
    }
  }

  /* Critical Theme */
  &.theme-critical {
    background: linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
    border-bottom: 3px solid #dc2626;
    
    .alert-icon-wrapper {
      background: rgba(220, 38, 38, 0.15);
      color: #dc2626;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .7;
      }
    }
    
    .alert-title, .alert-description {
      color: #7f1d1d;
    }
    
    .alert-countdown {
      background: rgba(220, 38, 38, 0.2);
      color: #991b1b;
      font-weight: 700;
    }
    
    .alert-link-btn {
      background: #dc2626;
      border-color: #dc2626;
      color: #fff;
      
      &:hover {
        background: #b91c1c;
        border-color: #b91c1c;
        color: #fff;
      }
    }
    
    .alert-close-btn {
      background: rgba(220, 38, 38, 0.15);
      color: #991b1b;
      
      &:hover {
        background: rgba(220, 38, 38, 0.25);
      }
    }
  }

  /* Info Theme - Using Secondary Color */
  &.theme-info {
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
    
    .alert-icon-wrapper {
      background: rgba(6, 182, 212, 0.15);
      color: #06b6d4;
    }
    
    .alert-title, .alert-description {
      color: #164e63;
    }
    
    .alert-countdown {
      background: rgba(6, 182, 212, 0.15);
      color: #155e75;
    }
    
    .alert-link-btn {
      background: #06b6d4;
      border-color: #06b6d4;
      color: #fff;
      
      &:hover {
        background: #0891b2;
        border-color: #0891b2;
        color: #fff;
      }
    }
    
    .alert-close-btn {
      background: rgba(6, 182, 212, 0.15);
      color: #155e75;
      
      &:hover {
        background: rgba(6, 182, 212, 0.25);
      }
    }
  }
`;

class SystemAlertBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      countdown: null
    };
  }

  componentDidMount() {
    if (this.props.countdownTo) {
      this.startCountdown();
    }
  }

  componentWillUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown = () => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetTime = new Date(this.props.countdownTo).getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        this.setState({ countdown: 'In Progress' });
        clearInterval(this.countdownInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let countdownText = '';
      if (days > 0) countdownText += `${days}d `;
      if (hours > 0 || days > 0) countdownText += `${String(hours).padStart(2, '0')}h `;
      countdownText += `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

      this.setState({ countdown: countdownText.trim() });
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
  };

  handleClose = () => {
    this.setState({ visible: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  getAlertConfig = () => {
    const { type } = this.props;
    
    const configs = {
      maintenance: {
        icon: 'tool',
        defaultTitle: 'Scheduled Maintenance',
        defaultMessage: 'System maintenance is scheduled. Some features may be temporarily unavailable.'
      },
      incident: {
        icon: 'warning',
        defaultTitle: 'Service Disruption',
        defaultMessage: 'We are experiencing technical difficulties. Our team is actively working on a resolution.'
      },
      announcement: {
        icon: 'notification',
        defaultTitle: 'System Announcement',
        defaultMessage: 'Important update regarding system features and services.'
      },
      success: {
        icon: 'check-circle',
        defaultTitle: 'Update Complete',
        defaultMessage: 'System has been successfully updated with new features and improvements.'
      },
      critical: {
        icon: 'exclamation-circle',
        defaultTitle: 'Critical System Alert',
        defaultMessage: 'Immediate attention required. Please review the details below.'
      },
      info: {
        icon: 'info-circle',
        defaultTitle: 'Information',
        defaultMessage: 'General system information and updates.'
      }
    };

    return configs[type] || configs.announcement;
  };

  render() {
    if (!this.state.visible) return null;

    const { 
      type, 
      title, 
      message, 
      link, 
      linkText, 
      showCountdown, 
      closable 
    } = this.props;
    
    const { countdown } = this.state;
    const config = this.getAlertConfig();

    return (
      <AlertWrapper className={`theme-${type}`}>
        <div className="animated">
          <div className="alert-inner">
            <div className="alert-left">
              <div className="alert-icon-wrapper">
                <Icon type={config.icon} className="alert-icon" />
              </div>
              
              <div className="alert-content">
                <div className="alert-title">
                  {title || config.defaultTitle}
                </div>
                <div className="alert-description">
                  {message || config.defaultMessage}
                </div>
              </div>
            </div>
            
            <div className="alert-right">
              {showCountdown && countdown && (
                <div className="alert-countdown">
                  <Icon type="clock-circle" />
                  <span>{countdown}</span>
                </div>
              )}
              
              {link && (
                <Button 
                  className="alert-link-btn"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkText || 'Learn More'}
                  <Icon type="arrow-right" />
                </Button>
              )}
              
              {closable !== false && (
                <button 
                  className="alert-close-btn"
                  onClick={this.handleClose}
                  aria-label="Close alert"
                >
                  <Icon type="close" />
                </button>
              )}
            </div>
          </div>
        </div>
      </AlertWrapper>
    );
  }
}

SystemAlertBanner.defaultProps = {
  type: 'announcement',
  closable: true,
  showCountdown: false
};

export default SystemAlertBanner;

/* ============================================
   USAGE EXAMPLES
   ============================================ */

// Example 1: Maintenance with Countdown (Yellow/Amber)
/*
<SystemAlertBanner
  type="maintenance"
  title="Scheduled System Maintenance"
  message="Our system will undergo maintenance on Oct 10, 2025 from 2:00 AM to 4:00 AM UTC. Services will be temporarily unavailable during this period."
  countdownTo="2025-10-10T02:00:00Z"
  showCountdown={true}
  link="https://status.yourcompany.com"
  linkText="View Status Page"
/>
*/

// Example 2: Critical Incident (Red with pulse animation)
/*
<SystemAlertBanner
  type="incident"
  title="Payment Processing Unavailable"
  message="We are currently experiencing issues with payment processing. Our engineering team is actively working on a fix. We apologize for any inconvenience."
  link="https://status.yourcompany.com/incident/123"
  linkText="View Incident Details"
  closable={false}
/>
*/

// Example 3: Announcement (Your Brand Teal Color)
/*
<SystemAlertBanner
  type="announcement"
  title="New Inventory Features Released"
  message="We've added powerful new inventory tracking and reporting capabilities to help streamline your operations."
  link="/features/inventory"
  linkText="Explore Features"
/>
*/

// Example 4: Success Update (Green)
/*
<SystemAlertBanner
  type="success"
  title="System Update Complete"
  message="All services have been successfully updated and are now running the latest version with enhanced performance."
/>
*/

// Example 5: Critical Alert (Dark Red, non-closable, pulsing)
/*
<SystemAlertBanner
  type="critical"
  title="Security Alert: Immediate Action Required"
  message="Suspicious activity detected. Please change your password immediately and enable two-factor authentication."
  link="/security/settings"
  linkText="Update Security Settings"
  closable={false}
/>
*/

// Example 6: Info (Cyan/Sky Blue)
/*
<SystemAlertBanner
  type="info"
  title="Platform Update"
  message="We've made improvements to system performance and reliability based on your feedback."
  link="/changelog"
  linkText="View Changelog"
/>
*/