import React, { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { FaLock, FaUnlock, FaTimes } from "react-icons/fa";

function UserAd() {
  const { users, fetchUsers, blockUser, unblockUser } = useAppContext();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )

      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users, search]);

  const totalSpent = (user) => {
    if (!user.orders) return 0;
    return user.orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
      0
    );
  };

  return (
    <div className="min-h-screen bg-[#cfd4d6] p-20 text-[#2f2926]">
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          mb-6 w-64 px-4 py-2
          bg-[#e1e3e2] backdrop-blur
          border border-black/20
          text-[#2f2926] placeholder-[#2f2926]
          focus:outline-none focus:border-white
          rounded-lg
        "
      />

      <div
        className="
          overflow-x-auto
          rounded-xl
          bg-[#e1e3e2] backdrop-blur-xl
          border border-black/20
          shadow-lg
        "
      >
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white text-sm text-[#2f2926]">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-[#2f2926]">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="
                    border-b border-white
                    hover:bg-[#cfd4d6]
                    cursor-pointer transition
                  "
                >
                  <td className="p-4 capitalize font-medium">{user.name}</td>
                  <td className="p-4 text-[#2f2926]">{user.email}</td>
                  <td className="p-4 uppercase text-[#2f2926]">
                    {user.role || "USER"}
                  </td>
                  <td className="p-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isBlocked
                          ? "bg-red-500/20 text-red-700"
                          : "bg-green-500/20 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="p-4">
                    {user.isBlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unblockUser(user.id);
                        }}
                        className="
                          w-9 h-9
                          border border-black/30
                          rounded-full
                          flex items-center justify-center
                          hover:bg-white hover:text-green-800
                          transition
                        "
                        title="Unblock"
                      >
                        <FaUnlock />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          blockUser(user.id);
                        }}
                        className="
                          w-9 h-9
                          border border-black/30
                          rounded-full
                          flex items-center justify-center
                          hover:bg-black hover:text-red-800
                          transition
                        "
                        title="Block"
                      >
                        <FaLock />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
          <div
            className="
              relative
              bg-white/70 backdrop-blur-xl
              border border-black/20
              rounded-2xl
              p-6
              w-11/12 md:w-2/3 lg:w-1/2
              max-h-[90vh] overflow-y-auto
              shadow-2xl
            "
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-semibold mb-4">User Details</h2>

            <div className="space-y-2 text-gray-700 mb-6">
              <p>
                <b>Name:</b> {selectedUser.name}
              </p>
              <p>
                <b>Email:</b> {selectedUser.email}
              </p>
              <p>
                <b>Role:</b> {selectedUser.role || "USER"}
              </p>
              <p>
                <b>Status:</b> {selectedUser.isBlocked ? "Blocked" : "Active"}
              </p>
              <p>
                <b>Total Spent:</b> ₹{totalSpent(selectedUser)}
              </p>
            </div>

            <h3 className="text-lg mb-2 font-semibold">Orders</h3>

            {selectedUser.orders?.length ? (
              <table className="w-full text-sm border border-black/20 rounded-lg">
                <thead>
                  <tr className="border-b border-black/20 text-gray-600">
                    <th className="p-2">ID</th>
                    <th className="p-2">Items</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.orders.map((o) => (
                    <tr key={o.id} className="border-b border-black/10">
                      <td className="p-2">{o.id}</td>
                      <td className="p-2">
                        {o.items.map((i) => i.title || i.name).join(", ")}
                      </td>
                      <td className="p-2">
                        {o.items.reduce((s, i) => s + i.quantity, 0)}
                      </td>
                      <td className="p-2">
                        ₹{o.items.reduce((s, i) => s + i.price * i.quantity, 0)}
                      </td>
                      <td className="p-2">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAd;
