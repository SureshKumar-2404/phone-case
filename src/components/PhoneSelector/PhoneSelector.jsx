import React, { useState } from 'react';
import axios from 'axios';
import './PhoneSelector.css'; // Import the CSS file for styling

const PhoneSelector = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [productInfo, setProductInfo] = useState({});

  const handleCompanyChange = async (event) => {
    const collectionId = event.target.value;
    setSelectedCompany(collectionId);
    setDevices([]); // Clear previous devices
    setSelectedDevice(''); // Clear selected device
    setProductInfo({}); // Clear product info

    if (collectionId) {
      try {
        const response = await axios.get(`http://localhost:8006/products/custom`, {
          params: { collection_id: collectionId }
        });
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const handleDeviceChange = async (event) => {
    const productId = event.target.value;
    setSelectedDevice(productId);
    setProductInfo({}); // Clear product info

    if (productId) {
      try {
        const response = await axios.get(`http://localhost:8006/products/${productId}`);
        setProductInfo(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }
  };

  // Filter out variants with the title "Default Title"
  const filteredVariants = productInfo.variants
    ? productInfo.variants.filter(variant => variant.title !== "Default Title")
    : [];

  // Check if there are any valid variants to display
  const hasValidVariants = filteredVariants.length > 0;

  return (
    <div>

      <div>
        <label>Select Company:</label>
        <select value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">Select Company</option>
          <option value="308108787910">Apple</option>
          <option value="308108853446">Google</option>
          <option value="308108820678">Samsung</option>
        </select>
      </div>

      <div>
        <label>Select Device:</label>
        <select value={selectedDevice} onChange={handleDeviceChange} disabled={!devices.length}>
          <option value="">Select Device</option>
          {devices.map((device) => (
            <option key={device.product_id} value={device.product_id}>
              {device.title}
            </option>
          ))}
        </select>
      </div>

      <button onClick>Customization</button>

      {productInfo.title && (
        <div>
          <h3>Product Details:</h3>
          <p><strong>Title:</strong> {productInfo.title}</p>
          <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: productInfo.body_html }} /></p>
          <img src={productInfo.image_src} alt={productInfo.title} style={{ maxWidth: '300px', maxHeight: '300px' }} />

          {hasValidVariants && (
            <div>
              <h4>Product Variants:</h4>
              <div className="variants-container">
                {filteredVariants.map((variant) => (
                  <div key={variant.variant_id} className="variant-item">
                    <img src={variant.image_src || 'placeholder-image-url'} alt={variant.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    <p><strong>Title:</strong> {variant.title}</p>
                    <p><strong>Price:</strong> ${variant.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneSelector;
