import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from 'components/nav';
import Footer from 'components/footer';
import { addToCart } from 'utils/cartUtils';
import fallbackData from 'data/data.json';
import styles from './Service.module.scss';
import Notification from "components/modals/Notification";

const API_BASE_URL = 'https://barbershop-3f2ae-default-rtdb.firebaseio.com';

const Service = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

    const buttonTimersRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/services.json`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data) {
            const servicesArray = data;
            setAllServices(servicesArray);
            const foundService = servicesArray.find(s => s.id === parseInt(id));
            
            if (foundService) {
              setService(foundService);
              setLoading(false);
              return;
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Помилка при отриманні даних:", err);
        setError("Не вдалося завантажити дані з API. Використовуються локальні дані.");
        const localService = fallbackData.services?.find(s => 
          s.id === parseInt(id)
        );
              setLoading(false);
        
        if (localService) {
          setService(localService);
        } else {
          setError('Послугу не знайдено');
        }
        
      }
    };

    fetchData();
  }, [id]);

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handleAddToCart = (e) => {
    if (service) {
      try {
        addToCart(service);

        showNotification(
          `${service.title} додано до кошика! Ціна: $${service.price}`,
          'success'
        );
       
      const button = e.currentTarget;
      const originalText = button.textContent;

      if(buttonTimersRef.current[service.id]){
        clearTimeout(buttonTimersRef.current[service.id]);
        delete buttonTimersRef.current[service.id];
      }

      button.textContent = "✓ Додано";
      button.disabled = true;

      buttonTimersRef.current[service.id] = setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        delete buttonTimersRef.current[service.id];
      }, 1000);
      

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
    } catch (error) {
      console.error("Помилка при додаванні до кошика:", error);
      showNotification(
        "Не вдалося додати послугу до кошика. Спробуйте ще раз.",
        'error'
      );
    }
  };
};

  useEffect(() => {
    return () => {
      Object.values(buttonTimersRef.current).forEach(timer => {
        clearTimeout(timer);
      });
      buttonTimersRef.current = {};
    };
  }, []);


  const getRelatedServices = () => {
    if (!service || allServices.length === 0) return [];
    
    return allServices
      .filter(s => 
        s.category === service.category && 
        s.id !== service.id
      )
      .slice(0, 3);
  };

  const getCategoryName = (categoryId) => {
    const category = fallbackData.categories?.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Завантаження послуги...</p>
        </div>
        <Footer />
      </>
    );
  }



  const relatedServices = getRelatedServices();

  return (
    <>

      <title>{service.title}</title>
      <Nav />
      <main className={styles.servicePage}>

        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={1000}
            onClose={hideNotification}
          />
        )}

        <section className={styles.service}>
        <div className={styles.center}>
          <div className={styles.breadcrumb}>
            <Link to="/">Головна</Link>&nbsp; &gt; &nbsp;
            <Link to="/services">Послуги</Link>&nbsp; &gt; &nbsp;
            <span>{service.title}</span>
          </div>

          
        {error && (
        <div className={styles.errorContainer}>
          <div className={styles.center}>
            <h2>{error || 'Послугу не знайдено'}</h2>
            <Link to="/services" className={styles.backButton}>
              Повернутися до послуг
            </Link>
          </div>
          </div>
    )
  }

          <div className={styles.serviceDetail}>
            <div className={styles.serviceImageContainer}>
              <img 
                src={`/${service.img}`}
                alt={service.title}
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
              {service.duration && (
                <div className={styles.durationBadge}>
                  {service.duration}
                </div>
              )}
            </div>

            <div className={styles.serviceInfo}>
              <div className={styles.serviceHeader}>
                <h1>{service.title}</h1>
                <span className={styles.serviceCategory}>
                  {getCategoryName(service.category)}
                </span>
              </div>

              <div className={styles.servicePrice}>
                ${service.price}
                {service.duration && (
                  <span className={styles.priceNote}>
                    ({service.duration})
                  </span>
                )}
              </div>

              <div className={styles.serviceDescription}>
                <h3>Опис послуги</h3>
                <p>{service.description}</p>
              </div>

              <div className={styles.serviceActions}>
                <button 
                  className={styles.addToCartBtn}
                  onClick={handleAddToCart}
                   disabled={buttonTimersRef.current[service.id]}
                 >
                          {buttonTimersRef.current[service.id] ? "✓ Додано" : "Забронювати послугу"}
                </button>
                <Link to="/services" className={styles.backButton}>
                  Назад до послуг
                </Link>
              </div>

              <div className={styles.serviceFeatures}>
                <h3>Що входить у послугу:</h3>
                <ul>
                  <li>Професійне обладнання та інструменти</li>
                  <li>Використання якісних косметичних засобів</li>
                  <li>Індивідуальний підхід до кожного клієнта</li>
                  <li>Гігієнічні стандарти та стерилізація</li>
                  <li>Консультація барбера щодо догляду</li>
                </ul>
              </div>
            </div>
          </div>

          {relatedServices.length > 0 && (
            <div className={styles.relatedServices}>
              <h2>Схожі послуги</h2>
              <div className={styles.relatedGrid}>
                {relatedServices.map(related => (
                  <div key={related.firebaseId || related.id} className={styles.relatedCard}>
                    <div className={styles.relatedImage}>
                      <img 
                        src={`/${related.img}`}
                        alt={related.title}
                        onError={(e) => {
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className={styles.relatedInfo}>
                      <h3>{related.title}</h3>
                      <p>{related.description.substring(0, 100)}...</p>
                      <div className={styles.relatedActions}>
                        <span className={styles.relatedPrice}>${related.price}</span>
                        <Link to={`/service/${related.firebaseId || related.id}`} className={styles.viewButton}>
                          Детальніше
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className={styles.faqSection}>
            <h2>Часті запитання</h2>
            <div className={styles.faqItem}>
              <h3>Чи потрібно записуватися заздалегідь?</h3>
              <p>Так, рекомендуємо записуватися заздалегідь через сайт або телефон. Також ми приймаємо клієнтів за записом.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Чи можна скасувати бронювання?</h3>
              <p>Так, бронювання можна скасувати не пізніше ніж за 2 години до призначеного часу.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Чи є у вас парковка?</h3>
              <p>Так, біля нашого барбершопу є безкоштовна парковка для клієнтів.</p>
            </div>
          </div>
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Service;