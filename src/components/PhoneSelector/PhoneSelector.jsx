import Pixi from '../Pixi/Pixi';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhoneSelector.css';
// import { useNavigate } from 'react-router-dom';


const PhoneSelector = () => {
  // const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(localStorage.getItem('selectedCompany') || '');
  const [devices, setDevices] = useState(JSON.parse(localStorage.getItem('devices')) || []);
  const [selectedDevice, setSelectedDevice] = useState(localStorage.getItem('selectedDevice') || '');
  const [productInfo, setProductInfo] = useState(JSON.parse(localStorage.getItem('productInfo')) || {});
  const [pixiState, setPixiState] = useState(JSON.parse(localStorage.getItem('pixiState')) || {});
  const [pixiMaskImg, setPixiMaskImg] = useState('');
  const [variantId, setVariantId] = useState('');
  const [variantBaseImg, setVariantBaseImg] = useState('');

  useEffect(() => {
    // Fetch company data on component mount
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://caseusshopify.enactstage.com/caseusapi/collections/smart');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();

    // Fetch devices if company is already selected
    if (selectedCompany) {
      handleCompanyChange({ target: { value: selectedCompany } });
    }

    // Fetch product info if device is already selected
    if (selectedDevice) {
      handleDeviceChange({ target: { value: selectedDevice } });
    }
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // const product_id = document.querySelector('input[name="product-id"]') ? document.querySelector('input[name="product-id"]').value : null;
    // // console.log('Product ID:', product_id); // Debugging log
    // const product_id = 8230530842822
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://caseusshopify.enactstage.com/caseusapi/product/data`, {
          params: { id: productInfo.product_id, variant_id: variantId }
        });
        const data = response.data.data;
        setPixiMaskImg(data.product_mask_img);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    if (productInfo.product_id) {
      fetchData();
    }
  }, [productInfo, variantId]);

  const handleCompanyChange = async (event) => {
    const collectionId = event.target.value;
    setSelectedCompany(collectionId);
    localStorage.setItem('selectedCompany', collectionId);
    setDevices([]); // Clear previous devices
    setSelectedDevice(''); // Clear selected device
    setProductInfo({}); // Clear product info

    if (collectionId) {
      try {
        const response = await axios.get(`https://caseusshopify.enactstage.com/caseusapi/products/custom`, {
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
        const response = await axios.get(`https://caseusshopify.enactstage.com/caseusapi/products/${productId}`);
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

  // const navCustome = () => {
  //   let url = `/custom/${selectedDevice}`;

  //   if (variantId) {
  //     url += `?variant=${variantId}`;
  //   }
  //   navigate(url);
  // };
  const handleReload = () => {
    setPixiState(JSON.parse(localStorage.getItem('pixiState')) || {});
  }
  return (
    <div>
      <div>
        <label>Select Company:</label>
        <select value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.title}
            </option>
          ))}
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
      <button id='reload' onClick={handleReload}>Reload</button>
      <button id='customization'>Customization</button>

      {productInfo.title && pixiMaskImg && (
        <div>
          <h3>Product Details:</h3>
          <p><strong>Title:</strong> {productInfo.title}</p>
          <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: productInfo.body_html }} /></p>
          {/* <img src={productInfo.image_src} alt={productInfo.title} style={{ maxWidth: '300px', maxHeight: '300px' }} /> */}
          <Pixi baseImg={variantBaseImg || productInfo.image_src}
            maskImg={pixiMaskImg}
            font={pixiState.font}
            layout={pixiState.layout}
            colortext={pixiState.colortext}
            selectedStyle={pixiState.selectedStyle || 'Simple'}
            boxDesignColor={pixiState.boxDesignColor}
            dotDesignColorId={pixiState.dotDesignColorId}
            dotDesignColor={pixiState.dotDesignColor}
            gradientDesign={pixiState.gradientDesign}
            thumnailDesign={pixiState.thumnailDesign}
            uLineColor={pixiState.uLineColor}
            inputValue={pixiState.inputValue || ''} />

          {hasValidVariants && (
            <div>
              <h4>Product Variants:</h4>
              <div className="variants-container">
                {filteredVariants.map((variant) => (
                  <div key={variant.variant_id} className="variant-item">
                    <img src={variant.image_src || 'placeholder-image-url'} alt={variant.title} style={{ maxWidth: '100px', maxHeight: '100px' }} onClick={() => {
                      setVariantId(variant.variant_id);
                      setVariantBaseImg(variant.image_src);
                    }} />

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
