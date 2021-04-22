import { fetch } from './auth.js';
import { Config } from './../../config.js';
import { login } from './auth.js';
import Cookies from '../lib/js.cookie.min.js';

const retrieveBasketId = () => Cookies.get(Config.COOKIE_NAME_BASKET)
const saveBasketId = token => Cookies.set(Config.COOKIE_NAME_BASKET, token)
const clearBasketId = () => Cookies.remove(Config.COOKIE_NAME_BASKET)

/**
 * Get single product
 * @param string id 
 */
const getProduct = async (id) => {
    let payload = false;
    try {
        let url = Config.PRODUCT_URI;
        let query = `query {
            product (
                id: "${id}"
            ) {
                title
                sku
                price {
                    price
                }
            }
        }`;
        let opts = {
            method: 'POST',
            body: JSON.stringify({
                query: query
            })
        };
        payload = await fetch(url, opts);
    } catch (e) {
        console.warn('Error getting productdata!', e);
        _handleError(e);
    }
    return payload;
}

/**
 * Create a basket if needed
 * @returns basket id
 */
const createBasket = async () => {
    let bid = retrieveBasketId();
    console.log('bid', bid);
    if (typeof bid !== 'undefined') {
        return bid;
    }
    // need to login to get token for basket actions
    // token is stored in cookie then
    await login(Config.LOGIN_USERNAME, Config.LOGIN_PASSWORD);
    let payload = false;
    try {
        let url = Config.PRODUCT_URI;
        let query = `mutation {
            basketCreate(
                basket: {
                    title: "wp-oxid-basket-pc-2",
                    public: false
                }
            ){
                id
            }
        }`;
        let opts = {
            method: 'POST',
            body: JSON.stringify({
                query: query
            })
        };
        payload = await fetch(url, opts);
        console.log('basket payload', payload);
    } catch (e) {
        console.warn('Error creating basket!', e);
        _handleError(e);
    }
    bid = payload.body.data.basketCreate.id;
    saveBasketId(bid);
    return bid;
}

/**
 * Add article to OXID basket
 * @param string productId 
 * @param int amount 
 * @returns 
 */
const addToBasket = async (productId, amount) => {
    console.log('add to basket: ' + productId);
    let bid = await createBasket();
    if (!bid) {
        alert('Oops, no basket!');
        return;
    }
    let payload = false;
    try {
        let url = Config.PRODUCT_URI;
        let query = `mutation {
            basketAddProduct(
                basketId: "${bid}",
                productId:"${productId}",
                amount: ${amount}
            ) {
                items {
                    amount
                    product {
                        id
                        title
                    }
                }
            }
        }`;
        let opts = {
            method: 'POST',
            body: JSON.stringify({
                query: query
            })
        };
        payload = await fetch(url, opts);
        console.log('add to basket payload', payload);
    } catch (e) {
        console.warn('Error adding to basket!', e);
        _handleError(e);
    }
}

/**
 * Get all products with filter
 * @param string filterString
 */
const getProducts = async (filterString) => {
    let payload = false;
    try {
        let url = Config.PRODUCT_URI;
        let query = `query {
            products (
                filter: {
                    title: {
                        contains: "${filterString}"
                    }
                  }
            ) {
                id
                title
                sku
                price {
                    price
                }
                seo {
                    url
                }
                imageGallery {
                    images {
                        icon
                        image
                    }
                }
            }
        }`;
        let opts = {
            method: 'POST',
            body: JSON.stringify({
                query: query
            })
        };
        payload = await fetch(url, opts);
    } catch (e) {
        console.warn('Error getting products data!', e);
        _handleError(e);
    }
    return payload;
}

/**
 * Get all categories
 * @param string filterString
 */
const getCategories = async (filterString) => {
    let payload = false;
    try {
        let url = Config.PRODUCT_URI;
        let query = `query {
            categories (
                filter: {
                    title: {
                        contains: "${filterString}"
                    }
                  }
            ) {
                id
                title
                seo {
                    url
                }
            }
        }`;
        let opts = {
            method: 'POST',
            body: JSON.stringify({
                query: query
            })
        };
        payload = await fetch(url, opts);
    } catch (e) {
        console.warn('Error getting categories data!', e);
        _handleError(e);
    }
    return payload;
}

/**
 * Handle API errors
 * @param Exception e 
 */
const _handleError = (e) => {
    if (e.name === 'ResponseError') {
        switch (e.status) {
            case 500:
                console.error('Fatal error!', e);
                break;
            case 401:
                console.error('Not authenticated!', e);
                break;
            default:
                console.error('Api error code: ' + e.status, e);
        }
    } else {
        console.error('General api error!', e);
    }
}
// export public functions
export {
    getProduct,
    getProducts,
    getCategories,
    addToBasket
}
