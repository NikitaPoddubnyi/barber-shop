import { Link } from 'react-router-dom';
import styles from "styles/Buttons.module.scss";
import { getCartCount } from "utils/cartUtils";
import { useState, useEffect } from "react";

const NavButton = () => {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = () => {
        setCartCount(getCartCount());
    };

    useEffect(() => {
        const checkCartChanges = () => {
            updateCartCount();
        };
    
        checkCartChanges();
    
        window.addEventListener('storage', checkCartChanges);
        const interval = setInterval(checkCartChanges, 300);
    
        return () => {
            window.removeEventListener('storage', checkCartChanges);
            clearInterval(interval);
        };
    }, []);

    return (
    <Link 
        to="/cart" 
        className={styles.navButton} 
        aria-label={`Корзина послуг, ${cartCount} товарів`}
        title={`Перейти до корзини (${cartCount} товарів)`}
    >
        <span className={styles.cartText}>Booking cart</span>
        {cartCount > 0 ? (
            <span 
                className={styles.cartBadge}
                aria-label={`${cartCount} товарів у корзині`}
            >
                {cartCount} 
            </span>
        ) : (
            <span className={styles.cartBadge}>0</span>
        )}
    </Link>
    );
};

export default NavButton;