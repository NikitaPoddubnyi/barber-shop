import { useState, useEffect } from "react";
import styles from "./Buttons.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const ServicesButton = () => {
    const [ref1, active1] = useScrollAnimation(0.9);
    const handleClick = () => {
        window.location.href = '/cart';
    };

    return (
        <button
            ref={ref1}
            onClick={handleClick}
            className={`${styles.ServicesButton} ${active1 ? styles.active : ""}`}
            type="button"
        >
            Відкрити кошик
        </button>
    );
};

export default ServicesButton;