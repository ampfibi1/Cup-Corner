// Simple client-side data layer for demo Coffee Shop
const STORAGE_PRODUCTS = 'cc_products';
const STORAGE_ORDERS = 'cc_orders';
const STORAGE_CART = 'cc_cart';
const STORAGE_USERS = 'cc_users';

function initProducts(){
  if (!localStorage.getItem(STORAGE_PRODUCTS)){
    const defaults = [
      { id: 1, name: 'Espresso', price: 220 },
      { id: 2, name: 'Latte', price: 350 },
      { id: 3, name: 'Cappuccino', price: 300 },
      { id: 4, name: 'Americano', price: 200 },
      { id: 5, name: 'Mocha', price: 380 },
      { id: 6, name: 'Macchiato', price: 250 },
      { id: 7, name: 'Flat White', price: 320 },
      { id: 8, name: 'Iced Coffee', price: 280 },
      { id: 9, name: 'Frappuccino', price: 400 },
      { id: 10, name: 'Affogato', price: 360 },
      { id: 11, name: 'Turkish Coffee', price: 240 },
      { id: 12, name: 'Irish Coffee', price: 420 }
    ];
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(defaults));
  }
}

function initUsers(){
  if (!localStorage.getItem(STORAGE_USERS)){
    const defaults = [ { username: 'admin', password: 'admin', role: 'admin' },
        { username: 'user', password: 'user', role: 'user' } ];
    localStorage.setItem(STORAGE_USERS, JSON.stringify(defaults));
  }
}

function getUsers(){ return JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]'); }
function saveUsers(list){ localStorage.setItem(STORAGE_USERS, JSON.stringify(list)); }

function registerUser({username, email, password, role='user'}){
  const users = getUsers();
  if (users.find(u=>u.username===username)) 
    return { success:false, message:'Username already exists' };
  if (users.find(u=>u.email && u.email.toLowerCase()===email.toLowerCase())) 
    return { success:false, message:'Email already registered' };
  users.push({ username, email, password, role });
  saveUsers(users);
  return { success:true };
}

function getProducts(){ return JSON.parse(localStorage.getItem(STORAGE_PRODUCTS) || '[]'); }
function saveProducts(items){ localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(items)); }

function renderProducts(containerId){
  const container = document.getElementById(containerId);
  if (!container) return;
  const products = getProducts();
  container.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('div'); el.className = 'product';
    el.innerHTML = `<strong>${p.name}</strong><div>৳${p.price.toFixed(2)}</div><button data-id="${p.id}">Add</button>`;
    el.querySelector('button').addEventListener('click', ()=> addToCart(p.id));
    container.appendChild(el);
  });
}

function getCart(){ return JSON.parse(localStorage.getItem(STORAGE_CART) || '[]'); }
function saveCart(cart){ localStorage.setItem(STORAGE_CART, JSON.stringify(cart)); }

function addToCart(productId){
  const products = getProducts();
  const prod = products.find(p=>p.id===productId);
  if (!prod) return;
  const cart = getCart();
  const item = cart.find(i=>i.id===productId);
  if (item) item.qty += 1; else cart.push({ id: productId, name: prod.name, price: prod.price, qty: 1 });
  saveCart(cart);
  renderCart();
}

function renderCart(){
  const el = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!el) return;
  const cart = getCart();
  el.innerHTML = '';
  let total = 0;
  cart.forEach(it=>{
    const row = document.createElement('div');
    row.textContent = `${it.name} x ${it.qty} — ৳${(it.price*it.qty).toFixed(2)}`;
    el.appendChild(row);
    total += it.price*it.qty;
  });
  totalEl.textContent = 'Total: ৳' + total.toFixed(2);
}

function placeOrder(){
  const user = JSON.parse(localStorage.getItem('cc_user')||'null');
  if (!user) return alert('Please login first');
  const cart = getCart();
  if (!cart.length) return alert('Cart is empty');
  const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS) || '[]');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const order = { id: Date.now(), user: user.username, items: cart, total, date: new Date().toISOString() };
  orders.push(order);
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
  localStorage.removeItem(STORAGE_CART);
  alert('Order placed');
  window.location.href = 'orders.html';
}

function renderOrders(containerId, all=false){
  const container = document.getElementById(containerId);
  if (!container) return;
  const orders = JSON.parse(localStorage.getItem(STORAGE_ORDERS) || '[]');
  const user = JSON.parse(localStorage.getItem('cc_user')||'null');
  const list = all ? orders : orders.filter(o=> user && o.user===user.username);
  container.innerHTML = '';
  if (!list.length) { container.textContent = 'No orders found.'; return; }
  list.slice().reverse().forEach(o=>{
    const div = document.createElement('div'); div.className = 'order';
    div.innerHTML = `<div><strong>Order #${o.id}</strong> — ${new Date(o.date).toLocaleString()} — ৳${o.total.toFixed(2)} — by ${o.user}</div>`;
    o.items.forEach(it=>{ const r = document.createElement('div'); r.textContent = `${it.name} x ${it.qty}`; div.appendChild(r); });
    container.appendChild(div);
  });
}

// Admin functions
function addProduct({name, price}){
  const products = getProducts();
  const id = products.length ? Math.max(...products.map(p=>p.id))+1 : 1;
  products.push({ id, name, price });
  saveProducts(products);
}

function deleteProduct(id){
  const products = getProducts().filter(p=>p.id!==id);
  saveProducts(products);
  renderAdminProducts('adminProducts');
  renderProducts('products');
}

function renderAdminProducts(containerId){
  const container = document.getElementById(containerId);
  if (!container) return;
  const products = getProducts();
  container.innerHTML = '';
  products.forEach(p=>{
    const row = document.createElement('div'); row.className = 'admin-row';
    row.innerHTML = `<div>${p.name} — ৳${p.price.toFixed(2)}</div>`;
    const del = document.createElement('button'); del.textContent = 'Delete'; del.addEventListener('click', ()=> deleteProduct(p.id));
    row.appendChild(del);
    container.appendChild(row);
  });
}

// initialize defaults
initProducts();
initUsers();
