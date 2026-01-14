import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "components/nav";
import Footer from "components/footer";
import styles from "./Cart.module.scss";
import { getCartItems, removeFromCart, updateQuantity, clearCart, calculateTotal } from "utils/cartUtils";
import ModalBuy from "components/modals/ModalBuy";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBookServices = () => {
    if (cartItems.length > 0) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = getCartItems();
    setCartItems(items);
    setTotal(calculateTotal());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    loadCart();
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    loadCart();
  };

  const handleClearCart = () => {
      clearCart();
      loadCart();
  };

const submitAppointmentToAPI = async (appointmentData) => {
    setIsProcessing(true);
    try {
        const orderData = {
            id: appointmentData.appointmentId,
            name: appointmentData.name,
            email: appointmentData.email,
            phone: appointmentData.phone,
            date: appointmentData.date,
            time: appointmentData.time,
            barber: appointmentData.barber || 'any',
            services: appointmentData.services, 
            servicesList: appointmentData.servicesList, 
            servicesCount: appointmentData.servicesCount,
            servicesTotal: appointmentData.servicesTotal,
            total: appointmentData.totalAmount,
            paymentMethod: appointmentData.paymentMethod,
            promoCode: appointmentData.promoCode || '',
            specialRequests: appointmentData.specialRequests || '',
            marketingAccepted: appointmentData.marketingAccepted || false,
            processed: false, 
            createdAt: new Date().toISOString(),
            status: 'pending',
            type: 'appointment'
        };

        const response = await fetch("https://barbershop-3f2ae-default-rtdb.firebaseio.com/orders.json", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return data;
    } catch (error) {
        console.error('Помилка при відправці даних:', error);
        throw error;
    } finally {
        setIsProcessing(false);
    }
};

const handleModalSubmit = async (appointmentData) => {
    console.log('Дані форми бронювання:', appointmentData);
    
    const fullAppointmentData = {
        ...appointmentData,
        submittedAt: new Date().toISOString()
    };
    
    try {
        const result = await submitAppointmentToAPI(fullAppointmentData);
        
        if (result) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Помилка при відправці даних:', error);
        return false;
    }
};

  if (cartItems.length === 0) {
    return (
      <>
      <title>Кошик</title>
        <Nav />
        <main className={styles.cartPage}>
          <div className={styles.center}>
            <section className={styles.emptyCart} aria-labelledby="empty-cart-title">
              <h2 id="empty-cart-title">Кошик порожній</h2>
              <p>Додайте послуги з розділу "Послуги"</p>
              <Link to="/services" className={styles.continueShopping}>
                Перейти до послуг
              </Link>
            </section>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
        <header className={styles.pageHeader}>
                    <div className={styles.center}>
              <h1>Кошик</h1>
              {/* ({cartItems.length} {cartItems.length === 1 ? 'послуга' : cartItems.length < 5 ? 'послуги' : 'послуг'}) */}
              </div>
        </header>

      <main className={styles.cartPage}>
        <article className={styles.cartContent}>
          <div className={styles.center}>

            <section className={styles.cartItemsSection} aria-labelledby="cart-items-title">
              <div className={styles.cartTable} role="table" aria-label="Товари в корзині">
                <div className={styles.cartHeader} role="rowgroup">
                  <div className={styles.headerItem} role="columnheader">Послуга</div>
                  <div className={styles.headerItem} role="columnheader">Ціна</div>
                  <div className={styles.headerItem} role="columnheader">Кількість</div>
                  <div className={styles.headerItem} role="columnheader">Сума</div>
                  <div className={styles.headerItem} role="columnheader">Дії</div>
                </div>
                
                {cartItems.map(item => (
                  <div key={item.id} className={styles.cartRow} role="row">
                    <div className={styles.cartCell} role="cell">
                      <article className={styles.serviceInfo}>
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className={styles.serviceThumb} 
                          onError={(e) => {
                            e.target.onerror = null;
                          }}
                        />
                        <div>
                          <h3 className={styles.serviceTitle}>{item.title}</h3>
                          <p className={styles.serviceDesc}>{item.description.slice(0, 100)}...</p>
                        </div>
                      </article>
                    </div>
                    
                    <div className={styles.cartCell} role="cell">
                      <span className={styles.price}>${item.price}</span>
                    </div>
                    
                    <div className={styles.cartCell} role="cell">
                      <div className={styles.quantityControl}>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className={styles.quantityBtn}
                          disabled={item.quantity <= 1}
                          aria-label={`Зменшити кількість ${item.title}`}
                        >
                          -
                        </button>
                        <span className={styles.quantity} aria-live="polite">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className={styles.quantityBtn}
                          aria-label={`Збільшити кількість ${item.title}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.cartCell} role="cell">
                      <span className={styles.subtotal}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className={styles.cartCell} role="cell">
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className={styles.removeBtn}
                        aria-label={`Видалити ${item.title} з кошика`}
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <aside className={styles.cartSummary}>
              <div className={styles.summaryActions}>
                <button 
                  onClick={handleClearCart} 
                  className={styles.clearBtn}
                  disabled={isProcessing}
                  aria-label="Очистити весь кошик"
                >
                  Очистити кошик
                </button>
                <Link to="/services" className={styles.continueBtn}>
                  Продовжити вибір
                </Link>
              </div>
              
              <div className={styles.totalSection} role="region" aria-label="Розрахунок суми">
                <div className={styles.totalRow}>
                  <span>Кількість послуг:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Проміжний підсумок:</span>
                  <span>${(total * 0.8).toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Податок (20%):</span>
                  <span>${(total * 0.2).toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <strong className={styles.grandTotal}>Загальна сума:</strong>
                  <strong className={styles.grandTotal}>${total.toFixed(2)}</strong>
                </div>
                
                <button 
                  onClick={handleBookServices} 
                  className={styles.checkoutBtn}
                  disabled={isProcessing || cartItems.length === 0}
                  aria-label="Перейти до оформлення замовлення"
                >
                  {isProcessing ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true"></span>
                      Обробка...
                    </>
                  ) : (
                    `Оформити замовлення`
                  )}
                </button>
                
                <p className={styles.checkoutNote}>
                  Натисніть кнопку, щоб заповнити форму бронювання для всіх послуг у кошику
                </p>
              </div>
            </aside>
          </div>
        </article>
        
        {isModalOpen && (
          <ModalBuy
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            services={cartItems}
            onSuccess={() => {
              clearCart();
              loadCart();
            }}
          />
        )}
      </main>

      <Footer />
    </>
  );
};

export default Cart;