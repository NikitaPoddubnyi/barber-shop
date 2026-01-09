import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('admin');
      return storedAdmin === 'true';
    } catch (error) {
      console.error('Помилка при отриманні данних з localStorage:', error);
      return false;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin') {
        setAdmin(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const verifyAdmin = () => {
    try {
      setAdmin(true);
      localStorage.setItem('admin', 'true');
      return true;
    } catch (error) {
      console.error('Помилка при збереженні данних в localStorage:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setAdmin(false);
      localStorage.removeItem('admin');
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Помилка при видаленні даних з localStorage:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ admin, verifyAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}