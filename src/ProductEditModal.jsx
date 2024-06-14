import React from 'react';
import Modal from 'react-modal';

const ProductEditModal = ({ isOpen, onRequestClose, productImage, productTitle, productId }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Product"
            ariaHideApp={false}
            className="modal"
            overlayClassName="overlay"
        >
            <div className="product-edit-modal">
                <h2>Edit Product</h2>
                <div>
                    <img src={productImage} alt={productTitle} />
                </div>
                <div>
                    <label>Title:</label>
                    <input type="text" value={productTitle} readOnly />
                </div>
                <div>
                    <label>Product ID:</label>
                    <input type="text" value={productId} readOnly />
                </div>
                <button onClick={onRequestClose}>Close</button>
            </div>
        </Modal>
    );
};

export default ProductEditModal;
