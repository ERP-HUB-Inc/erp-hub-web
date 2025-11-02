import React, { useEffect, useState } from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

const { SubMenu } = Menu;

// --- Helper: Dynamic icon resolver with fallback ---
const getIcon = (iconName, fallbackType) => {
  const IconComponent = LucideIcons[iconName];
  if (IconComponent) {
    return <IconComponent className="w-4 h-4 text-blue-500" />;
  }
  if (fallbackType) {
    return <Icon type={fallbackType} />;
  }
  return null;
};

// --- Filter menu by business type & size ---
const filterByBusiness = (menu, type, size) => {
  const matchType = menu.businessType?.includes("all") || menu.businessType?.includes(type);
  const matchSize = menu.businessSize?.includes("all") || menu.businessSize?.includes(size);
  return matchType && matchSize;
};

// --- Recursive render menu with fallback icons ---
const renderMenu = (menus, businessType, businessSize, lang) =>
  menus
    .filter(menu => filterByBusiness(menu, businessType, businessSize))
    .map(menu => {
      if (menu.children) {
        return (
          <SubMenu
            key={menu.key}
            title={
              <span>
                {getIcon(menu.icon, menu.fallbackIcon)}
                <span>{menu.label[lang]}</span>
              </span>
            }
          >
            {renderMenu(menu.children, businessType, businessSize, lang)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={menu.key}>
          <Link to={menu.path}>
            {getIcon(menu.icon, menu.fallbackIcon)}
            <span>{menu.label[lang]}</span>
          </Link>
        </Menu.Item>
      );
    });

// --- Main DynamicMenu Component ---
const DynamicMenu = ({ lang = "en", businessType = "sme", businessSize = "medium", theme = "light" }) => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    // Fetch menu JSON from Cloudflare CDN or local file
    fetch("https://pub-3d61a145cac44e12be145181ff81b9df.r2.dev/config/erp-hub/config/menu.json")
      .then(res => res.json())
      .then(data => setMenuData(data.menus))
      .catch(console.error);
  }, []);

  // If JSON fails or empty, fallback to hardcoded AntD menu
  if (!menuData || menuData.length === 0) {
    return (
      <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Link>
        </Menu.Item>

        <SubMenu
          key="2"
          title={
            <span>
              <Icon type="dollar" />
              <span>Sales</span>
            </span>
          }
        >
          <Menu.Item key="21"><Link to="/sales-orders">Orders</Link></Menu.Item>
          <Menu.Item key="22"><Link to="/quotes">Quotes</Link></Menu.Item>
          <Menu.Item key="23"><Link to="/invoices">Invoices</Link></Menu.Item>
          <Menu.Item key="24"><Link to="/customers">Customers</Link></Menu.Item>
        </SubMenu>

        <SubMenu
          key="3"
          title={
            <span>
              <Icon type="shopping" />
              <span>Purchasing</span>
            </span>
          }
        >
          <Menu.Item key="31"><Link to="/purchase-orders">Orders</Link></Menu.Item>
          <Menu.Item key="32"><Link to="/rfps">RFPs</Link></Menu.Item>
          <Menu.Item key="33"><Link to="/vendors">Vendors</Link></Menu.Item>
        </SubMenu>

        <SubMenu
          key="4"
          title={
            <span>
              <Icon type="inbox" />
              <span>Inventory</span>
            </span>
          }
        >
          <Menu.Item key="41"><Link to="/inventories/items">Items</Link></Menu.Item>
          <Menu.Item key="42"><Link to="/inventories/stock-io">Stock In/Out</Link></Menu.Item>
          <Menu.Item key="43"><Link to="/inventories/transfers">Transfers</Link></Menu.Item>
          <Menu.Item key="44"><Link to="/inventories/adjustments">Adjustment</Link></Menu.Item>
        </SubMenu>

        <SubMenu
          key="5"
          title={
            <span>
              <Icon type="bank" />
              <span>Finance</span>
            </span>
          }
        >
          <Menu.Item key="51"><Link to="/general-ledger">General Ledger (GL)</Link></Menu.Item>
          <Menu.Item key="52"><Link to="/accounts-receivable">Accounts Receivable (AR)</Link></Menu.Item>
          <Menu.Item key="53"><Link to="/accounts-payable">Accounts Payable (AP)</Link></Menu.Item>
        </SubMenu>

        <SubMenu
          key="6"
          title={
            <span>
              <Icon type="bar-chart" />
              <span>Report</span>
            </span>
          }
        >
          <Menu.Item key="61"><Link to="/reports/sales-report-center">Sales Report</Link></Menu.Item>
          <Menu.Item key="62"><Link to="/reports/purchase">Purchase Report</Link></Menu.Item>
          <Menu.Item key="63"><Link to="/reports/stock">Stock Report</Link></Menu.Item>
          <Menu.Item key="64"><Link to="/reports/product">Product Report</Link></Menu.Item>
          <Menu.Item key="65"><Link to="/reports/financial">Financial Reports</Link></Menu.Item>
        </SubMenu>

        <Menu.Item key="7">
          <Link to="/settings">
            <Icon type="setting" />
            <span>Settings</span>
          </Link>
        </Menu.Item>
      </Menu>
    );
  }

  // Render dynamic JSON menu with Lucide + fallback
  return (
    <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']}>
      {renderMenu(menuData, businessType, businessSize, lang)}
    </Menu>
  );
};

export default DynamicMenu;
