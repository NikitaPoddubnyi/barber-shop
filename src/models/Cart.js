class Cart {
    constructor(items = []) {
        this.items = items;
    }

    getItems() {
        return this.items;
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
    }

    updateQuantity(id, newQuantity) {
        if(newQuantity < 1) return;
        this.items = this.items.find(item => item.id === id).quantity = newQuantity;
    }

    clear() {
        this.items = [];
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
}