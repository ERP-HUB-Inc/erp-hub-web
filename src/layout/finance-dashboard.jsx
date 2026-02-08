import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

const StatCard = ({ title, value, subtitle, change, icon, colorClass }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${colorClass}`}>{icon}</div>
      {change && (
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const CustomCard = ({ title, description, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
    <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
      {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
    <div className="flex-1 p-6 min-h-[450px]">{children}</div>
  </div>
);

const generateSalesData = () => {
  const start = new Date();
  start.setDate(start.getDate() - 29);

  return Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const revenue = Math.floor(Math.random() * 5000) + 2000;
    const discount = Math.floor(revenue * (Math.random() * 0.15 + 0.05));
    const netSales = revenue - discount;
    const expense = Math.floor(netSales * (Math.random() * 0.4 + 0.3));
    const profit = netSales - expense;

    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: d.toISOString().split("T")[0],
      revenue,
      discount,
      netSales,
      expense,
      profit,
      netProfit: profit,
    };
  });
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4">
      <p className="font-bold text-gray-900 mb-3 pb-2 border-b">
        {data.fullDate}
      </p>
      <div className="space-y-2">
        <div className="flex justify-between gap-8">
          <span className="text-sm text-gray-600">Revenue:</span>
          <span className="font-semibold text-blue-600">
            ${data.revenue?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-sm text-gray-600">Discount:</span>
          <span className="font-semibold text-red-600">
            -${data.discount?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between gap-8 pt-2 border-t">
          <span className="text-sm font-medium text-gray-700">Net Sales:</span>
          <span className="font-bold text-green-600">
            ${data.netSales?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between gap-8">
          <span className="text-sm text-gray-600">Expense:</span>
          <span className="font-semibold text-orange-600">
            -${data.expense?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between gap-8 pt-2 border-t">
          <span className="text-sm font-medium text-gray-700">Profit:</span>
          <span className="font-bold text-purple-600">
            ${data.profit?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const SalesDashboard = () => {
  const data = useMemo(() => generateSalesData(), []);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalDiscount = data.reduce((sum, item) => sum + item.discount, 0);
  const totalNetSales = data.reduce((sum, item) => sum + item.netSales, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);

  const profitMargin = ((totalProfit / totalNetSales) * 100).toFixed(1);
  const discountRate = ((totalDiscount / totalRevenue) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Last 30 days performance overview
          </p>
        </div>

        {/* Stats Grid - Better spacing on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000).toFixed(1)}k`}
            subtitle="Gross sales before discounts"
            change={8.2}
            icon={<DollarSign className="w-6 h-6 text-blue-600" />}
            colorClass="bg-blue-50"
          />
          <StatCard
            title="Total Discounts"
            value={`$${(totalDiscount / 1000).toFixed(1)}k`}
            subtitle={`${discountRate}% of revenue`}
            change={-2.4}
            icon={<TrendingDown className="w-6 h-6 text-red-600" />}
            colorClass="bg-red-50"
          />
          <StatCard
            title="Net Sales"
            value={`$${(totalNetSales / 1000).toFixed(1)}k`}
            subtitle="Revenue after discounts"
            change={6.8}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            colorClass="bg-green-50"
          />
          <StatCard
            title="Total Expenses"
            value={`$${(totalExpense / 1000).toFixed(1)}k`}
            subtitle="Operating costs"
            change={3.1}
            icon={<TrendingDown className="w-6 h-6 text-orange-600" />}
            colorClass="bg-orange-50"
          />
          <StatCard
            title="Gross Profit"
            value={`$${(totalProfit / 1000).toFixed(1)}k`}
            subtitle="Before tax and interest"
            change={12.5}
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            colorClass="bg-purple-50"
          />
          <StatCard
            title="Profit Margin"
            value={`${profitMargin}%`}
            subtitle="Net profit percentage"
            change={4.3}
            icon={<Percent className="w-6 h-6 text-green-600" />}
            colorClass="bg-green-50"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue vs Net Sales */}
          <CustomCard
            title="Revenue & Net Sales"
            description="Impact of discounts on revenue"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="netSalesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  interval={4}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="netSales"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#netSalesGradient)"
                  name="Net Sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CustomCard>

          {/* Profit Analysis */}
          <CustomCard
            title="Profit Analysis"
            description="Net sales vs expenses and resulting profit"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
              >
                <defs>
                  <linearGradient
                    id="profitGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  interval={4}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="netSales"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Net Sales"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  name="Expense"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#profitGradient)"
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
