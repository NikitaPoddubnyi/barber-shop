import React, { useState, useEffect, useRef } from "react";
import Nav from "components/nav";
import Footer from "components/footer";
import styles from "styles/Services.module.scss";
import { addToCart } from "utils/cartUtils";
import fallbackData from 'data/data.json';
import ServicesButton from "components/buttons/ServicesButton";
import { NavLink } from "react-router-dom";
import Notification from "components/modals/Notification"; 
import {hipsterBurber, cosmetic, tools} from "assets";
import {MainServicesSection } from "components/sections";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const API_BASE_URL = 'https://barbershop-3f2ae-default-rtdb.firebaseio.com'; 

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [ref1, active1] = useScrollAnimation(0.7);
  const [ref2, active2] = useScrollAnimation(0.7);
  const [ref3, active3] = useScrollAnimation(0.7);
  const [ref4, active4] = useScrollAnimation(0.9);
  // const [ref5, active5] = useScrollAnimation(0.7);
  // const [ref6, active6] = useScrollAnimation(0.7);
  
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
        setError(null);
        
        const servicesResponse = await fetch(`${API_BASE_URL}/services.json`)
        if (!servicesResponse.ok) throw new Error('Помилка завантаження послуг');
        const servicesData = await servicesResponse.json();

        const categoriesResponse = await fetch(`${API_BASE_URL}/categories.json`);
        let categoriesData = [];
        if (categoriesResponse.ok) {
          categoriesData = await categoriesResponse.json();
        }
        
        let servicesArray = [];
        if (servicesData) {
          servicesArray = servicesData;
        }
        
        setServices(servicesArray);

        const allCategories = [
          { id: "all", name: "Всі послуги" },
          ...(categoriesData || [])
        ];
        setCategories(allCategories);

        showNotification(`Всього завантажено: ${servicesArray.length} послуг`, 'success');
        
        setLoading(false);
      } catch (err) {
        console.error("Помилка при отриманні даних:", err);
        setError("Не вдалося завантажити дані з API. Використовуються локальні дані.");
        setLoading(false);
        
        setServices(fallbackData.services || []);
        showNotification(`Всього завантажено: ${fallbackData.services.length} послуг`, 'success');
        
        const allCategories = [
          { id: "all", name: "Всі послуги" },
          ...(fallbackData.categories || [])
        ];
        setCategories(allCategories);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = services;
    
    if (selectedCategory !== "all") {
      filtered = services.filter(service => service.category === selectedCategory);
    }
    
    filtered = [...filtered].sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        return (a.price - b.price) * multiplier;
    });
    
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [selectedCategory, sortOrder, services]);

  const showNotification = (message, type = 'success') => {
    setNotification({
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 1500, behavior: 'smooth' });
  };

  const handleAddToCart = (service, e) => {
    try {
      addToCart(service);

      showNotification(
        `${service.title} додано до кошика! Ціна: $${service.price}`,
        'success'
      );

      const button = e.currentTarget;
      const serviceId = service.id;
      const originalText = button.textContent;
      
      if (buttonTimersRef.current[serviceId]) {
        clearTimeout(buttonTimersRef.current[serviceId]);
        delete buttonTimersRef.current[serviceId];
      }
      
      button.textContent = "✓ Додано";
      button.disabled = true;
      
      buttonTimersRef.current[serviceId] = setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        delete buttonTimersRef.current[serviceId];
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

  useEffect(() => {
    return () => {
      Object.values(buttonTimersRef.current).forEach(timer => {
        clearTimeout(timer);
      });
      buttonTimersRef.current = {};
    };
  }, []);

  const getCategoryName = (categoryId) => {
    if (categoryId === "all") return "Всі послуги";
    
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getServicesCount = (categoryId) => {
    if (categoryId === "all") return services.length;
    return services.filter(service => service.category === categoryId).length;
  };

  const retryFetch = () => {
    window.location.reload();
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading) return (
    <>
    <title>Наші послуги</title>

      <Nav />
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Завантаження послуг...</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
    <title>Наші послуги</title>

      <Nav />
          <header className={styles.servicesHeader}>
          <div className={styles.center}>
            <h1 className={`${styles.title} ${active3 ? styles.active : ""}`} ref={ref3}>Наші послуги</h1>
            <p className={`${styles.description} ${active4 ? styles.active : ""} `} ref={ref4}>Виберіть послугу, яка підходить саме вам</p>
            <ServicesButton />
          </div>
        </header>

      <main className={styles.servicesPage}>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={1000}
            onClose={hideNotification}
          />
        )}
                    
           <MainServicesSection/>   

                   {error && (
          <div className={styles.warning}>
            <h2>{error}</h2>
            <button onClick={retryFetch} className={styles.retryButton}>
              Спробувати знову
            </button>
          </div>
        )}      

        <section className={styles.servicesControls}>
          <div className={styles.center}>
            <div className={styles.controlsWrapper}>
              <div className={styles.categories}>
                <h3>Категорії:</h3>
                <div className={styles.categoryButtons}>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ""}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                      <span className={styles.categoryCount}>
                        ({getServicesCount(category.id)})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.sorting}>
                <h3>Сортувати за ціною:</h3>
                <select 
                  className={styles.sortSelect}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">За зростанням</option>
                  <option value="desc">За спаданням</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.servicesList}>
          <div className={styles.center}>
            <div className={styles.categoryInfo}>
              <h2>
                {selectedCategory === "all" 
                  ? "Всі послуги" 
                  : `${getCategoryName(selectedCategory)} (${filteredServices.length})`}
              </h2>
              <div className={styles.paginationInfo}>
                Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredServices.length)} з {filteredServices.length} послуг
              </div>
            </div>
            
            <div className={styles.servicesGrid}>
              {currentItems.length === 0 ? (
                <div className={styles.noResults}>
                  <p>Послуг у цій категорії не знайдено</p>
                </div>
              ) : (
                currentItems.map(service => (
                  <div key={service.id} className={styles.serviceCard}>
                    <div className={styles.serviceImage}>
                      <img 
                        src={service.img} 
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
                    <div className={styles.serviceContent}>
                      <div className={styles.serviceHeader}>
                        <h3>{service.title}</h3>
                        <span className={styles.serviceCategory}>
                          {getCategoryName(service.category)}
                        </span>
                      </div>
                      <p className={styles.serviceDescription}>
                        {service.description.substring(0, 100)}...
                      </p>
                      <div className={styles.serviceDetails}>
                        <span className={styles.servicePrice}>
                          ${service.price}
                        </span>
                        <button 
                          className={styles.addToCartBtn}
                          onClick={(e) => handleAddToCart(service, e)}
                          disabled={buttonTimersRef.current[service.id]} 
                        >
                          {buttonTimersRef.current[service.id] ? "✓ Додано" : "Забронювати"}
                        </button>
                        <NavLink to={`/service/${service.id}`} className={styles.moreButton}>Детальніше</NavLink>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageButton} ${styles.prevButton}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &larr; Назад
                </button>
                
                <div className={styles.pageNumbers}>
                  {getPageNumbers().map((pageNumber, index) => (
                    pageNumber === '...' ? (
                      <span key={`dots-${index}`} className={styles.pageDots}>
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNumber}
                        className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ""}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    )
                  ))}
                </div>
                
                <button
                  className={`${styles.pageButton} ${styles.nextButton}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Далі &rarr;
                </button>
              </div>
            )}
          </div>
        </section>

          <section className={styles.advantages}>
        <div className={styles.center}>
        <h2 className={`${styles.advantagesTitle} ${active1 ? styles.active : ''} `} ref={ref1}>Наші переваги</h2>

        <div className={styles.advantagesGrid}>
        <div className={`${styles.advantageCard} ${active2 ? styles.active : ''}`} ref={ref2} >
            <img src={cosmetic} alt="Якісна продукція" />
            <span>Якісна продукція</span>
          </div>

          <div className={`${styles.advantageCard} ${active2 ? styles.active : ''}`} ref={ref2}>
            <img src={tools} alt="Якісне обладнання" />
            <span>Якісне обладнання</span>
          </div>

          <div className={`${styles.advantageCard} ${active2 ? styles.active : ''}`} ref={ref2}>
            <img src={hipsterBurber} alt="Професійні перукарі" />
            <span>Професійні перукарі</span>
          </div>
        </div>
      </div>
      </section>

      </main>
      <Footer />
    </>
  );
};

export default Services;