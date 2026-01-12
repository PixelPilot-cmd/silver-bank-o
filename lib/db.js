import { kv } from '@vercel/kv';

// ============= PRODUCTS =============

export async function getProducts() {
    try {
        const products = await kv.get('products') || [];
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}

export async function saveProduct(product) {
    try {
        const products = await getProducts();
        products.push(product);
        await kv.set('products', products);
        return product;
    } catch (error) {
        console.error('Error saving product:', error);
        throw error;
    }
}

export async function updateProduct(id, updates) {
    try {
        const products = await getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        products[index] = { ...products[index], ...updates };
        await kv.set('products', products);
        return products[index];
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
}

export async function deleteProduct(id) {
    try {
        const products = await getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        if (products.length === filteredProducts.length) return false;

        await kv.set('products', filteredProducts);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// ============= ORDERS =============

export async function getOrders() {
    try {
        const orders = await kv.get('orders') || [];
        return orders;
    } catch (error) {
        console.error('Error getting orders:', error);
        return [];
    }
}

export async function saveOrder(order) {
    try {
        const orders = await getOrders();

        // Find the lowest available order number starting from 1001 (Gap-filling)
        const existingNumbers = orders
            .map(o => Number(o.orderNumber))
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b);

        let nextOrderNumber = 1001;
        for (const num of existingNumbers) {
            if (num === nextOrderNumber) {
                nextOrderNumber++;
            } else if (num > nextOrderNumber) {
                break;
            }
        }

        const orderWithNumber = {
            ...order,
            orderNumber: nextOrderNumber
        };

        orders.push(orderWithNumber);
        await kv.set('orders', orders);
        return orderWithNumber;
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}

export async function deleteOrder(orderId) {
    try {
        const orders = await getOrders();
        const filteredOrders = orders.filter(o => o.id !== orderId);

        if (orders.length === filteredOrders.length) return false;

        await kv.set('orders', filteredOrders);
        return true;
    } catch (error) {
        console.error('Error deleting order:', error);
        return false;
    }
}

export async function updateOrder(orderId, updates) {
    try {
        const orders = await getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index === -1) return null;

        orders[index] = { ...orders[index], ...updates };
        await kv.set('orders', orders);
        return orders[index];
    } catch (error) {
        console.error('Error updating order:', error);
        return null;
    }
}

// ============= USERS =============

export async function getUsers() {
    try {
        const users = await kv.get('users') || [];
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

export async function saveUser(user) {
    try {
        const users = await getUsers();
        if (users.find(u => u.email === user.email)) {
            throw new Error('البريد الإلكتروني موجود مسبقاً');
        }
        users.push(user);
        await kv.set('users', users);
        return user;
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

export async function updateUser(userId, updates) {
    try {
        const users = await getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) return null;

        users[index] = { ...users[index], ...updates };
        await kv.set('users', users);
        return users[index];
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
}
