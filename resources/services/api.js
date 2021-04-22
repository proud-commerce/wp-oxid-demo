import { fetch } from './auth.js';
import { Config } from './../../config.js';

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
    getCategories
}
