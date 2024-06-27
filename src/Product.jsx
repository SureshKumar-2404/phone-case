import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Product.css';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter, setFilter] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productTitle, setProductTitle] = useState('');
    const [productId, setProductId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://13.232.134.145:8006/products');
                const productsData = response.data;
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(
            products.filter(product =>
                product.title.toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [filter, products]);

    const handleEditClick = (product) => {
        setProductImage(product.image_src);
        setProductTitle(product.title);
        setProductId(product.product_id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <h1>Shopify Products</h1>
            <div className="filter-buttons">
                <button className={filter === '' ? 'active' : ''} onClick={() => setFilter('')}>All</button>
                <button className={filter === 'Google' ? 'active' : ''} onClick={() => setFilter('Google')}>Google</button>
                <button className={filter === 'Samsung' ? 'active' : ''} onClick={() => setFilter('Samsung')}>Samsung</button>
                <button className={filter === 'iPhone' ? 'active' : ''} onClick={() => setFilter('iPhone')}>iPhone</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product.product_id}>
                            <td>
                                {product.image_src ? (
                                    <img src={product.image_src} alt={product.title} className="product-image"/>
                                ) : (
                                    'No Image'
                                )}
                            </td>
                            <td>{product.title}</td>
                            <td>
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/4225/4225542.png" 
                                    alt="Edit" 
                                    className="edit-icon" 
                                    style={{ width: '50px', height: '50px' }} 
                                    onClick={() => handleEditClick(product)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Product"
                ariaHideApp={false}
                className="modal"
                overlayClassName="overlay"
            >
                <div className="product-edit-modal">
                    <h2>Edit Product</h2>
                    <div>
                        <img src={productImage} alt={productTitle} style={{ width: '100px', height: '100px' }} />
                    </div>
                    <div>
                        <label>Title:</label>
                        <input type="text" value={productTitle} readOnly />
                    </div>
                    <div>
                        <label>Product ID:</label>
                        <input type="text" value={productId} readOnly />
                    </div>
                    <button onClick={closeModal}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default Product;
