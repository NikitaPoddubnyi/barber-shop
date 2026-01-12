import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "components/nav";
import Footer from "components/footer";
import stylestoLoad from "styles/Services.module.scss";
import styles from "styles/Admin.module.scss";
import { Link } from "react-router-dom";
import OrdersSection from "components/sections/OrderSection/OrdersSection";
import RecordsSection from "components/sections/RecordsSection/RecordsSection";
import { useAdmin } from "utils/AdminUtils";
import Notification from "components/modals/Notification";

const API_BASE_URL = "https://barbershop-3f2ae-default-rtdb.firebaseio.com";

const Admin = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [ordersData, setOrdersData] = useState([]);
  const [recordsData, setRecordsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeSection, setActiveSection] = useState("orders"); 

  useEffect(() => {
    if (!admin) {
      navigate('/admin-verify', { 
        state: { from: location },
        replace: true 
      });
      return;
    }

    fetchData();
    fetchRecordsData();
  }, [admin, navigate, location]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ordersRes = await fetch(`${API_BASE_URL}/orders.json`);
      if (!ordersRes.ok) {
        throw new Error("Помилка з'єднання з сервером");
      }

      const ordersData = await ordersRes.json();

      const ordersArray = ordersData
        ? Object.keys(ordersData).map((key) => {
            const order = ordersData[key];
            const name = order.name || "";
            const email = order.email || "";
            const phone = order.phone || "";
            const date = order.date || "";
            const time = order.time || "";
            const total = order.total || 0;
            const servicesCount = order.servicesCount || 0;
            const paymentMethod = order.paymentMethod || 'cash';
            const marketingAccepted = order.marketingAccepted || false;
            
            let services = [];
            let servicesList = '';
            
            if (order.services && Array.isArray(order.services)) {
              services = order.services;
              servicesList = order.servicesList || services.map(s => s.title).join(', ');
            } else if (order.servicesList) {
              servicesList = order.servicesList;
              services = [{
                title: servicesList,
                price: total,
                quantity: 1
              }];
            }

            return {
              id: key,
              processed: order.processed || false,
              name: name,
              email: email,
              phone: phone,
              date: date,
              time: time,
              paymentMethod: paymentMethod,
              total: parseFloat(total) || 0,
              servicesCount: parseInt(servicesCount) || 0,
              services: services, 
              servicesList: servicesList,
              promoCode: order.promoCode || '',
              barber: order.barber || '',
              marketingAccepted: marketingAccepted,
              specialRequests: order.specialRequests || '',
              appointmentId: order.appointmentId || '',
              createdAt: order.createdAt || new Date().toISOString(),
              updatedAt: order.updatedAt || null
            };
          })
        : [];

      ordersArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrdersData(ordersArray);
      setIsLoading(false);
      
      if (ordersArray.length > 0 && activeSection === 'orders') {
        showNotification(`Завантажено ${ordersArray.length} замовлень`, 'success');
      }
    } catch (error) {
      console.error("Помилка завантаження даних:", error);
      setError("Не вдалося завантажити дані з сервера");
      setIsLoading(false);
      showNotification("Помилка завантаження даних", 'error');
    }
  };

  const fetchRecordsData = async () => {
    setIsLoadingRecords(true);
    try {
      const recordsRes = await fetch(`${API_BASE_URL}/records.json`);
      if (!recordsRes.ok) {
        throw new Error("Помилка з'єднання з сервером");
      }

      const recordsData = await recordsRes.json();

      const recordsArray = recordsData
        ? Object.keys(recordsData).map((key) => {
            const record = recordsData[key];
            return {
              id: key,
              name: record.name || '',
              email: record.email || '',
              message: record.message || '',
              submittedAt: record.submittedAt || record.createdAt || new Date().toISOString(),
            };
          })
        : [];

      recordsArray.sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt));
      
      setRecordsData(recordsArray);
      setIsLoadingRecords(false);
      
      if (recordsArray.length > 0 && activeSection !== 'orders') {
        showNotification(`Завантажено ${recordsArray.length} повідомлень`, 'success');
      }
    } catch (error) {
      console.error("Помилка завантаження записів:", error);
      setIsLoadingRecords(false);
      showNotification("Помилка завантаження повідомлень", 'error');
    }
  };

  const handleUpdateOrder = async (orderId, field) => {
    try {
      const order = ordersData.find((o) => o.id === orderId);
      if (!order) {
        showNotification("Замовлення не знайдено", 'error');
        return;
      }

      const newValue = field === "processed" ? !order.processed : order[field];
      const actionText = field === "processed" 
        ? (newValue ? "опрацьовано" : "відмічено як неопрацьоване")
        : "оновлено";

      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [field]: newValue,
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        setOrdersData((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, [field]: newValue, updatedAt: new Date().toISOString() }
              : o
          )
        );
        
        const orderName = order.name || `Замовлення #${orderId}`;
        showNotification(`Замовлення "${orderName}" ${actionText}`, 'success');
      } else {
        throw new Error('Не вдалося оновити замовлення');
      }
    } catch (e) {
      console.error("Помилка оновлення замовлення:", e);
      showNotification("Не вдалося оновити замовлення", 'error');
    }
  };

  const handleViewOrder = (orderId) => {
    const order = ordersData.find((o) => o.id === orderId);
    if (!order) {
      showNotification("Замовлення не знайдено", 'error');
      return;
    }

    let servicesText = "Послуги:\n";
    if (order.services && Array.isArray(order.services)) {
      order.services.forEach((service, index) => {
        servicesText += `${index + 1}. ${service.title} - $${service.price} × ${service.quantity} = $${(service.price * service.quantity).toFixed(2)}\n`;
      });
    } else if (order.servicesList) {
      servicesText += order.servicesList;
    } else {
      servicesText += "Не вказано";
    }

    const details = `
        ID замовлення: ${order.appointmentId || order.id}
        Час створення: ${new Date(order.createdAt).toLocaleString('uk-UA')}

        Контактна інформація:
        Ім'я: ${order.name || "Не вказано"}
        Email: ${order.email || "Не вказано"}
        Телефон: ${order.phone || "Не вказано"}

        Деталі бронювання:
        Дата: ${order.date || "Не вказано"}
        Час: ${order.time || "Не вказано"}
        Барбер: ${order.barber || "Будь-який"}
        Спосіб оплати: ${order.paymentMethod === 'cash' ? 'Готівка' : order.paymentMethod === 'card' ? 'Картка' : 'Не вказано'}
        Промокод: ${order.promoCode || "Не використовувався"}

        ${servicesText}

        Додаткова інформація:
        Загальна сума: $${order.total || 0}
        Кількість послуг: ${order.servicesCount || 0}
        Статус: ${order.processed ? "Опрацьовано" : "Не опрацьовано"}
        Отримувати повідомлення: ${order.marketingAccepted ? "Так" : "Ні"}

        Особливі побажання: ${order.specialRequests || "Немає"}
        `.trim();

    showNotification(
      `Деталі замовлення\n${details}`,
      'info'
    );
  };

  const handleDeleteOrder = async (orderId) => {
    const order = ordersData.find((o) => o.id === orderId);
    if (!order) {
      showNotification("Замовлення не знайдено", 'error');
      return;
    }

    if (!window.confirm(`Ви впевнені, що хочете видалити замовлення від ${order.name || order.id}?\nЦя дія незворотня!`)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}.json`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setOrdersData((prev) => prev.filter((order) => order.id !== orderId));
        
        const orderName = order.name || `Замовлення #${orderId}`;
        showNotification(`Замовлення "${orderName}" успішно видалено`, 'success');
      } else {
        throw new Error('Не вдалося видалити замовлення');
      }
    } catch (error) {
      console.error("Помилка видалення замовлення:", error);
      showNotification("Не вдалося видалити замовлення", 'error');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    const record = recordsData.find((r) => r.id === recordId);
    if (!record) {
      showNotification("Повідомлення не знайдено", 'error');
      return;
    }

    if (!window.confirm(`Ви впевнені, що хочете видалити повідомлення від ${record.name || record.id}?\nЦя дія незворотня!`)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/records/${recordId}.json`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRecordsData((prev) => prev.filter((record) => record.id !== recordId));
        showNotification("Повідомлення успішно видалено", 'success');
      } else {
        throw new Error('Не вдалося видалити повідомлення');
      }
    } catch (error) {
      console.error("Помилка видалення повідомлення:", error);
      showNotification("Не вдалося видалити повідомлення", 'error');
    }
  };

  const handleRefreshData = () => {
    fetchData();
    fetchRecordsData();
    showNotification("Дані оновлено", 'success');
  };

  const handleDeleteAllProcessed = async () => {
    const processedOrders = ordersData.filter(order => order.processed);
    
    if (processedOrders.length === 0) {
      showNotification("Немає опрацьованих замовлень для видалення", 'info');
      return;
    }

    if (!window.confirm(`Ви впевнені, що хочете видалити ВСІ опрацьовані замовлення (${processedOrders.length} шт.)?\nЦя дія незворотня!`)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const deletePromises = processedOrders.map(order => 
        fetch(`${API_BASE_URL}/orders/${order.id}.json`, { method: "DELETE" })
      );
      
      await Promise.all(deletePromises);
      
      setOrdersData(prev => prev.filter(order => !order.processed));
      showNotification(`Успішно видалено ${processedOrders.length} опрацьованих замовлень`, 'success');
      fetchData();
    } catch (error) {
      showNotification("Не вдалося видалити опрацьовані замовлення", 'error');
    } finally {
      setIsLoading(false);
    }
  };

    const handleDeleteAllRecords = async () => {
    const processedOrders = recordsData;
    
    if (processedOrders.length === 0) {
      showNotification("Немає повідомлень видалення", 'info');
      return;
    }

    if (!window.confirm(`Ви впевнені, що хочете видалити ВСІ повідомлення (${processedOrders.length} шт.)?\nЦя дія незворотня!`)) {
      return;
    }

    
    try {
      const deletePromises = processedOrders.map(record => 
        fetch(`${API_BASE_URL}/records/${record.id}.json`, { method: "DELETE" })
      );
      
      await Promise.all(deletePromises);
            fetchRecordsData();
    } catch (error) {
      showNotification("Не вдалося видалити повідомлення", 'error');
  } finally {
      setIsLoading(false);
    }
  };

  if (!admin) {
    return (
      <>
        <Nav />
        <div className={stylestoLoad.loading}>
          <div className={stylestoLoad.spinner}></div>
          <p>Перевірка доступу...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (isLoading || isLoadingRecords) {
    return (
      <>
    <title>Панель адміністратора</title>

        <Nav />
        <div className={stylestoLoad.loading}>
          <div className={stylestoLoad.spinner}></div>
          <p>Завантаження даних...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
    <title>Панель адміністратора</title>
        <Nav />
        <div className={stylestoLoad.errorContainer}>
          <div className={stylestoLoad.center}>
            <h2>{error}</h2>
            <button
              onClick={fetchData}
              className={stylestoLoad.retryButton}
            >
              Спробувати знову
            </button>
            <Link to="/" className={stylestoLoad.backButton}>
              На головну
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const processedCount = ordersData.filter((o) => o.processed).length;
  const notProcessedCount = ordersData.filter((o) => !o.processed).length;
  
  const totalRevenue = () => {
    return ordersData
      .filter(order => order.processed === true)
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  };

  const servicesStats = {};
  ordersData.forEach(order => {
    if (order.services && Array.isArray(order.services)) {
      order.services.forEach(service => {
        const serviceName = service.title;
        if (!servicesStats[serviceName]) {
          servicesStats[serviceName] = {
            count: 0,
            revenue: 0,
            quantity: 0
          };
        }
        servicesStats[serviceName].count++;
        servicesStats[serviceName].revenue += (service.price * service.quantity);
        servicesStats[serviceName].quantity += service.quantity;
      });
    }
  });

  const popularServices = Object.entries(servicesStats)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 3);

  const unreadMessagesCount = recordsData.length;

  return (
    <>
    <title>Панель адміністратора</title>
      <Nav />
      <header className={styles.header}>
        <div className={styles.center}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Панель адміністратора</h1>
              <p className={styles.subtitle}>
                Керування замовленнями та повідомленнями клієнтів
              </p>
            </div>
            <div className={styles.headerActions}>
              <button 
                onClick={handleRefreshData}
                className={styles.refreshButton}
                title="Оновити дані"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
                Оновити
              </button>
              {activeSection === 'orders' && processedCount > 0 ? (
                <button 
                  onClick={handleDeleteAllProcessed}
                  className={styles.deleteAllButton}
                  title="Видалити всі опрацьовані замовлення"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                  Видалити опрацьовані ({processedCount})
                </button>
              ) : 
                 <button 
                  onClick={handleDeleteAllRecords}
                  className={styles.deleteAllButton}
                  title="Видалити всі опрацьовані замовлення"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                  Видалити всі повідомлення ({unreadMessagesCount})
                </button>}
              <button 
                onClick={() => {
                  logout();
                  showNotification("Ви успішно вийшли з системи", 'success');
                }}
                className={styles.logoutButton}
                title="Вийти з адмін панелі"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.center}>
          <div className={styles.dashboard}>
            <div className={styles.dashboardStats}>
              <div className={styles.statCard}>
                <h3>Всього замовлень</h3>
                <p className={styles.statNumber}>
                  {ordersData.length}
                </p>
              </div>
              <div
                className={`${styles.statCard} ${styles.revenueCard}`}
              >
                <h3>Загальний дохід</h3>
                <p className={styles.statNumber}>
                  ${totalRevenue().toFixed(2)}
                </p>
              </div>
              <div
                className={`${styles.statCard} ${styles.processedCard}`}
              >
                <h3>Опрацьовані</h3>
                <p className={styles.statNumber}>
                  {processedCount}
                </p>
              </div>
              <div
                className={`${styles.statCard} ${styles.notProcessedCard}`}
              >
                <h3>Не опрацьовані</h3>
                <p className={styles.statNumber}>
                  {notProcessedCount}
                </p>
              </div>
              <div className={`${styles.statCard} ${styles.messagesCard}`}>
                <h3>Повідомлення</h3>
                <p className={styles.statNumber}>
                  {recordsData.length}
                </p>
                {unreadMessagesCount > 0 && (
                  <span className={styles.unreadBadge}>{unreadMessagesCount}</span>
                )}
              </div>
            </div>

            {popularServices.length > 0 && (
              <div className={styles.servicesStats}>
                <h3>Популярні послуги</h3>
                <div className={styles.servicesList}>
                  {popularServices.map(([serviceName, stats], index) => (
                    <div key={serviceName} className={styles.serviceStatItem}>
                      <div className={styles.serviceStatHeader}>
                        <span className={styles.serviceRank}>#{index + 1}</span>
                        <span className={styles.serviceName}>{serviceName}</span>
                      </div>
                      <div className={styles.serviceStatDetails}>
                        <span>Замовлень: {stats.count}</span>
                        <span>Кількість: {stats.quantity}</span>
                        <span className={styles.serviceRevenue}>
                          ${stats.revenue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.sectionTabs}>
              <button
                className={`${styles.tabButton} ${activeSection === 'orders' ? styles.active : ''}`}
                onClick={() => setActiveSection('orders')}
              >
                Замовлення ({ordersData.length})
              </button>
              <button
                className={`${styles.tabButton} ${activeSection === 'messages' ? styles.active : ''}`}
                onClick={() => setActiveSection('messages')}
              >
                Повідомлення ({recordsData.length})
                {unreadMessagesCount > 0 && (
                  <span className={styles.tabBadge}>{unreadMessagesCount}</span>
                )}
              </button>
            </div>

            {activeSection === 'orders' ? (
              <OrdersSection
                data={ordersData}
                isLoading={isLoading}
                onUpdateOrder={handleUpdateOrder}
                onViewOrder={handleViewOrder}
                onDeleteOrder={handleDeleteOrder}
                onRefresh={fetchData}
              />
            ) : (
              <RecordsSection
                data={recordsData}
                isLoading={isLoadingRecords}
                onDeleteRecord={handleDeleteRecord}
                onRefresh={fetchRecordsData}
              />
            )}
          </div>
        </div>
      </main>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === 'info' ? 20000 : 3000} 
          onClose={closeNotification}
        />
      )}
      
      <Footer />
    </>
  );
};

export default Admin;