/*
 * ==========================================
 * Developed by Haydz
 * Rights reserved to Haydyn Barreto
 * ==========================================
 */

import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// --- INITIALIZE SUPABASE ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dcgkamyafyzbzijaigmb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__VhMXogOmnQoj9z_NTc0zQ_UvWG3D1k';
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_PASSCODE = "HubPub";

// --- GLOBAL STYLES ---
const styles = {
  appBackground: { backgroundColor: "#fdf8f5", minHeight: "100vh", padding: "20px", paddingBottom: "100px", color: "#333", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  container: { position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(5px)", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
  header: { textAlign: "center", borderBottom: "2px dashed #e76f51", paddingBottom: "20px", marginBottom: "30px" },
  title: { color: "#e76f51", fontSize: "3rem", margin: "0 0 10px 0", textShadow: "1px 1px 2px rgba(0,0,0,0.1)", letterSpacing: "2px" },
  subtitle: { color: "#2b1c15", fontSize: "1.3rem", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "1px" },
  sectionTitle: { color: "#e76f51", borderBottom: "2px solid #e76f51", paddingBottom: "5px", marginTop: "30px", textTransform: "uppercase", letterSpacing: "1px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "15px" },
  card: { backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.2s", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  cardImage: { width: "100%", height: "160px", objectFit: "cover", borderRadius: "6px", marginBottom: "15px", border: "1px solid #eee" },
  priceBadge: { backgroundColor: "#e76f51", color: "white", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", fontSize: "1.1rem" },
  button: { backgroundColor: "#f4a261", color: "#1e130d", border: "none", padding: "12px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "15px", fontSize: "1rem", transition: "background-color 0.2s" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box", fontFamily: "inherit" },
  textArea: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box", minHeight: "80px", resize: "vertical", fontFamily: "inherit" },
  backButton: { backgroundColor: "transparent", border: "2px solid #e76f51", color: "#e76f51", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginBottom: "20px", display: "inline-block" },
  adminCard: { backgroundColor: "#fff", borderLeft: "5px solid #e76f51", padding: "20px", marginBottom: "15px", borderRadius: "6px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  statBox: { backgroundColor: "#f9f9f9", border: "1px solid #eee", borderRadius: "8px", padding: "20px", textAlign: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  toast: { position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", padding: "12px 24px", borderRadius: "8px", color: "white", fontWeight: "bold", zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "opacity 0.3s ease" }
};

// --- ANIMATION CSS INJECTIONS ---
const injectGlobalStyles = () => (
  <style>
    {`
      @keyframes floatUp {
        0% { transform: translateY(110vh) rotate(0deg); opacity: 0.6; }
        100% { transform: translateY(-10vh) rotate(360deg); opacity: 0.6; }
      }
      @keyframes skeletonPulse {
        0% { background-color: #e0e0e0; }
        50% { background-color: #f0f0f0; }
        100% { background-color: #e0e0e0; }
      }
      .skeleton { animation: skeletonPulse 1.5s ease-in-out infinite; border-radius: 6px; }
    `}
  </style>
);

// --- COMPONENT: FLOATING BACKGROUND ---
const FloatingBackground = () => {
  const foods = ['🍕', '🥟', '🌮', '🍫', '🍦', '🍪', '🥤', '🍊', '🍔', '🍟', '🍩', '🌭'];
  const backgroundItems = Array.from({ length: 25 }).map(() => ({
    emoji: foods[Math.floor(Math.random() * foods.length)],
    left: `${Math.random() * 100}vw`,
    duration: `${15 + Math.random() * 25}s`, 
    delay: `-${Math.random() * 20}s`, 
    size: `${2 + Math.random() * 3}rem`, 
  }));

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {backgroundItems.map((item, i) => (
        <div key={i} style={{ position: "absolute", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))", left: item.left, fontSize: item.size, animation: `floatUp ${item.duration} linear infinite ${item.delay}` }}>
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

// --- COMPONENT: SKELETON LOADER ---
const SkeletonCard = () => (
  <div style={styles.card}>
    <div className="skeleton" style={{ width: "100%", height: "160px", marginBottom: "15px" }}></div>
    <div className="skeleton" style={{ width: "70%", height: "24px", marginBottom: "8px" }}></div>
    <div className="skeleton" style={{ width: "100%", height: "16px", marginBottom: "4px" }}></div>
    <div className="skeleton" style={{ width: "80%", height: "16px", marginBottom: "15px" }}></div>
    <div className="skeleton" style={{ width: "100%", height: "40px", marginTop: "auto" }}></div>
  </div>
);

// --- COMPONENT: TOAST NOTIFICATION ---
const Toast = ({ message, type }) => {
  if (!message) return null;
  const bgColors = { success: "#2a9d8f", warning: "#e76f51", error: "#e63946" };
  return (
    <div style={{ ...styles.toast, backgroundColor: bgColors[type] || "#333" }}>
      {type === 'success' ? '✓ ' : type === 'warning' ? '⚠️ ' : '🚨 '} {message}
    </div>
  );
};

// --- COMPONENT: MENU VIEW ---
const Menu = ({ menuItems, addToCart, setCurrentView, isLoading }) => {
  const renderCategory = (categoryName) => {
    const items = menuItems.filter(item => item.category === categoryName);
    if (items.length === 0 && !isLoading) return null; 
    
    return (
      <div key={categoryName}>
        <h2 style={styles.sectionTitle}>{categoryName}</h2>
        <div style={styles.grid}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            items.map((item) => {
              const isSoldOut = item.stock_count <= 0;
              return (
                <div key={item.id} style={{ ...styles.card, opacity: isSoldOut ? 0.6 : 1, transform: 'scale(1)' }} onMouseEnter={(e) => { if (!isSoldOut) e.currentTarget.style.transform = 'scale(1.03)' }} onMouseLeave={(e) => { if (!isSoldOut) e.currentTarget.style.transform = 'scale(1)' }}>
                  <div>
                    <div style={{ position: "relative" }}>
                      <img src={item.image} alt={item.name} loading="lazy" style={{ ...styles.cardImage, filter: isSoldOut ? "grayscale(100%)" : "none" }} />
                      {isSoldOut && (
                        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%) rotate(-10deg)", backgroundColor: "rgba(200, 30, 30, 0.8)", color: "white", padding: "5px 15px", borderRadius: "4px", fontWeight: "bold", fontSize: "1.2rem", border: "2px solid white" }}>
                          SOLD OUT
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>{item.name}</h3>
                      <span style={{...styles.priceBadge, backgroundColor: isSoldOut ? "#999" : "#e76f51"}}>${Number(item.price).toFixed(2)}</span>
                    </div>
                    <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "0.9rem", lineHeight: "1.4" }}>{item.description}</p>
                  </div>
                  {isSoldOut ? (
                    <button style={{ ...styles.button, backgroundColor: "#e0e0e0", color: "#888", cursor: "not-allowed" }} disabled>Sold Out</button>
                  ) : (
                    <button style={styles.button} onClick={() => addToCart(item)} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e76f51"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f4a261"}>+ Add to Cart</button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p style={{ color: "#555", margin: "0 0 20px 0", textAlign: "center" }}>Place your order below and Blueprint will come to you for payment.</p>
      {renderCategory("Pub Favourites")}
      {renderCategory("Desserts")}
      {renderCategory("Drinks")}
      <div style={{ textAlign: "center", marginTop: "30px", fontSize: "0.85rem", color: "#e76f51", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }} onClick={() => setCurrentView("admin_login")}>🔒 Staff Access</div>
    </div>
  );
};

// --- COMPONENT: ADMIN / KITCHEN DISPLAY ---
const Admin = ({ setCurrentView, showToast }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [adminTab, setAdminTab] = useState("queue");
  const [isFetching, setIsFetching] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    setIsFetching(true);
    const { data } = await supabase.from('orders').select('*').eq('status', 'Pending').order('id', { ascending: true });
    if (data) setActiveOrders(data);
    setIsFetching(false);
  };

  const fetchAnalytics = async () => {
    setIsFetching(true);
    const { data } = await supabase.from('orders').select('*').eq('status', 'Complete');
    if (data) setCompletedOrders(data);
    setIsFetching(false);
  };

  // REALTIME SUBSCRIPTION
  useEffect(() => {
    fetchOrders();
    fetchAnalytics();

    const subscription = supabase
      .channel('kitchen_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
        fetchAnalytics();
        showToast("Queue updated live!", "success");
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  const markOrderComplete = async (orderId) => {
    await supabase.from('orders').update({ status: 'Complete' }).eq('id', orderId);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      await supabase.from('orders').update({ status: 'Cancelled' }).eq('id', orderToCancel.id);
      const cartItems = typeof orderToCancel.cart_items === 'string' ? JSON.parse(orderToCancel.cart_items) : orderToCancel.cart_items;
      
      for (const item of cartItems) {
        const { data: dbItem } = await supabase.from('menu_inventory').select('stock_count').eq('id', item.id).single();
        await supabase.from('menu_inventory').update({ stock_count: dbItem.stock_count + item.quantity }).eq('id', item.id);
      }
      setOrderToCancel(null);
      showToast("Order cancelled & restocked", "success");
    } catch (err) {
      showToast("Cancellation failed", "error");
    }
  };

  const stats = (() => {
    let totalRevenue = 0;
    const itemSales = {};
    completedOrders.forEach(order => {
      totalRevenue += Number(order.total_price);
      const items = typeof order.cart_items === 'string' ? JSON.parse(order.cart_items) : order.cart_items;
      items.forEach(item => { itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity; });
    });
    let bestSeller = { name: "N/A", quantity: 0 };
    for (const [name, qty] of Object.entries(itemSales)) {
      if (qty > bestSeller.quantity) bestSeller = { name, quantity: qty };
    }
    return { totalRevenue, bestSeller };
  })();

  return (
    <div>
      {orderToCancel && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "12px", maxWidth: "400px", width: "90%", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h2 style={{ color: "#e63946" }}>Cancel Order?</h2>
            <p>Are you sure you want to cancel <strong>{orderToCancel.employee_name}</strong>'s order and restock?</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
              <button style={{ ...styles.button, flex: 1, backgroundColor: "#e0e0e0", color: "#333", marginTop: 0 }} onClick={() => setOrderToCancel(null)}>No, Keep It</button>
              <button style={{ ...styles.button, flex: 1, backgroundColor: "#e63946", color: "white", marginTop: 0 }} onClick={confirmCancelOrder}>Yes, Restock</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
        <button style={styles.backButton} onClick={() => setCurrentView("menu")}>← Exit</button>
        <h2 style={{ margin: 0, color: "#2b1c15" }}>Staff Panel</h2>
        <span style={{ fontSize: "0.9rem", color: "#2a9d8f", fontWeight: "bold" }}>● Live</span>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        <button style={{ ...styles.button, flex: 1, marginTop: 0, backgroundColor: adminTab === "queue" ? "#2b1c15" : "#e0e0e0", color: adminTab === "queue" ? "white" : "#555" }} onClick={() => setAdminTab("queue")}>🍳 Queue</button>
        <button style={{ ...styles.button, flex: 1, marginTop: 0, backgroundColor: adminTab === "analytics" ? "#2b1c15" : "#e0e0e0", color: adminTab === "analytics" ? "white" : "#555" }} onClick={() => setAdminTab("analytics")}>📊 Dashboard</button>
      </div>

      {adminTab === "queue" && (
        <div>
          {activeOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px", color: "#888" }}><h3>No pending orders!</h3><p>You're all caught up.</p></div>
          ) : (
            activeOrders.map((order) => (
              <div key={order.id} style={styles.adminCard}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#e76f51", fontSize: "1.5rem" }}>{order.employee_name}</h3>
                  <h3 style={{ margin: 0, color: "#333" }}>${order.total_price}</h3>
                </div>
                <ul style={{ paddingLeft: "20px", margin: "10px 0", fontSize: "1.1rem" }}>
                  {order.cart_items.map((item, index) => <li key={index} style={{ marginBottom: "5px" }}><strong>{item.quantity}x</strong> {item.name}</li>)}
                </ul>
                {order.suggestion && <div style={{ backgroundColor: "#f4f1de", padding: "10px", borderRadius: "4px", fontSize: "0.9rem", color: "#555", marginBottom: "15px" }}><strong>Note:</strong> {order.suggestion}</div>}
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button style={{ ...styles.button, flex: 1, marginTop: 0, backgroundColor: "#e63946", color: "white" }} onClick={() => setOrderToCancel(order)}>✕ Cancel</button>
                  <button style={{ ...styles.button, flex: 1, marginTop: 0, backgroundColor: "#2a9d8f", color: "white" }} onClick={() => markOrderComplete(order.id)}>✓ Complete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {adminTab === "analytics" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
            <div style={styles.statBox}><p style={styles.statLabel}>Revenue</p><p style={styles.statBox.statNumber}>${stats.totalRevenue.toFixed(2)}</p></div>
            <div style={styles.statBox}><p style={styles.statLabel}>Orders</p><p style={styles.statBox.statNumber}>{completedOrders.length}</p></div>
          </div>
          <div style={styles.statBox}><p style={styles.statLabel}>🏆 Best Seller</p><p style={{ fontSize: "1.8rem", color: "#2a9d8f", fontWeight: "bold", margin: "10px 0 0 0" }}>{stats.bestSeller.quantity > 0 ? `${stats.bestSeller.name} (${stats.bestSeller.quantity} sold)` : "N/A"}</p></div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState("menu"); 
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  
  const [cart, setCart] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [orderNote, setOrderNote] = useState(""); 
  const [orderStatus, setOrderStatus] = useState("idle"); 
  const [adminInput, setAdminInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchMenu(); 
  }, []);

  const fetchMenu = async () => {
    setIsLoadingMenu(true);
    const { data } = await supabase.from('menu_inventory').select('*').order('id', { ascending: true });
    if (data) setMenuItems(data);
    setIsLoadingMenu(false);
  };

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    const currentQuantity = existing ? existing.quantity : 0;
    
    if (currentQuantity >= item.stock_count) {
      showToast(`Only ${item.stock_count} ${item.name}(s) left!`, "warning");
      return;
    }
    setCart(existing ? cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)) : [...cart, { ...item, quantity: 1 }]);
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find((c) => c.id === itemId);
    if (existing.quantity === 1) {
      setCart(cart.filter((c) => c.id !== itemId));
      if (cart.length === 1) setCurrentView("menu"); 
    } else {
      setCart(cart.map((c) => (c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c)));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setOrderStatus("submitting");

    const { error } = await supabase.from('orders').insert([{ employee_name: employeeName, cart_items: cart, total_price: cartTotal, suggestion: orderNote, status: 'Pending' }]);

    if (error) {
      showToast("Order failed to send. Try again.", "error");
      setOrderStatus("idle");
      return; 
    } 

    for (const item of cart) {
      await supabase.from('menu_inventory').update({ stock_count: item.stock_count - item.quantity }).eq('id', item.id);
    }
    
    fetchMenu(); 
    showToast("Order fired to kitchen!", "success");

    try {
      const orderSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
      await fetch("/.netlify/functions/notifySlack", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: employeeName, order: orderSummary, total: cartTotal.toFixed(2), notes: orderNote || "None" }) });
    } catch (err) {}

    setOrderStatus("success");
    setCart([]); setEmployeeName(""); setOrderNote(""); 
    setTimeout(() => { setOrderStatus("idle"); setCurrentView("menu"); }, 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminInput === ADMIN_PASSCODE) { setLoginError(false); setAdminInput(""); setCurrentView("admin"); } 
    else { setLoginError(true); }
  };

  return (
    <div style={styles.appBackground}>
      {injectGlobalStyles()}
      {currentView !== "admin" && <FloatingBackground />}
      <Toast message={toast.message} type={toast.type} />

      <div style={styles.container}>
        {(currentView === "menu" || currentView === "checkout") && (
          <header style={styles.header}>
            <h1 style={styles.title}>🍻 HUB PUB 🍻</h1>
            <h2 style={styles.subtitle}>Get Your Pub Favourites!</h2>
          </header>
        )}

        {currentView === "menu" && (
          <Menu menuItems={menuItems} addToCart={addToCart} setCurrentView={setCurrentView} isLoading={isLoadingMenu} />
        )}

        {currentView === "checkout" && (
          <div>
            <button style={styles.backButton} onClick={() => setCurrentView("menu")}>← Back to Menu</button>
            <div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px", border: "1px solid #eee" }}>
              <h2 style={{ margin: "0 0 20px 0", color: "#e76f51" }}>🛒 Your Order Ticket</h2>
              <div>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", padding: "12px 0" }}>
                    <div><strong style={{ fontSize: "1.1rem" }}>{item.name}</strong> <span style={{ color: "#666" }}>(${item.price.toFixed(2)})</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button style={{ backgroundColor: "#e0e0e0", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer" }} onClick={() => removeFromCart(item.id)}>-</button>
                      <strong>{item.quantity}</strong>
                      <button style={{ backgroundColor: "#e0e0e0", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer" }} onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", borderTop: "2px solid #ddd", paddingTop: "15px" }}>
                  <h3 style={{ margin: 0 }}>Total Due:</h3><h3 style={{ margin: 0, color: "#e76f51" }}>${cartTotal.toFixed(2)}</h3>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
                <input style={styles.input} type="text" placeholder="Your Full Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required />
                <textarea style={styles.textArea} placeholder="Any special instructions? (Optional)" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
                <button type="submit" style={{ ...styles.button, width: "100%", backgroundColor: "#e76f51", color: "white", padding: "15px" }} disabled={orderStatus === "submitting"}>
                  {orderStatus === "submitting" ? "Sending Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}

        {currentView === "admin_login" && (
          <div>
            <button style={styles.backButton} onClick={() => { setCurrentView("menu"); setLoginError(false); }}>← Back</button>
            <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
              <h2 style={{ color: "#e76f51" }}>🔒 Staff Login</h2>
              <form onSubmit={handleLogin}>
                <input type="password" style={styles.input} placeholder="Enter Passcode" value={adminInput} onChange={(e) => setAdminInput(e.target.value)} required />
                {loginError && <p style={{ color: "red" }}>Incorrect passcode.</p>}
                <button type="submit" style={{ ...styles.button, width: "100%", backgroundColor: "#2b1c15", color: "white" }}>Access Kitchen</button>
              </form>
            </div>
          </div>
        )}

        {currentView === "admin" && <Admin setCurrentView={setCurrentView} showToast={showToast} />}

        <div style={{ textAlign: "center", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #eee", fontSize: "0.8rem", color: "#aaa" }}>
          <p style={{ margin: 0 }}>Developed by <strong>Haydyn Barreto</strong></p>
        </div>
      </div>

      {currentView === "menu" && cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "#fff", padding: "15px", boxShadow: "0 -4px 12px rgba(0,0,0,0.1)", zIndex: 10, display: "flex", justifyContent: "center" }}>
          <button style={{ backgroundColor: "#e76f51", color: "white", border: "none", padding: "15px 30px", borderRadius: "30px", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", width: "100%", maxWidth: "400px" }} onClick={() => setCurrentView("checkout")}>
            Review Order ({totalItems}) • ${cartTotal.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}