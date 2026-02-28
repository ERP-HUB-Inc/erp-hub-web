import React from "react"

export function LogoTextOnly({ collapsed = false }) {
  return (
    <>
      <style>{`
        :root {
          --primary-color: #14b8a6;
          --secondary-light-teal: #7dd3fc;
          --secondary-cyan: #06b6d4;
        }

        .logo-sider {
          display: flex;
          align-items: center;
          height: 64px;
          padding: 0 16px;
          background-color: #001529;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logo-text-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1.2;
        }
        
        .company-name {
          font-size: 1.2rem;
          font-weight: bold;
          letter-spacing: 0.05em;
          color: var(--primary-color);
          margin: 0;
          white-space: nowrap;
        }
        
        .slogan {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--secondary-cyan);
          margin: 0;
          margin-top: 2px;
          white-space: nowrap;
        }
        
        .logo-collapsed {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 64px;
          padding: 0 8px;
          background-color: #001529;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logo-icon {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
          margin: 0;
        }
      `}</style>
      
      {collapsed ? (
        <div className="logo-collapsed">
          <h1 className="logo-icon">ERP</h1>
        </div>
      ) : (
        <div className="logo-sider">
          <div className="logo-text-wrapper">
            <h1 className="company-name">MARKETCHAIN ERP</h1>
            <p className="slogan">LOCAL. SMART. CONNECTED</p>
          </div>
        </div>
      )}
    </>
  );
}