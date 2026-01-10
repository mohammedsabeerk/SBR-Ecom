import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AppContextt = ({ children }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser && storedUser.role === "user" && !storedUser.isBlocked)
      return storedUser;
    if (storedUser && storedUser.role === "admin") return storedUser;
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  const blockUser = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    await fetch(`http://localhost:5000/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, isBlocked: true }),
    });
    fetchUsers();
  };

  const unblockUser = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    await fetch(`http://localhost:5000/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, isBlocked: false }),
    });
    fetchUsers();
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
    } catch {
      setProductError("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = (id) =>
    products.find((p) => String(p.id) === String(id));

  const addProduct = async (product) => {
    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!res.ok) throw new Error("Add product failed");

    const newProduct = await res.json();
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = async (product) => {
    const res = await fetch(`http://localhost:5000/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!res.ok) throw new Error("Update product failed");

    const updatedProduct = await res.json();

    setProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(updatedProduct.id) ? updatedProduct : p
      )
    );
  };

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const updateUserInDB = async (updatedUser) => {
    const res = await fetch(`http://localhost:5000/users/${updatedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });
    if (!res.ok) throw new Error("Failed to update user in DB");
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  useEffect(() => {
    if (currentUser && currentUser.role === "user") {
      setCart(currentUser.cart || []);
      setWishlist(currentUser.wishlist || []);
      setOrders(currentUser.orders || []);
    } else {
      setCart([]);
      setWishlist([]);
      setOrders([]);
    }
  }, [currentUser]);


const register = async (name, email, password) => {
  
  const resUsers = await fetch("http://localhost:5000/users");
  const users = await resUsers.json();

  const lastId =
    users.length > 0
      ? Math.max(...users.map((u) => Number(u.id) || 0))
      : 0;

  const newUser = {
    id: String(lastId + 1),
    name,
    email,
    password,
    cart: [],
    wishlist: [],
    orders: [],
    role: "user",
    isBlocked: false,
    createdAt: new Date().toISOString(),
  };

  
  const res = await fetch("http://localhost:5000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) throw new Error("Registration failed");


  const savedUserRes = await fetch(
    `http://localhost:5000/users?id=${newUser.id}`
  );
  const savedUserData = await savedUserRes.json();
  const user = savedUserData[0];

  setCurrentUser({ ...user, role: "user" });
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ ...user, role: "user" })
  );
};


const login = async (email, password) => {
  
  const adminRes = await fetch(
    `http://localhost:5000/admin?email=${email}&password=${password}`
  );
  const adminData = await adminRes.json();
  if (adminData.length) {
    const admin = { ...adminData[0], role: "admin" };
    setCurrentUser(admin);
    localStorage.setItem("currentUser", JSON.stringify(admin));
    return "admin";
  }

  const userRes = await fetch(
    `http://localhost:5000/users?email=${email}&password=${password}`
  );
  const users = await userRes.json();
  if (!users.length) return false;

  const user = users[0];
  if (user.isBlocked) return "blocked";

  setCurrentUser({ ...user, role: "user" });
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ ...user, role: "user" })
  );
  return "user";
};

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  const addToCart = async (product) => {
    if (!currentUser || currentUser.role !== "user") return false;

    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);

    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);

    return true;
  };

  const removeFromCart = async (id) => {
    const updatedCart = cart.filter((i) => i.id !== id);
    setCart(updatedCart);

    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);
  };

  const updateCartQuantity = async (id, qty) => {
    const updatedCart = cart.map((i) =>
      i.id === id ? { ...i, quantity: qty } : i
    );
    setCart(updatedCart);

    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);
  };

const updateCartSize = async (id, oldSize, newSize) => {
  const updatedCart = cart.map((i) =>
    i.id === id && i.size === oldSize ? { ...i, size: newSize } : i
  );
  setCart(updatedCart);

  const updatedUser = { ...currentUser, cart: updatedCart };
  setCurrentUser(updatedUser);


  await updateUserInDB(updatedUser);
};


  const clearCart = async () => {
    setCart([]);

    const updatedUser = { ...currentUser, cart: [] };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);
  };

  const addToWishlist = async (product) => {
    if (!currentUser || currentUser.role !== "user") return false;

    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);

    const updatedUser = { ...currentUser, wishlist: updatedWishlist };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);

    return true;
  };



const moveWishlistToCart = async (product) => {
  if (!currentUser) return;


  const updatedCart = [...cart, { ...product, quantity: 1 }];
  const updatedWishlist = wishlist.filter((i) => i.id !== product.id);


  const updatedUser = { ...currentUser, cart: updatedCart, wishlist: updatedWishlist };


  setCart(updatedCart);
  setWishlist(updatedWishlist);
  setCurrentUser(updatedUser);


  await updateUserInDB(updatedUser);

  toast.success("Moved to Cart");
};


  const removeFromWishlist = async (id) => {
    const updatedWishlist = wishlist.filter((i) => i.id !== id);
    setWishlist(updatedWishlist);

    const updatedUser = { ...currentUser, wishlist: updatedWishlist };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);
  };

  const placeOrder = async ({ items, method, details, isBuyNow = false }) => {
    const newOrder = {
      id: Date.now(),
      items,
      status: "Ordered",
      paymentMethod: method,
      paymentDetails: details,
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [...orders, newOrder];

    let updatedCart = cart;

    if (isBuyNow) {
      const buyNowIds = items.map((item) => item.id + "-" + (item.size || ""));
      updatedCart = cart.filter(
        (cartItem) =>
          !buyNowIds.includes(cartItem.id + "-" + (cartItem.size || ""))
      );
    } else {
      updatedCart = [];
    }

    setOrders(updatedOrders);
    setCart(updatedCart);

    const updatedUser = { ...currentUser, orders: updatedOrders, cart: updatedCart };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);
  };

  const cancelOrder = async (orderId) => {
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: "Cancelled" } : o
    );
    setOrders(updatedOrders);

    const updatedUser = { ...currentUser, orders: updatedOrders };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);
  };

  const deleteCancelledOrder = async (orderId) => {
    const updatedOrders = orders.filter((o) => o.id !== orderId);
    setOrders(updatedOrders);

    const updatedUser = { ...currentUser, orders: updatedOrders };
    setCurrentUser(updatedUser);
    await updateUserInDB(updatedUser);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        products,
        loadingProducts,
        productError,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartSize,
        clearCart,
        wishlist,
        addToWishlist,
        moveWishlistToCart,
        removeFromWishlist,
        orders,
        placeOrder,
        cancelOrder,
        deleteCancelledOrder,
        users,
        fetchUsers,
        blockUser,
        unblockUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
