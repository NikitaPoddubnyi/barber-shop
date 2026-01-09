class Order{
    constructor({
 id,
    name,
    email = '',
    phone = '',
    date = '',
    time = '',
    barber = '',
    services = [],          
    servicesList = '',      
    servicesCount = 0,
    servicesTotal = 0,
    total = 0,
    paymentMethod = 'cash', 
    promoCode = '',
    specialRequests = '',
    processed = false,
    createdAt = null,
    status = 'pending',
    type = 'appointment'
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.date = date;
    this.time = time;
    this.barber = barber;
    this.services = services;
    this.servicesList = servicesList;
    this.servicesCount = servicesCount;
    this.servicesTotal = servicesTotal;
    this.total = total;
    this.paymentMethod = paymentMethod;
    this.promoCode = promoCode;
    this.specialRequests = specialRequests;
    this.processed = processed;
    this.createdAt = createdAt;
    this.status = status;
    this.type = type;
  }

    getTotalQuantity() {
        return this.services.reduce((total, service) => total + service.quantity, 0);
    }

    toggleProcessed() {
        this.processed = !this.processed;
    }

    toJson() {
        return {
            ...this
        }
    }
}