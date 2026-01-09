const CART_KEY = 'barbershop_cart';

export const getCartItems = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item) => {
  const cart = getCartItems();
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (id) => {
  const cart = getCartItems();
  const updatedCart = cart.filter(item => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  return updatedCart;
};

export const updateQuantity = (id, quantity) => {
  const cart = getCartItems();
  const item = cart.find(item => item.id === id);
  
  if (item) {
    item.quantity = quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return [];
};

export const calculateTotal = () => {
  const cart = getCartItems();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = () => {
  const cart = getCartItems();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

