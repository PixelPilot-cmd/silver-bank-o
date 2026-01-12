import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export async function getProducts() {
    const filePath = path.join(dataDir, 'products.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
}

export async function saveProduct(product) {
    const products = await getProducts();
    products.push(product);
    await fs.writeFile(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
    return product;
}

export async function updateProduct(id, updates) {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    await fs.writeFile(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
    return products[index];
}

export async function deleteProduct(id) {
    const products = await getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    if (products.length === filteredProducts.length) return false;

    await fs.writeFile(path.join(dataDir, 'products.json'), JSON.stringify(filteredProducts, null, 2));
    return true;
}

export async function getOrders() {
    const filePath = path.join(dataDir, 'orders.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
}

export async function saveOrder(order) {
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
    await fs.writeFile(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2));
    return orderWithNumber;
}

export async function deleteOrder(orderId) {
    const orders = await getOrders();
    const filteredOrders = orders.filter(o => o.id !== orderId);

    if (orders.length === filteredOrders.length) return false;

    await fs.writeFile(path.join(dataDir, 'orders.json'), JSON.stringify(filteredOrders, null, 2));
    return true;
}

export async function updateOrder(orderId, updates) {
    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    orders[index] = { ...orders[index], ...updates };
    await fs.writeFile(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2));
    return orders[index];
}

export async function getUsers() {
    const filePath = path.join(dataDir, 'users.json');
    try {
        const fileData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        return [];
    }
}

export async function saveUser(user) {
    const users = await getUsers();
    if (users.find(u => u.email === user.email)) {
        throw new Error('البريد الإلكتروني موجود مسبقاً');
    }
    users.push(user);
    await fs.writeFile(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
    return user;
}
