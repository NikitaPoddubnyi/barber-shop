import React, { useState, useEffect, useRef } from 'react';
import styles from './OrdersSection.module.scss';

const OrdersSection = ({ 
  data = [], 
  isLoading = false, 
  onUpdateOrder, 
  onViewOrder,
  onDeleteOrder,
  onRefresh 
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); 
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const OrdersRef = useRef(null);

    const filteredData = data.filter(order => {
        if (filterStatus !== 'all') {
            const isProcessed = order.processed === true;
            if (filterStatus === 'processed' && !isProcessed) return false;
            if (filterStatus === 'not_processed' && isProcessed) return false;
        }
        
        if (selectedPaymentMethod !== 'all') {
            if (order.paymentMethod !== selectedPaymentMethod) return false;
        }
        
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                (order.name && order.name.toLowerCase().includes(searchLower)) ||
                (order.email && order.email.toLowerCase().includes(searchLower)) ||
                (order.phone && order.phone.includes(searchTerm)) ||
                (order.id && order.id.toLowerCase().includes(searchLower)) ||
                (order.promoCode && order.promoCode.toLowerCase().includes(searchLower)) ||
                (order.servicesList && order.servicesList.toLowerCase().includes(searchLower)) 
            );
        }
        
        return true;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const sortedData = [...filteredData].sort((a, b) => {
        if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const handleSort = (key) => {
        setSortConfig(({
            key,
            direction: key === sortConfig.key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleProcessToggle = (orderId) => {
        if (onUpdateOrder) {
            onUpdateOrder(orderId, 'processed');
        }
    };

      const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      if (OrdersRef.current) {
        OrdersRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        }, 1);
      }
    })
  };

    const handleViewClick = (orderId) => {
        if (onViewOrder) {
            onViewOrder(orderId);
        }
    };

    const handleDeleteClick = (orderId) => {
        if (onDeleteOrder) {
            onDeleteOrder(orderId);
        }
    };

    const toggleExpandOrder = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
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
    
    const calculateStats = () => {
        if (data.length === 0) return null;
        
        const totalOrders = data.length;
        const processedOrders = data.filter(o => o.processed === true).length;
        const notProcessedOrders = data.filter(o => !o.processed).length;
        
        const cashOrders = data.filter(o => o.paymentMethod === 'cash').length;
        const cardOrders = data.filter(o => o.paymentMethod === 'card').length;
        
        const totalRevenue = data.reduce((sum, order) => {
            if(order.processed === true){
            return sum + (parseFloat(order.total) || 0);
        }
        return sum;
    }, 0);
        
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        return {
            totalOrders,
            processedOrders,
            notProcessedOrders,
            cashOrders,
            cardOrders,
            totalRevenue,
            avgOrderValue: avgOrderValue.toFixed(2)
        };
    };
    
    const stats = calculateStats();
    
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };
    
    const formatTime = (timeString) => {
        if (!timeString) return '—';
        return timeString;
    };
    
    const formatPrice = (price) => {
        if (!price) return '$0.00';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const renderFullServices = (services, servicesList) => {
        if (services && Array.isArray(services) && services.length > 0) {
            return (
                <div className={styles.fullServicesList}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                            <span className={styles.serviceName}>
                                {service.title}
                            </span>
                            <span className={styles.serviceDetails}>
                                ×{service.quantity} = ${(service.price * service.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        } else if (servicesList) {
            return (
                <div className={styles.fullServicesList}>
                    {servicesList.split(', ').map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                            <span className={styles.serviceName}>
                                {service}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return '—';
    };

    const renderCompactServices = (services, servicesList, orderId) => {
        const isExpanded = expandedOrders.has(orderId);
        
        if (services && Array.isArray(services) && services.length > 0) {
            const totalQuantity = services.reduce((sum, s) => sum + s.quantity, 0);
            return (
                <div 
                    className={styles.compactServices}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandOrder(orderId);
                    }}
                >
                    <span className={styles.servicesPreview}>
                        {services.length === 1 
                            ? services[0].title 
                            : `${services[0].title} +${totalQuantity - 1}`}
                    </span>
                    <span className={styles.servicesCountBadge}>
                        {totalQuantity}
                    </span>
                    <button 
                        className={styles.toggleExpandBtn}
                        title={isExpanded ? "Сховати послуги" : "Показати всі послуги"}
                    >
                        {isExpanded ? '▲' : '▼'}
                    </button>
                </div>
            );
        } else if (servicesList) {
            const servicesArray = servicesList.split(', ');
            return (
                <div 
                    className={styles.compactServices}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandOrder(orderId);
                    }}
                >
                    <span className={styles.servicesPreview}>
                        {servicesArray.length === 1 
                            ? servicesArray[0] 
                            : `${servicesArray[0]} +${servicesArray.length - 1}`}
                    </span>
                    <span className={styles.servicesCountBadge}>
                        {servicesArray.length}
                    </span>
                    <button 
                        className={styles.toggleExpandBtn}
                        title={isExpanded ? "Сховати послуги" : "Показати всі послуги"}
                    >
                        {isExpanded ? '▲' : '▼'}
                    </button>
                </div>
            );
        }
        return '—';
    };

    if (isLoading) {
        return (
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.title}>Замовлення</h2>
                    <span className={styles.loadingBadge}>Завантаження...</span>
                </div>
                </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.title}>Замовлення</h2>
                    <span className={styles.emptyBadge}>Пусто</span>
                </div>
                <div className={styles.emptyTable}>
                    <p>Немає доступних замовлень</p>
                    {onRefresh && (
                        <button 
                            onClick={onRefresh}
                            className={styles.refreshButton}
                        >
                            Оновити
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <section className={styles.ordersSection} ref={OrdersRef}>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.title}>
                            Замовлення <span className={styles.count}>({filteredData.length})</span>
                        </h2>
                        {onRefresh && (
                        <button 
                            onClick={onRefresh}
                            className={styles.refreshBtn}
                            title="Оновити список"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                            </svg>
                        </button>
                        )}
                    </div>
                    
                    {stats && (
                        <div className={styles.headerRight}>
                            <div className={styles.stats}>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{stats.totalOrders}</span>
                                        <span className={styles.statLabel}>Всього</span>
                                    </div>
                                    <div className={`${styles.statItem} ${styles.revenue}`}>
                                        <span className={styles.statValue}>{formatPrice(stats.totalRevenue)}</span>
                                        <span className={styles.statLabel}>Дохід</span>
                                    </div>
                                    <div className={`${styles.statItem} ${styles.processed}`}>
                                        <span className={styles.statValue}>{stats.processedOrders}</span>
                                        <span className={styles.statLabel}>Опрацьовано</span>
                                    </div>
                                    <div className={`${styles.statItem} ${styles.notProcessed}`}>
                                        <span className={styles.statValue}>{stats.notProcessedOrders}</span>
                                        <span className={styles.statLabel}>Не опрацьовано</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={styles.tableControls}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Пошук по імені, email, телефону, послугах..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                        {searchTerm && (
                            <button 
                                className={styles.clearSearchBtn}
                                onClick={() => setSearchTerm('')}
                                title="Очистити пошук"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    <div className={styles.filtersRow}>
                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Статус:</span>
                            <div className={styles.filterButtons}>
                                <button
                                    className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
                                    onClick={() => handleFilterChange('all')}
                                >
                                    Всі
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${filterStatus === 'processed' ? styles.active : ''}`}
                                    onClick={() => handleFilterChange('processed')}
                                >
                                    Опрацьовані
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${filterStatus === 'not_processed' ? styles.active : ''}`}
                                    onClick={() => handleFilterChange('not_processed')}
                                >
                                    Не опрацьовані
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <span className={styles.filterLabel}>Оплата:</span>
                            <div className={styles.filterButtons}>
                                <button
                                    className={`${styles.filterBtn} ${selectedPaymentMethod === 'all' ? styles.active : ''}`}
                                    onClick={() => handlePaymentMethodChange('all')}
                                >
                                    Всі
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${selectedPaymentMethod === 'cash' ? styles.active : ''}`}
                                    onClick={() => handlePaymentMethodChange('cash')}
                                >
                                    Готівка
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${selectedPaymentMethod === 'card' ? styles.active : ''}`}
                                    onClick={() => handlePaymentMethodChange('card')}
                                >
                                    Картка
                                </button>
                            </div>
                        </div>
                        
                        <button 
                            className={styles.resetFiltersBtn}
                            onClick={() => {
                                setSearchTerm('');
                                setFilterStatus('all');
                                setSelectedPaymentMethod('all');
                            }}
                        >
                            Скинути фільтри
                        </button>
                    </div>
                </div>
                
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th 
                                    className={`${styles.sortableHeader} ${sortConfig.key === 'date' ? styles.active : ''}`}
                                    onClick={() => handleSort('date')}
                                >
                                    Дата
                                    {sortConfig.key === 'date' && (
                                        <span className={styles.sortArrow}>
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th 
                                    className={`${styles.sortableHeader} ${sortConfig.key === 'name' ? styles.active : ''}`}
                                    onClick={() => handleSort('name')}
                                >
                                    Клієнт
                                    {sortConfig.key === 'name' && (
                                        <span className={styles.sortArrow}>
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th>Телефон</th>
                                <th className={styles.servicesColumnHeader}>Послуги</th> 
                                <th 
                                    className={`${styles.sortableHeader} ${sortConfig.key === 'total' ? styles.active : ''}`}
                                    onClick={() => handleSort('total')}
                                >
                                    Сума
                                    {sortConfig.key === 'total' && (
                                        <span className={styles.sortArrow}>
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th>Оплата</th>
                                <th 
                                    className={`${styles.sortableHeader} ${sortConfig.key === 'processed' ? styles.active : ''}`}
                                    onClick={() => handleSort('processed')}
                                >
                                    Статус
                                    {sortConfig.key === 'processed' && (
                                        <span className={styles.sortArrow}>
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </th>
                                <th className={styles.actionsHeader}>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((order, index) => {
                                const isExpanded = expandedOrders.has(order.id);
                                return (
                                    <React.Fragment key={order.id || index}>
                                        <tr className={styles.tableRow}>
                                            <td className={styles.cell}>
                                                <div className={styles.dateCell}>
                                                    <span className={styles.dateValue}>{formatDate(order.date)}</span>
                                                    {order.time && (
                                                        <small className={styles.timeSmall}>{formatTime(order.time)}</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={styles.cell}>
                                                <div className={styles.nameCell}>
                                                    <span className={styles.nameValue}>{order.name}</span>
                                                    {order.email && (
                                                        <small className={styles.emailSmall}>{order.email}</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={styles.cell}>
                                                <a href={`tel:${order.phone}`} className={styles.phoneLink}>
                                                    {order.phone}
                                                </a>
                                            </td>
                                            <td className={`${styles.cell} ${styles.servicesCell}`}>
                                                {renderCompactServices(order.services, order.servicesList, order.id)}
                                            </td>
                                            <td className={`${styles.cell} ${styles.priceCell}`}>
                                                <span className={styles.priceValue}>{formatPrice(order.total)}</span>
                                            </td>
                                            <td className={styles.cell}>
                                                <span className={`${styles.paymentBadge} ${
                                                    order.paymentMethod === 'cash' ? styles.cash : 
                                                    order.paymentMethod === 'card' ? styles.card : 
                                                    styles.default
                                                }`}>
                                                    {order.paymentMethod === 'cash' ? 'Готівка' : 
                                                     order.paymentMethod === 'card' ? 'Картка' : 
                                                     'Інше'}
                                                </span>
                                            </td>
                                            <td className={styles.cell}>
                                                <span className={`${styles.statusBadge} ${
                                                    order.processed === true ? styles.processed : styles.notProcessed
                                                }`}>
                                                    {order.processed === true ? 'Опрацьовано' : `Не опрацьовано`}
                                                </span>
                                            </td>
                                            <td className={`${styles.cell} ${styles.actionsCell}`}>
                                                <div className={styles.actionButtons}>
                                                    <button 
                                                        className={styles.viewBtn}
                                                        onClick={() => handleViewClick(order.id)}
                                                        title="Переглянути деталі замовлення"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                            <circle cx="12" cy="12" r="3"/>
                                                        </svg>
                                                        Перегляд
                                                    </button>
                                                    <button 
                                                        className={`${styles.processButton} ${
                                                            order.processed === true ? styles.processedBtn : styles.notProcessedBtn
                                                        }`}
                                                        onClick={() => handleProcessToggle(order.id)}
                                                        title={order.processed === true ? "Позначити як не опрацьоване" : "Позначити як опрацьоване"}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            {order.processed ? (
                                                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                                                            ) : (
                                                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                                                            )}
                                                            <polyline points="22 4 12 14.01 9 11.01"/>
                                                        </svg>
                                                        {order.processed === true ? 'Опрацьовано' : 'Не опрацьовано'}
                                                    </button>
                                                    <button 
                                                        className={styles.deleteBtn}
                                                        onClick={() => handleDeleteClick(order.id)}
                                                        title="Видалити замовлення"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                                        </svg>
                                                        Видалити
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className={styles.expandedRow}>
                                                <td colSpan="8" className={styles.expandedCell}>
                                                    <div className={styles.expandedServicesContainer}>
                                                        <div className={styles.expandedHeader}>
                                                            <h4>Детальний перелік послуг:</h4>
                                                            <button 
                                                                className={styles.closeExpandBtn}
                                                                onClick={() => toggleExpandOrder(order.id)}
                                                            >
                                                                Згорнути &times;
                                                            </button>
                                                        </div>
                                                        {renderFullServices(order.services, order.servicesList, order)}
                                                        <div className={styles.orderAdditionalInfo}>
                                                            {order.barber && (
                                                                <div className={styles.barberInfo}>
                                                                    <strong>Барбер:&nbsp;&nbsp;</strong> 
                                                                    <span className={styles.barberValue}>{order.barber}</span>
                                                                </div>
                                                            )}
                                                            {order.promoCode && (
                                                                <div className={styles.promoCodeInfo}>
                                                                    <strong>Промокод:&nbsp;&nbsp;</strong> 
                                                                    <span className={styles.promoCodeValue}>{order.promoCode}</span>
                                                                </div>
                                                            )}
                                                            {order.specialRequests && (
                                                                <div className={styles.specialRequestsInfo}>
                                                                    <strong>Особливі побажання:</strong> 
                                                                    <span className={styles.specialRequestsValue}>{order.specialRequests}</span>
                                                                </div>
                                                            )}
                                                            {order.createdAt && (
                                                                <div className={styles.createdInfo}>
                                                                    <strong>Створено:&nbsp;&nbsp;</strong> 
                                                                    <span className={styles.createdValue}>
                                                                        {new Date(order.createdAt).toLocaleString('uk-UA')}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={styles.expandedActions}>
                                                            <div className={styles.servicesTotal}>
                                                                <strong>Загальна сума: {formatPrice(order.total)}</strong>
                                                            </div>
                                                            <div className={styles.actionButtons}>
                                                                <button 
                                                                    className={`${styles.processButton} ${styles.large}`}
                                                                    onClick={() => handleProcessToggle(order.id)}
                                                                >
                                                                    {order.processed === true ? 'Відмінити опрацьоване' : 'Позначити як опрацьоване'}
                                                                </button>
                                                                <button 
                                                                    className={styles.deleteBtn}
                                                                    onClick={() => handleDeleteClick(order.id)}
                                                                >
                                                                    Видалити замовлення
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {filteredData.length === 0 && (
                    <div className={styles.noResults}>
                        <p>Замовлень не знайдено за обраними критеріями</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setFilterStatus('all');
                                setSelectedPaymentMethod('all');
                            }}
                            className={styles.resetButton}
                        >
                            Скинути фільтри
                        </button>
                    </div>
                )}
                
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <div className={styles.paginationInfo}>
                            Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} з {filteredData.length} замовлень
                        </div>
                        
                        <button
                            className={`${styles.pageButton} ${styles.prevButton}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Назад
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
                                        className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ''}`}
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
                            Далі →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrdersSection;