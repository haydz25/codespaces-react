/*
 * ==========================================
 * Developed by Haydz
 * Rights reserved to Haydyn Barreto
 * ==========================================
 */

import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Using Environment Variables for Security)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dcgkamyafyzbzijaigmb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__VhMXogOmnQoj9z_NTc0zQ_UvWG3D1k';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- The Secret Passcode ---
const ADMIN_PASSCODE = "HubPub";

// --- HubPub Menu Data ---
const menuItems = [
  { id: 1, category: "Pub Favourites", name: "Mini Pizza", price: 3.0, description: "Available as Pepperoni & Cheese 🍕", image: "https://lh5.ggpht.com/_zTCbpIKK2Ss/TEyPgPmc90I/AAAAAAAAAtk/-hBH5yjmIc0/s800/minipizzas.jpg" },
  { id: 2, category: "Pub Favourites", name: "Spicy Jamaican Patty", price: 2.0, description: "Flaky Crust, Classic Beef Filling! 🥟", image: "https://www.orchidsandsweettea.com/wp-content/uploads/2022/03/Spicy-Jamaican-Beef-Patties.jpg" },
  { id: 3, category: "Pub Favourites", name: "Chicken Quesadillas", price: 3.0, description: "Shredded Chicken & Cheese inside Toasty Tortillas 🌮", image: "https://www.julieseatsandtreats.com/wp-content/uploads/2024/10/Chicken-Quesadilla-Square.jpg" },
  { id: 4, category: "Desserts", name: "KitKat Ice Cream Bars", price: 2.0, description: "Creamy Ice Cream with Crunchy Wafers! 🍫", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ23viitC4nKSeqUu2eNraLShkWKauxSohc-znByhuxR8nev3b90ZMxNq8&s=10" },
  { id: 5, category: "Desserts", name: "Classic Ice Cream Sandwich", price: 1.5, description: "The Perfect Cool Treat! 🍦", image: "https://i0.wp.com/media.globalnews.ca/videostatic/203/803/Ice_cream_sandwiches_recalled_over_risk_-5d348d5d14a4d60001c10e1d_1_Jul_21_2019_16_54_26_poster.jpg?w=1040&quality=70&strip=all" },
  { id: 6, category: "Desserts", name: "The Original Chipwich", price: 3.5, description: "Gooey Cookies & Creamy Ice Cream! 🍪", image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Chipwich_ice_cream_sandwich.jpg" },
  { id: 7, category: "Drinks", name: "Coke (Can)", price: 1.0, description: "Ice cold refreshing Coke 🥤", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF-JIZwiq1T4eZa3UpbpixkVMm34aXYj3QeSaRdRokOxWyzQsfWWmamUP4&s=10" },
  { id: 8, category: "Drinks", name: "Crush or Root Beer", price: 1.0, description: "Orange Crush or Root Beer 🍊", image: "https://valleydirectfoods.com/cdn/shop/products/crush-variety-24-pack-725608.jpg?v=1699684021" },
  { id: 9, category: "Drinks", name: "Gatorade (Bottle)", price: 1.5, description: "Electrolyte packed ⚡", image: "https://pepsihomedelivery.com/wp-content/uploads/2020/04/gat-min-lin-600x600.jpeg" }
];

// --- Floating Background Component ---
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
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(110vh) rotate(0deg); opacity: 0.6; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0.6; }
          }
          .floating-food {
            position: absolute;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          }
        `}
      </style>
      {backgroundItems.map((item, i) => (
        <div key={i} className="floating-food" style={{
          left: item.left,
          fontSize: item.size,
          animation: `floatUp ${item.duration} linear infinite ${item.delay}`
        }}>
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState("menu"); 
  
  const [cart, setCart] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [suggestion, setSuggestion] = useState(""); 
  const [orderStatus, setOrderStatus] = useState("idle"); 

  const [activeOrders, setActiveOrders] = useState([]);
  const [isFetchingAdmin, setIsFetchingAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // --- Developer Console Easter Egg ---
  useEffect(() => {
    console.info(
      "%cDeveloped by Haydz\n%cRights reserved to Haydyn Barreto", 
      "color: #e76f51; font-weight: bold; font-size: 24px; padding: 10px 0;",
      "color: #333; font-size: 14px; font-style: italic;"
    );
  }, []);

  // --- Cart Logic ---
  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
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

  // --- Submission Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setOrderStatus("submitting");

    const { error } = await supabase
      .from('orders')
      .insert([
        { 
          employee_name: employeeName, 
          cart_items: cart, 
          total_price: cartTotal, 
          suggestion: suggestion,
          status: 'Pending'
        }
      ]);

    if (error) {
      console.error("Error sending order:", error);
      alert("Something went wrong sending your order. Please try again.");
      setOrderStatus("idle");
    } else {
      setOrderStatus("success");
      setCart([]);
      setEmployeeName("");
      setSuggestion(""); 
      
      setTimeout(() => {
        setOrderStatus("idle");
        setCurrentView("menu"); 
      }, 4000);
    }
  };

  // --- Admin Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminInput === ADMIN_PASSCODE) {
      setLoginError(false);
      setAdminInput("");
      setCurrentView("admin");
    } else {
      setLoginError(true);
    }
  };

  const fetchOrders = async () => {
    setIsFetchingAdmin(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'Pending')
      .order('id', { ascending: true }); 
      
    if (data) setActiveOrders(data);
    if (error) console.error("Error fetching orders:", error);
    setIsFetchingAdmin(false);
  };

  const markOrderComplete = async (orderId) => {
    await supabase
      .from('orders')
      .update({ status: 'Complete' })
      .eq('id', orderId);
    
    fetchOrders(); 
  };

  useEffect(() => {
    if (currentView === "admin") {
      fetchOrders();
    }
  }, [currentView]);

  // --- UI Styles ---
  const styles = {
    appBackground: { backgroundColor: "#fdf8f5", minHeight: "100vh", padding: "20px", paddingBottom: "100px", color: "#333", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", position: "relative" },
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
    cartSection: { backgroundColor: "#f9f9f9", color: "#333", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.05)", border: "1px solid #eee" },
    input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box", fontFamily: "inherit" },
    textArea: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box", minHeight: "80px", resize: "vertical", fontFamily: "inherit" },
    cartItem: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", padding: "12px 0" },
    qtyControls: { display: "flex", alignItems: "center", gap: "10px" },
    qtyButton: { backgroundColor: "#e0e0e0", border: "none", borderRadius: "50%", width: "30px", height: "30px", fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" },
    backButton: { backgroundColor: "transparent", border: "2px solid #e76f51", color: "#e76f51", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginBottom: "20px", display: "inline-block" },
    floatingCartBar: { position: "fixed", bottom: "0", left: "0", width: "100%", backgroundColor: "#ffffff", padding: "15px", boxShadow: "0 -4px 12px rgba(0,0,0,0.1)", zIndex: 10, display: "flex", justifyContent: "center", borderTop: "2px solid #e76f51" },
    floatingCartButton: { backgroundColor: "#e76f51", color: "white", border: "none", padding: "15px 30px", borderRadius: "30px", fontSize: "1.2rem", fontWeight: "bold", cursor: "pointer", width: "100%", maxWidth: "400px", boxShadow: "0 4px 6px rgba(231,111,81,0.3)" },
    adminCard: { backgroundColor: "#fff", borderLeft: "5px solid #e76f51", padding: "20px", marginBottom: "15px", borderRadius: "6px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
    refreshButton: { backgroundColor: "#2b1c15", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", float: "right" },
    adminLink: { textAlign: "center", marginTop: "30px", fontSize: "0.85rem", color: "#e76f51", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" },
    footer: { textAlign: "center", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #eee", fontSize: "0.8rem", color: "#aaa" }
  };

  const renderCategory = (categoryName) => {
    const items = menuItems.filter(item => item.category === categoryName);
    return (
      <div key={categoryName}>
        <h2 style={styles.sectionTitle}>{categoryName}</h2>
        <div style={styles.grid}>
          {items.map((item) => (
            <div key={item.id} style={styles.card} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <div>
                <img src={item.image} alt={item.name} style={styles.cardImage} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>{item.name}</h3>
                  <span style={styles.priceBadge}>${item.price.toFixed(2)}</span>
                </div>
                <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "0.9rem", lineHeight: "1.4" }}>{item.description}</p>
              </div>
              <button 
                style={styles.button} 
                onClick={() => addToCart(item)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e76f51"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f4a261"}
              >
                + Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.appBackground}>
      {currentView !== "admin" && <FloatingBackground />}
      
      <div style={styles.container}>
        
        {(currentView === "menu" || currentView === "checkout") && (
          <header style={styles.header}>
            <h1 style={styles.title}>🍻 HUB PUB 🍻</h1>
            <h2 style={styles.subtitle}>Get Your Pub Favourites!</h2>
            {currentView === "menu" && <p style={{ color: "#555", margin: "10px 0 0 0" }}>Place your order below and Blueprint will come to you for payment.</p>}
          </header>
        )}

        {/* --- VIEW 1: THE MENU --- */}
        {currentView === "menu" && (
          <div>
            {renderCategory("Pub Favourites")}
            {renderCategory("Desserts")}
            {renderCategory("Drinks")}
            
            <div style={styles.adminLink} onClick={() => setCurrentView("admin_login")}>
              Staff Access
            </div>
          </div>
        )}

        {/* --- VIEW 2: THE CHECKOUT PAGE --- */}
        {currentView === "checkout" && (
          <div>
            <button style={styles.backButton} onClick={() => setCurrentView("menu")}>
              ← Back to Menu
            </button>
            
            <div style={styles.cartSection}>
              <h2 style={{ margin: "0 0 20px 0", color: "#e76f51" }}>🛒 Your Order Ticket</h2>
              
              <div>
                {cart.map((item) => (
                  <div key={item.id} style={styles.cartItem}>
                    <div>
                      <strong style={{ fontSize: "1.1rem" }}>{item.name}</strong> 
                      <span style={{ color: "#666", marginLeft: "8px" }}>(${item.price.toFixed(2)})</span>
                    </div>
                    <div style={styles.qtyControls}>
                      <button style={styles.qtyButton} onClick={() => removeFromCart(item.id)}>-</button>
                      <strong style={{ fontSize: "1.1rem", minWidth: "20px", textAlign: "center" }}>{item.quantity}</strong>
                      <button style={styles.qtyButton} onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", borderTop: "2px solid #ddd", paddingTop: "15px" }}>
                  <h3 style={{ margin: 0 }}>Total Due:</h3>
                  <h3 style={{ margin: 0, color: "#e76f51", fontSize: "1.5rem" }}>${cartTotal.toFixed(2)}</h3>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Your Full Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                />
                <textarea
                  style={styles.textArea}
                  placeholder="Any menu suggestions for next time? (Optional)"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                />
                
                {orderStatus === "success" && (
                  <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "15px", borderRadius: "6px", margin: "15px 0", border: "1px solid #c3e6cb", fontWeight: "bold", textAlign: "center" }}>
                    🎉 Order fired to the kitchen! We'll come find you for payment shortly.
                  </div>
                )}

                <button 
                  type="submit" 
                  style={{ 
                    ...styles.button, 
                    width: "100%", 
                    backgroundColor: "#e76f51",
                    color: "white",
                    fontSize: "1.2rem",
                    padding: "15px"
                  }}
                  disabled={orderStatus === "submitting"}
                >
                  {orderStatus === "submitting" ? "Sending Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW 3: ADMIN LOGIN --- */}
        {currentView === "admin_login" && (
          <div>
            <button style={styles.backButton} onClick={() => { setCurrentView("menu"); setLoginError(false); setAdminInput(""); }}>
              ← Back to Menu
            </button>
            <div style={{...styles.cartSection, maxWidth: "400px", margin: "0 auto", marginTop: "50px"}}>
              <h2 style={{ margin: "0 0 20px 0", color: "#e76f51", textAlign: "center" }}>🔒 Staff Login</h2>
              <form onSubmit={handleLogin}>
                <input 
                  type="password" 
                  style={styles.input} 
                  placeholder="Enter Passcode" 
                  value={adminInput}
                  onChange={(e) => setAdminInput(e.target.value)}
                  required
                />
                {loginError && <p style={{ color: "red", textAlign: "center", margin: "5px 0" }}>Incorrect passcode.</p>}
                <button 
                  type="submit" 
                  style={{ ...styles.button, width: "100%", backgroundColor: "#2b1c15", color: "white", marginTop: "20px" }}
                >
                  Access Kitchen Display
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW 4: THE ADMIN PANEL --- */}
        {currentView === "admin" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
              <button style={styles.backButton} onClick={() => setCurrentView("menu")}>← Exit Staff Mode</button>
              <h2 style={{ margin: 0, color: "#2b1c15" }}>Kitchen Display</h2>
              <button style={styles.refreshButton} onClick={fetchOrders}>
                {isFetchingAdmin ? "Refreshing..." : "↻ Refresh Queue"}
              </button>
            </div>

            {activeOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
                <h3>No pending orders!</h3>
                <p>You're all caught up. Grab a drink.</p>
              </div>
            ) : (
              activeOrders.map((order) => (
                <div key={order.id} style={styles.adminCard}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#e76f51", fontSize: "1.5rem" }}>{order.employee_name}</h3>
                    <h3 style={{ margin: 0, color: "#333" }}>${order.total_price}</h3>
                  </div>
                  
                  <ul style={{ paddingLeft: "20px", margin: "10px 0", fontSize: "1.1rem" }}>
                    {order.cart_items.map((item, index) => (
                      <li key={index} style={{ marginBottom: "5px" }}>
                        <strong>{item.quantity}x</strong> {item.name}
                      </li>
                    ))}
                  </ul>

                  {order.suggestion && (
                    <div style={{ backgroundColor: "#f4f1de", padding: "10px", borderRadius: "4px", fontSize: "0.9rem", color: "#555", marginBottom: "15px" }}>
                      <strong>Note:</strong> {order.suggestion}
                    </div>
                  )}

                  <button 
                    style={{ ...styles.button, width: "100%", backgroundColor: "#2a9d8f", color: "white" }} 
                    onClick={() => markOrderComplete(order.id)}
                  >
                    ✓ Mark as Complete & Paid
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- DEVELOPER FOOTER --- */}
        <div style={styles.footer}>
          <p style={{ margin: "0 0 4px 0" }}>Developed by <strong>Haydyn Barreto</strong></p>
        </div>

      </div>

      {/* --- STICKY BOTTOM CHECKOUT BAR --- */}
      {currentView === "menu" && cart.length > 0 && (
        <div style={styles.floatingCartBar}>
          <button style={styles.floatingCartButton} onClick={() => setCurrentView("checkout")}>
            Review Order ({totalItems}) • ${cartTotal.toFixed(2)}
          </button>
        </div>
      )}

    </div>
  );
}