import { useEffect, useState } from "react";
import styles from "./Buttons.module.scss";

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // useEffect(() => {
    //     const checkMobile = () => {
    //         const mobile = window.innerWidth <= 821;
    //         setIsMobile(mobile);
    //     };
    //     checkMobile();
    //     window.addEventListener('resize', checkMobile);
    //     return () => window.removeEventListener('resize', checkMobile);
    // }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsVisible(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        isVisible && !isMobile && (
            <button
                className={`${styles.scrollToTopButton}`}
                onClick={scrollToTop}
            >
                <i className="fa fa-arrow-up">↑</i>
            </button>
        )
    );
};

export default ScrollToTopButton;