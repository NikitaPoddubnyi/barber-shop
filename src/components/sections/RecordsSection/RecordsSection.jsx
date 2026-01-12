import React, { useState, useEffect, useRef } from 'react';
import styles from 'styles/OrdersSection.module.scss';

const RecordsSection = ({ data = [], isLoading = false, onDeleteRecord, onRefresh }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); 
    const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedMessages, setExpandedMessages] = useState(new Set());
    const RecordsRef = useRef(null);

    const filteredData = data.filter(record => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                (record.name && record.name.toLowerCase().includes(searchLower)) ||
                (record.email && record.email.toLowerCase().includes(searchLower)) ||
                (record.message && record.message.toLowerCase().includes(searchLower))
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      if (RecordsRef.current) {
    RecordsRef.current.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
    }, 1)
};

    const toggleMessageExpansion = (id) => {
        setExpandedMessages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
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
    
    const formatDateTime = (dateString) => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const truncateMessage = (message, length = 100) => {
        if (!message) return '';
        if (message.length <= length) return message;
        return message.substring(0, length) + '...';
    };

    const handleDelete = (id) => {
        if (onDeleteRecord) {
            onDeleteRecord(id);
        }
    };



    if (isLoading) {
        return (
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.title}>Повідомлення</h2>
                    <span className={styles.loadingBadge}>Завантаження...</span>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.title}>Повідомлення</h2>
                    <span className={styles.emptyBadge}>Пусто</span>
                </div>
                <div className={styles.emptyTable}>
                    <p>Немає повідомлень від клієнтів</p>
                    <button 
                        onClick={onRefresh}
                        className={styles.refreshButton}
                    >
                        Оновити
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className={styles.recordsSection} ref={RecordsRef}>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.title}>
                            Повідомлення <span className={styles.count}>({filteredData.length})</span>
                        </h2>
                    </div>
                    <div className={styles.headerActions}>
                        <button 
                            onClick={onRefresh}
                            className={styles.refreshBtn}
                            title="Оновити список"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className={styles.tableControls}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Пошук по імені, email, повідомленню..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                    </div>

                </div>
                
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th 
                                    className={`${styles.sortableHeader} ${sortConfig.key === 'submittedAt' ? styles.active : ''}`}
                                    onClick={() => handleSort('submittedAt')}
                                >
                                    Дата відправки
                                    {sortConfig.key === 'submittedAt' && (
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
                                <th>Email</th>
                                <th className={styles.messageColumnHeader}>Повідомлення</th>
                                <th className={styles.actionsHeader}>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((record, index) => {
                                const isExpanded = expandedMessages.has(record.id);
                                const messagePreview = truncateMessage(record.message);
                                
                                return (
                                    <React.Fragment key={record.id || index}>
                                        <tr className={styles.tableRow}>
                                            <td className={styles.cell}>
                                                <div className={styles.dateCell}>
                                                    <span className={styles.dateValue}>
                                                        {formatDateTime(record.submittedAt)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.cell}>
                                                <div className={styles.nameCell}>
                                                    <span className={styles.nameValue}>{record.name || '—'}</span>
                                                </div>
                                            </td>
                                            <td className={styles.cell}>
                                                <a href={`mailto:${record.email}`} className={styles.emailLink}>
                                                    {record.email || '—'}
                                                </a>
                                            </td>
                                            <td className={`${styles.cell} ${styles.messageCell}`}>
                                                <div className={styles.messageContent}>
                                                    <span className={styles.messagePreview}>
                                                        {isExpanded ? record.message : messagePreview}
                                                    </span>
                                                    {record.message && record.message.length > 100 && (
                                                        <button
                                                            className={styles.expandMessageBtn}
                                                            onClick={() => toggleMessageExpansion(record.id)}
                                                        >
                                                            {isExpanded ? 'Згорнути' : 'Розгорнути'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={styles.cell}>
                                                <div className={styles.actionButtons}>
                                                    <button 
                                                        className={styles.replyBtn}
                                                        onClick={() => window.location.href = `mailto:${record.email}?subject=Відповідь на ваше повідомлення`}
                                                        title="Відповісти на email"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                        <path d="M22 6l-10 7L2 6"/>
                                                        </svg>
                                                        Відповісти
                                                    </button>
                                                    <button 
                                                        className={styles.deleteBtn}
                                                        onClick={() => handleDelete(record.id)}
                                                        title="Видалити повідомлення"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                                                        </svg>                                              
                                                        Видалити
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {filteredData.length === 0 && (
                    <div className={styles.noResults}>
                        <p>Повідомлень не знайдено за обраними критеріями</p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
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
                            Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} з {filteredData.length} повідомлень
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

export default RecordsSection;