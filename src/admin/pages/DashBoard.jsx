import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  User,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#010101", "#262E36", "#646560", "#dbdad5"];

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recent, setRecent] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const userRes = await axios.get("http://localhost:5000/users");
      const productRes = await axios.get("http://localhost:5000/products");

      setUsers(userRes.data);
      setProducts(productRes.data);

      const allOrders = [];
      const recentOrders = [];

      userRes.data.forEach((u) => {
        u.orders?.forEach((o) => {
          allOrders.push(o);

          o.items.forEach((i) => {
            recentOrders.push({
              user: u.name,
              product: i.title || i.name,
              qty: i.quantity,
              date: o.createdAt,
              price: i.price * i.quantity,
              status: o.status || "Pending",
            });
          });
        });
      });

      recentOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecent(recentOrders.slice(0, 4));
      setOrders(allOrders);

      const revenueMap = {};
      allOrders.forEach((o) => {
        if (o.status === "Cancelled") return;

        const month = new Date(o.createdAt).toLocaleString("default", {
          month: "short",
        });

        const total = o.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        revenueMap[month] = (revenueMap[month] || 0) + total;
      });

      setChartData(
        Object.keys(revenueMap).map((m) => ({
          name: m,
          value: revenueMap[m],
        }))
      );

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const weeklyRevenue = days.reduce((acc, d) => {
        acc[d] = 0;
        return acc;
      }, {});

      allOrders.forEach((o) => {
        if (o.status === "Cancelled") return;

        const day = new Date(o.createdAt).toLocaleDateString("en-US", {
          weekday: "short",
        });

        const total = o.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        if (weeklyRevenue[day] !== undefined) {
          weeklyRevenue[day] += total;
        }
      });

      setWeeklyData(
        days.map((d) => ({
          day: d,
          value: weeklyRevenue[d],
        }))
      );
    };

    loadData();
  }, []);

  const revenue = orders.reduce((sum, o) => {
    if (o.status === "Cancelled") return sum;
    return sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }, 0);

  const stats = [
    { label: "Users", value: users.length, icon: Users },
    { label: "Products", value: products.length, icon: Package },
    { label: "Orders", value: orders.length, icon: ShoppingCart },
    { label: "Revenue", value: `₹${revenue}`, icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen bg-[#cfd4d6] text-[#2f2926] p-20 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-[#e1e3e2] border border-white rounded-xl p-4 flex gap-3"
          >
            <s.icon size={22} />
            <div>
              <p className="text-sm">{s.label}</p>
              <p className="text-lg font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#e1e3e2] border border-[#cfd4d6] rounded-xl p-5 h-[300px]">
          <h3 className="mb-2 font-semibold">Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#e1e3e2] border border-[#cfd4d6] rounded-xl p-5 h-[300px]">
          <h3 className="mb-2 font-semibold">Weekly Revenue</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Bar dataKey="value" fill="#2f2926" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#e1e3e2] border border-[#cfd4d6] rounded-xl p-5">
        <h3 className="mb-4 font-semibold">Recent Purchases</h3>

        <div className="space-y-3">
          {recent.map((r, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-[#cfd4d6] rounded-lg p-3"
            >
              <div>
                <p className="text-sm flex items-center gap-1">
                  <User size={14} /> {r.user}
                </p>
                <p className="text-xs">
                  {r.product} × {r.qty}
                </p>
                <p className="text-xs flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(r.date).toLocaleDateString()}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-[#bfbfbf]">
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
