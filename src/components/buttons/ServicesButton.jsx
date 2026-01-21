import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Buttons.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const ServicesButton = () => {
    const navigate = useNavigate();
    const [ref1, active1] = useScrollAnimation(0.9);
    const handleClick = () => {
        navigate("/cart");
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