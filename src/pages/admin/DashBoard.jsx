import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Package, ShoppingCart, IndianRupee, User, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#010101", "#262E36", "#646560", "#dbdad5", "#a9a9a9", "#808080", "#5c5c5c"];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await api.get("/admin/dashboard/stats");
        setStats(statsRes.data);

        const monthlyRes = await api.get("/admin/dashboard/revenue/monthly");
        setChartData(monthlyRes.data);

        const weeklyRes = await api.get("/admin/dashboard/revenue/weekly");
        setWeeklyData(weeklyRes.data);

        const ordersRes = await api.get("/admin/orders");
        // Get 4 most recent orders for display
        const latest = ordersRes.data.slice(0, 4).map(o => ({
          user: o.user?.username || "Guest",
          product: o.products[0]?.title || "Multiple Items",
          img: o.products[0]?.image || "",
          qty: o.products[0]?.quantity || 1,
          date: o.createdAt,
          price: o.totalPrice,
          status: o.orderStatus,
          paymentStatus: o.paymentStatus
        }));
        setRecent(latest);

      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#cfd4d6] text-[#2f2926] p-4 md:p-10 space-y-8">
      <h2 className="text-2xl font-bold uppercase tracking-tighter">Admin Dashboard</h2>
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#e1e3e2] p-4 rounded-xl shadow-sm border border-white flex gap-3 items-center">
          <Users size={24} className="text-gray-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Users</p>
            <p className="text-xl font-black">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-[#e1e3e2] p-4 rounded-xl shadow-sm border border-white flex gap-3 items-center">
          <Package size={24} className="text-gray-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Products</p>
            <p className="text-xl font-black">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="bg-[#e1e3e2] p-4 rounded-xl shadow-sm border border-white flex gap-3 items-center">
          <ShoppingCart size={24} className="text-gray-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Orders</p>
            <p className="text-xl font-black">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="bg-[#e1e3e2] p-4 rounded-xl shadow-sm border border-white flex gap-3 items-center">
          <IndianRupee size={24} className="text-gray-600" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Revenue</p>
            <p className="text-xl font-black">₹{stats.totalRevenue}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MONTHLY CHART */}
        <div className="lg:col-span-2 bg-[#e1e3e2] p-6 rounded-xl shadow-sm border border-white">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-600">Monthly Revenue (12 Months)</h3>
          <div className="w-full h-80 min-h-80" style={{ width: "100%", height: "320px" }}>
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="revenue" fill="#010101" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {chartData.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Loading chart...</div>
            )}
          </div>
        </div>

        {/* WEEKLY DONUT CHART */}
        <div className="bg-[#e1e3e2] p-6 rounded-xl shadow-sm border border-white">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-600">Weekly Revenue</h3>
          <div className="w-full h-80 min-h-80 flex justify-center items-center" style={{ width: "100%", height: "320px" }}>
            {weeklyData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weeklyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            {weeklyData.length === 0 && (
              <div className="text-gray-500">Loading chart...</div>
            )}
          </div>
        </div>
      </div>

      {/* LATEST ORDERS */}
      <div className="bg-[#e1e3e2] p-6 rounded-xl shadow-sm border border-white overflow-hidden">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-600">Latest Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Item</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order, idx) => {
                let imageUrl = order.img;
                if (imageUrl && !imageUrl.startsWith("http")) {
                  imageUrl = `http://127.0.0.1:8001/${imageUrl.replace(/^\//, "")}`;
                }

                return (
                  <tr key={idx} className="border-b border-gray-200/50 hover:bg-black/5 transition-colors">
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-xs">
                        {order.user.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold">{order.user}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {imageUrl && (
                          <img src={imageUrl} alt={order.product} className="w-8 h-10 object-cover rounded shadow-sm" />
                        )}
                        <span className="text-xs font-semibold">{order.product}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded ${
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                        'bg-black text-white'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-black">₹{order.price}</span>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
