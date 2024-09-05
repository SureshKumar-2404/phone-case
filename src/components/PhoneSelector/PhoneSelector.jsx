import Pixi from '../Pixi/Pixi';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhoneSelector.css';

const PhoneSelector = () => {
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
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://caseusshopify.enactstage.com/caseusapi/collections/smart');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();

    if (selectedCompany) {
      handleCompanyChange({ target: { value: selectedCompany } });
    }

    if (selectedDevice) {
      handleDeviceChange({ target: { value: selectedDevice } });
    }
  }, []);

  useEffect(() => {
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
    setDevices([]);
    setSelectedDevice('');
    setProductInfo({});

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
    setProductInfo({});

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

  // const handleAddToCart = async () => {
  //   let variantToAdd;

  //   if (hasValidVariants && variantId) {
  //     // Use selected variant
  //     variantToAdd = variantId;
  //   } else {
  //     // Use default variant if no valid variants are present
  //     variantToAdd = productInfo.variants[0]?.variant_id;
  //   }

  //   try {
  //     const response = await axios.post('/cart/add.js', {
  //       id: variantToAdd,
  //       quantity: 1
  //     });
  //     console.log('Added to cart:', response.data);
  //   } catch (error) {
  //     console.error('Error adding to cart:', error);
  //   }
  // };

  const handleAddToCart = async () => {
    const text= localStorage.getItem('text');
    let variantToAdd;
  
    if (hasValidVariants && variantId) {
      // Use selected variant
      variantToAdd = variantId;
    } else {
      // Use default variant if no valid variants are present
      variantToAdd = productInfo.variants[0]?.variant_id;
    }
  
    try {
      // Create a new FormData object
      const formData = new FormData();
      formData.append('id', variantToAdd);
      formData.append('quantity', 1);
      formData.append('properties[customization]',text);
      formData.append('properties[File_upload]',"hello");
      formData.append('properties[Base64Img]',"https://caseus.s3.ap-south-1.amazonaws.com/files/1725521615524-design.png");

  
      // Send form data using axios
      const response = await axios.post('/cart/add.js', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Added to cart:', response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  

  const handleReload = () => {
    setPixiState(JSON.parse(localStorage.getItem('pixiState')) || {});
  };

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
      <button type="submit" className="custom-button" id='add-to-cart' onClick={handleAddToCart}>Add To Cart</button>

      {productInfo.title && pixiMaskImg && (
        <div>
          <h3>Product Details:</h3>
          <p><strong>Title:</strong> {productInfo.title}</p>
          <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: productInfo.body_html }} /></p>
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
