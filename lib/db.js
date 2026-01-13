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

export async function updateUser(id, data) {
    const users = await getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...data };
        await kv.set('users', users);
        return users[index];
    }
    return null;
}

// Custom Requests Management
export async function getCustomRequests() {
    return await kv.get('custom_requests') || [];
}

export async function addCustomRequest(request) {
    const requests = await getCustomRequests();
    const newRequest = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending', // pending, priced, approved, processing, completed
        createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    await kv.set('custom_requests', requests);
    return newRequest;
}

export async function updateCustomRequest(id, data) {
    const requests = await getCustomRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index] = { ...requests[index], ...data };
        await kv.set('custom_requests', requests);
        return requests[index];
    }
    return null;
}
export async function deleteCustomRequest(id) {
    const requests = await getCustomRequests();
    const filtered = requests.filter(r => r.id !== id);
    if (requests.length === filtered.length) return false;
    await kv.set('custom_requests', filtered);
    return true;
}
