import { useState, useEffect, useMemo } from 'react';
import styles from 'styles/Modals.module.scss';
import stylesError from 'styles/Error.module.scss';
import { useBodyScrollLock } from 'hooks/useBodyScrollLock';


    const API_BASE_URL = "https://barbershop-3f2ae-default-rtdb.firebaseio.com";

const ModalBuy = ({ isOpen, onClose, onSubmit, services, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 
    const [selectedTime, setSelectedTime] = useState('');
    const [promoMessage, setPromoMessage] = useState('');
    const [bookedTimes, setBookedTimes] = useState([]);  
    const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem('formData');
        if (storedFormData) {
            return JSON.parse(storedFormData);
        } else {
         return {
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        barber: '',
        promoCode: '',
        paymentMethod: 'cash', 
        termsAccepted: false,
        privacyAccepted: false,
        marketingAccepted: false,
        specialRequests: ''
        };
    }
    });
    const [error, setError] = useState({});
    useBodyScrollLock(true);

    useEffect(() => {
        // if (isOpen) {
            localStorage.setItem('formData', JSON.stringify(formData));
        // } else {
        //     localStorage.removeItem('formData');
        // }
    }, [ formData]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    const nameRegex = /^[A-Za-zА-Яа-яЄєЇїІіҐґ'’\s-]{3,30}$/;
    
    const barbers = [
        { id: 'john', name: 'John (Senior Barber)' },
        { id: 'mike', name: 'Mike (Beard Specialist)' },
        { id: 'alex', name: 'Alex (Haircut Expert)' }
    ];

    const paymentMethods = [
        { id: 'cash', name: 'Готівка' },
        { id: 'card', name: 'Картка' }
    ];

    const getTimeSlotsForDate = (dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.getDay();
        
        const timeSlotsByDay = {
            1: generateTimeSlots('08:00', '19:00', 60), 
            2: generateTimeSlots('08:00', '19:00', 60), 
            3: generateTimeSlots('08:00', '19:00', 60),
            4: generateTimeSlots('08:00', '19:00', 60), 
            5: generateTimeSlots('08:00', '19:00', 60), 

            6: generateTimeSlots('08:00', '18:00', 60), 
            
            0: generateTimeSlots('08:00', '17:00', 60) 
        };
        
        return timeSlotsByDay[dayOfWeek] || generateTimeSlots('09:00', '18:00', 60);
    };

    const generateTimeSlots = (startTime, endTime, intervalMinutes = 60) => {
        const slots = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        let currentHour = startHour;
        let currentMinute = startMinute;
        
        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const formattedHour = currentHour.toString().padStart(2, '0');
            const formattedMinute = currentMinute.toString().padStart(2, '0');
            slots.push(`${formattedHour}:${formattedMinute}`);

            currentMinute += intervalMinutes;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        }
        
        return slots;
    };

    const timeSlots = useMemo(() => {
        return formData.date ? getTimeSlotsForDate(formData.date) : [];
    }, [formData.date]);

    const isTimePast = (time) => {
        if (!formData.date) return false;
        
        const today = new Date();
        const selectedDate = new Date(formData.date);
        const [hours, minutes] = time.split(':').map(Number);
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(hours, minutes, 0, 0);

        if (formData.date === today.toISOString().split('T')[0]) {
            const now = new Date();
            return selectedDateTime < now;
        }
        
        return selectedDate < today;
    };

    const getDayName = (dateString) => {
        const date = new Date(dateString);
        const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
        return days[date.getDay()];
    };

    const getWorkingHours = (dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.getDay();
        
        const workingHours = {
            1: '08:00 – 19:00',
            2: '08:00 – 19:00', 
            3: '08:00 – 19:00', 
            4: '08:00 – 19:00', 
            5: '08:00 – 19:00', 
            6: '08:00 – 18:00', 
            0: '08:00 – 17:00' 
        };
        
        return workingHours[dayOfWeek] || '09:00 – 18:00';
    };

    const fetchBookedTimes = async (date) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders.json`);
            const data = await response.json();
            
            if (data) {
                const ordersArray = Object.values(data);
                
                const bookedTimesForDate = ordersArray
                    .filter(order => order.date === date)
                    .map(order => order.time);
                
                setBookedTimes(bookedTimesForDate);
            }
        } catch (error) {
            console.error('Помилка при отриманні забронованих часів:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedDate = tomorrow.toISOString().split('T')[0];
            
            setFormData(prev => ({
                ...prev,
                date: formattedDate
            }));
            
            fetchBookedTimes(formattedDate);
        }
    }, [isOpen]);

    useEffect(() => {
        if (formData.date) {
            fetchBookedTimes(formData.date);
            setSelectedTime('');
            setError(prev => ({ ...prev, time: '' }));
        }
    }, [formData.date]);

    const isTimeBooked = (time) => {
        return bookedTimes.includes(time);
    };

    // const isTimeDisabled = (time) => {
    //     return isTimeBooked(time) || isTimePast(time);
    // };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let error = '';

        if (type !== 'checkbox' && type !== 'radio' && value.trim() !== '') {
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
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleApplyPromo = () => {
        const code = formData.promoCode.toUpperCase();
        if (code === 'WELCOME10') {
            setPromoMessage('Promo code applied! 10% discount');
        } else if (code === 'FIRST5') {
            setPromoMessage('Promo code applied! $5 discount');
        } else if (code === '') {
            setPromoMessage('');
        } else {
            setPromoMessage('Invalid promo code');
        }
    };

    const calculateServicesTotal = () => {
        return services.reduce((total, service) => total + (service.price * service.quantity), 0);
    };

    const calculateFinalTotal = () => {
        let total = calculateServicesTotal();
        
        if (formData.promoCode === 'WELCOME10') total *= 0.9;
        if (formData.promoCode === 'FIRST5') total -= 5;
        
        return Math.max(0, total).toFixed(2);
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
        } else if (isTimeBooked(selectedTime)) {
            newErrors.time = 'Цей час вже зайнятий. Будь ласка, оберіть інший час';
            isValid = false;
        } else if (isTimePast(selectedTime)) {
            newErrors.time = 'Не можна вибрати минулий час';
            isValid = false;
        }

        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'Необхідно прийняти умови скасування';
            isValid = false;
        }

        if (!formData.privacyAccepted) {
            newErrors.privacyAccepted = 'Необхідно дати згоду на обробку даних';
            isValid = false;
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
    
        const formattedServices = services.map(service => ({
            id: service.id,
            title: service.title,
            price: service.price,
            quantity: service.quantity,
            total: service.price * service.quantity,
            description: service.description || '',
            duration: service.duration || '30 хв'
        }));
    
        const servicesList = formattedServices.map(s => s.title).join(', ');
    
        const appointmentData = {
            ...formData,
            time: selectedTime,
            services: formattedServices, 
            servicesList: servicesList,
            servicesCount: services.reduce((sum, service) => sum + service.quantity, 0),
            servicesTotal: calculateServicesTotal(),
            totalAmount: calculateFinalTotal(),
            appointmentId: 'APP-' + Date.now().toString().slice(-6),
            createdAt: new Date().toISOString(),
            processed: false 
        };
    
        try {
            const success = await onSubmit(appointmentData);
        
            if (success) {
                setIsSuccess(true);

                setTimeout(() => {
                    resetAndClose();
                    if (onSuccess) setTimeout(() => onSuccess(), 100);
                }, 5000);
            }
        
        } catch (error) {
            console.error('Error submitting form:', error);
            setError({ submit: 'Помилка при бронюванні. Спробуйте ще раз.' });
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
            barber: '',
            promoCode: '',
            paymentMethod: 'cash',
            termsAccepted: false,
            privacyAccepted: false,
            marketingAccepted: false,
            specialRequests: ''
        });
        setSelectedTime('');
        setError({});
        setPromoMessage('');
        setIsSuccess(false);
        setBookedTimes([]);
        onClose();
    };

    const handleCloseOnSuccess = () => {
        if (isSuccess) {
            resetAndClose();
        } else {
            resetAndClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={() => !isLoading && !isSuccess && resetAndClose()}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button 
                    className={styles.closeBt} 
                    onClick={isSuccess ? () => {} : resetAndClose} 
                    disabled={isLoading || isSuccess}
                >
                    &times;
                </button>
                
                <h2 className={styles.modalTitle}>Бронювання послуг</h2>
                
                <div className={styles.serviceSummary}>
                    <div className={styles.serviceHeader}>
                        <h3>Ваше замовлення ({services.length} {services.length === 1 ? 'послуга' : services.length < 5 ? 'послуги' : 'послуг'})</h3>
                        <span className={styles.servicePrice}>${calculateServicesTotal()}</span>
                    </div>
                    
                    <div className={styles.servicesList}>
                        {services.map((service) => (
                            <div key={service.id} className={styles.serviceItem}>
                                <div className={styles.serviceItemHeader}>
                                    <h4>{service.title}</h4>
                                    <span className={styles.serviceItemPrice}>
                                        ${service.price} × {service.quantity} = ${(service.price * service.quantity).toFixed(2)}
                                    </span>
                                </div>
                                <div className={styles.serviceItemDetails}>
                                    <span>Тривалість: {service.duration || '30 хв'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.totalItems}>
                        Загальна кількість: {services.reduce((sum, service) => sum + service.quantity, 0)}
                    </div>
                </div>

                {isSuccess ? (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✓</div>
                        <h3>Послуги заброньовано!</h3>
                        <p>ID бронювання: <strong>APP-{Date.now().toString().slice(-6)}</strong></p>
                        <p>Послуги: {services.map(s => s.title).join(', ')}</p>
                        <p>Загальна сума: ${calculateFinalTotal()}</p>
                        <p>Спосіб оплати: {formData.paymentMethod === 'cash' ? 'Готівка' : 'Картка'}</p>
                        <p>Ми зв'яжемося з вами протягом 15 хвилин для підтвердження</p>
                        <p className={styles.autoCloseMessage}>Модальне вікно закриється автоматично через 5 секунд...</p>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Контактна інформація</h3>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Повне ім'я *</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    className={`${styles.formInput} ${error.name ? stylesError.inputError : ''}`}
                                    placeholder="Введіть ваше ім'я"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {error.name && <span className={stylesError.error}>{error.name}</span>}
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Email *</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    className={`${styles.formInput} ${error.email ? stylesError.inputError : ''}`}
                                    placeholder="Введіть ваш email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                />
                                {error.email && <span className={stylesError.error}>{error.email}</span>}
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Телефон *</label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    className={`${styles.formInput} ${error.phone ? stylesError.inputError : ''}`}
                                    placeholder="+38 (XXX) XXX-XXXX"
                                    onChange={handleChange}
                                    value={formData.phone}
                                    required
                                />
                                {error.phone && <span className={stylesError.error}>{error.phone}</span>}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Дата та час</h3>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Дата *</label>
                                <input 
                                    type="date" 
                                    name="date"
                                    className={`${styles.formInput} ${error.date ? stylesError.inputError : ''}`}
                                    onChange={handleChange} 
                                    value={formData.date}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {error.date && <span className={stylesError.error}>{error.date}</span>}
                                
                                {formData.date && (
                                    <div className={styles.dateInfo}>
                                        <small>
                                            <strong>{getDayName(formData.date)}</strong> Робочі години: {getWorkingHours(formData.date)}
                                        </small>
                                    </div>
                                )}
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Оберіть час *</label>
                                {formData.date && timeSlots.length > 0 ? (
                                    <>
                                        <div className={styles.timeSlots}>
                                            {timeSlots.map(time => {
                                                const isBooked = isTimeBooked(time);
                                                const isPast = isTimePast(time);
                                                const isDisabled = isBooked || isPast;
                                                
                                                return (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        className={`${styles.timeSlot} ${
                                                            selectedTime === time ? styles.selected : ''
                                                        } ${isBooked ? styles.booked : ''} ${
                                                            isPast ? styles.past : ''
                                                        } ${
                                                            error.time && !selectedTime && !isDisabled ? stylesError.timeSlotError : ''
                                                        }`}
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                setSelectedTime(time);
                                                                setError(prev => ({ ...prev, time: '' }));
                                                            }
                                                        }}
                                                        disabled={isDisabled}
                                                        title={
                                                            isBooked ? 'Цей час вже зайнятий' : 
                                                            isPast ? 'Цей час вже минув' : 
                                                            ''
                                                        }
                                                    >
                                                        {time}
                                                        {isBooked && <span className={styles.bookedBadge}>Зайнято</span>}
                                                        {isPast && <span className={styles.pastBadge}>Минув</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {error.time && <span className={stylesError.error}>{error.time}</span>}
                                        {bookedTimes.length > 0 && (
                                            <div className={styles.bookedInfo}>
                                                <small>Зайняті години: {bookedTimes.sort().join(', ')}</small>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className={styles.noSlotsMessage}>
                                        <p>Будь ласка, спочатку оберіть дату для відображення доступних часів</p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Барбер (необов'язково)</label>
                                <select 
                                    name="barber"
                                    className={styles.formSelect}
                                    value={formData.barber}
                                    onChange={handleChange}
                                >
                                    <option value="any">Будь-який доступний</option>
                                    {barbers.map(barber => (
                                        <option key={barber.id} value={barber.id}>
                                            {barber.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Спосіб оплати</h3>
                            
                            <div className={styles.paymentMethods}>
                                {paymentMethods.map(method => (
                                    <div key={method.id} className={styles.paymentMethodItem}>
                                        <input
                                            type="radio"
                                            id={`payment-${method.id}`}
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={formData.paymentMethod === method.id}
                                            onChange={handleChange}
                                            className={styles.paymentRadio}
                                        />
                                        <label 
                                            htmlFor={`payment-${method.id}`}
                                            className={`${styles.paymentLabel} ${
                                                formData.paymentMethod === method.id ? styles.paymentLabelActive : ''
                                            }`}
                                        >
                                            <span className={styles.paymentName}>{method.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Промокод</h3>
                            
                            <div className={styles.promoContainer}>
                                <input 
                                    type="text"
                                    name="promoCode"
                                    className={styles.formInput}
                                    placeholder="Введіть промокод"
                                    value={formData.promoCode}
                                    onChange={handleChange}
                                />
                                <button 
                                    type="button"
                                    className={styles.applyButton}
                                    onClick={handleApplyPromo}
                                >
                                    Застосувати
                                </button>
                            </div>
                            {promoMessage && (
                                <div className={`${styles.promoMessage} ${promoMessage.includes('Invalid') ? styles.error : styles.success}`}>
                                    {promoMessage}
                                </div>
                            )}
                        </div>

                        <div className={styles.summary}>
                            <h3 className={styles.sectionTitle}>Підсумок замовлення</h3>
                            
                            <div className={styles.servicesSummary}>
                                {services.map(service => (
                                    <div key={service.id} className={styles.summaryRow}>
                                        <span>{service.title} (×{service.quantity}):</span>
                                        <span>${(service.price * service.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {formData.promoCode === 'WELCOME10' && (
                                <div className={styles.summaryRow}>
                                    <span>Знижка 10%:</span>
                                    <span>-${(calculateServicesTotal() * 0.1).toFixed(2)}</span>
                                </div>
                            )}
                            
                            {formData.promoCode === 'FIRST5' && (
                                <div className={styles.summaryRow}>
                                    <span>Знижка $5:</span>
                                    <span>-$5</span>
                                </div>
                            )}
                            
                            <div className={styles.summaryTotal}>
                                <span>Загальна сума:</span>
                                <span>${calculateFinalTotal()}</span>
                            </div>
                            
                            <div className={styles.paymentSummary}>
                                <span>Спосіб оплати:</span>
                                <span>{formData.paymentMethod === 'cash' ? 'Готівка' : 'Картка'}</span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Особливі побажання (необов'язково)</label>
                            <textarea 
                                name="specialRequests"
                                className={styles.formTextarea}
                                placeholder="Будь-які особливі побажання чи нотатки..."
                                rows="3"
                                value={formData.specialRequests}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.agreements}>
                            <label className={`${styles.checkboxLabel} ${error.termsAccepted ? stylesError.inputError : ''}`}>
                                <input 
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                    required
                                />
                                <span>Я приймаю умови скасування (безкоштовне скасування за 24 години до візиту)</span>
                            </label>
                            {error.termsAccepted && <span className={stylesError.error}>{error.termsAccepted}</span>}
                            
                            <label className={`${styles.checkboxLabel} ${error.privacyAccepted ? stylesError.inputError : ''}`}>
                                <input 
                                    type="checkbox"
                                    name="privacyAccepted"
                                    checked={formData.privacyAccepted}
                                    onChange={handleChange}
                                    required
                                />
                                <span>Я даю згоду на обробку моїх персональних даних</span>
                            </label>
                            {error.privacyAccepted && <span className={stylesError.error}>{error.privacyAccepted}</span>}
                            
                            <label className={styles.checkboxLabel}>
                                <input 
                                    type="checkbox"
                                    name="marketingAccepted"
                                    checked={formData.marketingAccepted}
                                    onChange={handleChange}
                                />
                                <span>Надсилати мені спеціальні пропозиції та новини</span>
                            </label>
                        </div>

                        <div className={styles.infoBox}>
                            <div className={styles.workingHoursInfo}>
                                <h4>Графік роботи:</h4>
                                <ul>
                                    <li><strong>ПН–ПТ:</strong> 08:00 – 19:00</li>
                                    <li><strong>Субота:</strong> 08:00 – 18:00</li>
                                    <li><strong>Неділя:</strong> 08:00 – 17:00</li>
                                </ul>
                            </div>
                            <p>Ми зв'яжемося з вами протягом 15 хвилин для підтвердження бронювання</p>
                            <p>Будь ласка, приходьте за 5 хвилин до запланованого часу</p>
                            {formData.paymentMethod === 'cash' ? (
                                <p>Оплата готівкою відбувається в салоні після надання послуги</p>
                            ) : (
                                <p>Оплата карткою відбувається в салоні після надання послуги</p>
                            )}
                        </div>

                        <div className={styles.formActions}>
                            <button 
                                type="button"
                                className={styles.cancelButton}
                                onClick={isLoading ? null : handleCloseOnSuccess}
                                disabled={isLoading}
                            >
                                Скасувати
                            </button>
                            
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className={styles.loader}></span>
                                        Обробка...
                                    </>
                                ) : (
                                    `Забронювати ${services.length} ${services.length === 1 ? 'послугу' : 'послуги'}`
                                )}
                            </button>
                        </div>

                        {error.submit && (
                            <div className={stylesError.errorMessage}>
                                {error.submit}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default ModalBuy;