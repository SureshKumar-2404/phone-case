import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhoneSelector.css';
import { useNavigate } from 'react-router-dom';

const PhoneSelector = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(localStorage.getItem('selectedCompany') || '');
  const [devices, setDevices] = useState(JSON.parse(localStorage.getItem('devices')) || []);
  const [selectedDevice, setSelectedDevice] = useState(localStorage.getItem('selectedDevice') || '');
  const [productInfo, setProductInfo] = useState(JSON.parse(localStorage.getItem('productInfo')) || {});

  useEffect(() => {
    // Fetch devices if company is already selected
    if (selectedCompany) {
      handleCompanyChange({ target: { value: selectedCompany } });
    }
    // Fetch product info if device is already selected
    if (selectedDevice) {
      handleDeviceChange({ target: { value: selectedDevice } });
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const handleCompanyChange = async (event) => {
    const collectionId = event.target.value;
    setSelectedCompany(collectionId);
    localStorage.setItem('selectedCompany', collectionId);
    setDevices([]); // Clear previous devices
    setSelectedDevice(''); // Clear selected device
    setProductInfo({}); // Clear product info

    if (collectionId) {
      try {
        const response = await axios.get(`http://localhost:8006/products/custom`, {
          params: { collection_id: collectionId }
        });
        setDevices(response.data);
        localStorage.setItem('devices', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const handleDeviceChange = async (event) => {
    const productId = event.target.value;
    setSelectedDevice(productId);
    localStorage.setItem('selectedDevice', productId);
    setProductInfo({}); // Clear product info

    if (productId) {
      try {
        const response = await axios.get(`http://localhost:8006/products/${productId}`);
        setProductInfo(response.data);
        localStorage.setItem('productInfo', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }
  };

  const filteredVariants = productInfo.variants
    ? productInfo.variants.filter(variant => variant.title !== "Default Title")
    : [];

  const hasValidVariants = filteredVariants.length > 0;

  const navCustome = () => {
    navigate('/custom');
  };

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

      <button onClick={() => navCustome()}>Customization</button>

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
