import { useState, useEffect } from 'react';
import styles from 'styles/Modals.module.scss';
import stylesError from 'styles/Error.module.scss';

const AppointmentModal = ({ isOpen, onClose, onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 
    const [selectedTime, setSelectedTime] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
    });
    const [error, setError] = useState({});

    useEffect(() => {
        if (isOpen) {
           const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedDate = tomorrow.toISOString().split('T')[0];
           setFormData({ ...formData, date: formattedDate });
        }
    }, [isOpen]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    const nameRegex = /^[A-Za-zА-Яа-яЄєЇїІіҐґ'’\s-]{3,30}$/;
    
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        if (value.trim() !== '') {
            switch (name) {
                case 'phone':
                    if (!phoneRegex.test(value)) {
                        error = 'Некоректний номер телефону';
                    }
                    break;
                case 'email':
                    if (!emailRegex.test(value)) {
                        error = 'Некоректний email';
                    }
                    break;
                case 'name':
                    if (!nameRegex.test(value)) {
                        error = "Некоректне ім'я (тільки букви, 3-30 символів)";
                    }
                    break;
                default:
                    break;
            }
        }

        setError(prev => ({
            ...prev,
            [name]: error
        }));

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Ім'я є обов'язковим";
            isValid = false;
        } else if (!nameRegex.test(formData.name.trim())) {
            newErrors.name = "Некоректне ім'я (тільки букви, 3-30 символів)";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email є обов\'язковим';
            isValid = false;
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Некоректний email';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Телефон є обов\'язковим';
            isValid = false;
        } else if (!phoneRegex.test(formData.phone.trim())) {
            newErrors.phone = 'Некоректний номер телефону';
            isValid = false;
        }

        if (!formData.date.trim()) {
            newErrors.date = 'Дата є обов\'язковою';
            isValid = false;
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.date = 'Не можна вибрати минулу дату';
                isValid = false;
            }
        }

        if (!selectedTime) {
            newErrors.time = 'Час є обов\'язковим';
            isValid = false;
        } else {
            const today = new Date();
            const selectedDateTime = new Date(formData.date);
            const [hours, minutes] = selectedTime.split(':').map(Number);
            selectedDateTime.setHours(hours, minutes, 0, 0);
            
            if (formData.date === today.toISOString().split('T')[0]) {
                const now = new Date();
                if (selectedDateTime < now) {
                    newErrors.time = 'Не можна вибрати минулий час';
                    isValid = false;
                }
            }
        }

        setError(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const isValid = validateForm();
        if (!isValid) {
            setIsLoading(false);
            return;
        }
        
        const appointmentData = {
            ...formData,
            time: selectedTime,
        };
        
        try {
            await onSubmit(appointmentData);

            setIsSuccess(true);

            setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
            });
            setSelectedTime('');
            setError({});

            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetAndClose = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
        });
        setSelectedTime('');
        setError({});
        setIsSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={() => !isLoading && resetAndClose()}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button 
                    className={styles.closeBt} 
                    onClick={resetAndClose}
                    disabled={isLoading}
                >
                    &times;
                </button>
                
                <h2 className={styles.modalTitle}>Book an Appointment</h2>
                
                {isSuccess ? (
                    <div className={styles.successMessage}>
                        Appointment booked successfully!<br />
                        We'll contact you soon.
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                className={`${styles.formInput} ${error.name ? stylesError.inputError : ''}`}
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            {error.name && <span className={stylesError.error}>{error.name}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                className={`${styles.formInput} ${error.email ? stylesError.inputError : ''}`}
                                placeholder="Enter your email"
                                onChange={handleChange}
                                value={formData.email}
                                required
                            />
                            {error.email && <span className={stylesError.error}>{error.email}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Phone</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                className={`${styles.formInput} ${error.phone ? stylesError.inputError : ''}`}
                                placeholder="Enter your phone number"
                                onChange={handleChange}
                                value={formData.phone}
                                required
                            />
                            {error.phone && <span className={stylesError.error}>{error.phone}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Date</label>
                            <input 
                                type="date" 
                                name="date"
                                className={`${styles.formInput} ${error.date ? stylesError.inputError : ''}`}
                                onChange={handleChange} 
                                value={formData.date}
                                required
                            />
                            {error.date && <span className={stylesError.error}>{error.date}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Preferred Time</label>
                            <div className={styles.timeSlots}>
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        type="button"
                                        className={`${styles.timeSlot} ${
                                            selectedTime === time ? styles.selected : ''
                                        } ${error.time && !selectedTime ? stylesError.timeSlotError : ''}`}
                                        onClick={() => {
                                            setSelectedTime(time);
                                            setError(prev => ({ ...prev, time: '' }));
                                        }}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            {error.time && <span className={stylesError.error}>{error.time}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Special Requests</label>
                            <textarea 
                                className={styles.formTextarea}
                                name='message'
                                placeholder="Any special requests or notes"
                                rows="3"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.loader}></span>
                                    Processing...
                                </>
                            ) : (
                                'Book Appointment'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AppointmentModal;