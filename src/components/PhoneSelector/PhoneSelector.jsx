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
    const text = localStorage.getItem('text');
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
      formData.append('properties[customization]', text);
      formData.append('properties[File_upload]', "hello");
      formData.append('properties[Base64Img]', "https://caseus.s3.ap-south-1.amazonaws.com/files/1725521615524-design.png");


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

      <div class="container">
        <main class="caseus">
          <div class="row">
            <div class="col-sm-6">
              <div class="image-left">
              {productInfo.title && pixiMaskImg && (
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
              )}
              </div>
            </div>

            <div class="col-sm-6">
              <div class="right">
                <h1>Impact Ultra Hd Screen Protector</h1>
                <div class="payment-section">
                  <h3>$42 USD</h3>
                  <h4><del>$60 USD</del></h4>
                  <button class="free-shipping">
                    Free Shipping
                  </button>
                </div>

                <form action="">
                  <div class="form-group">
                    <label for="first-select">Select Brand:</label>
                    <select id="first-select" name="first-select" value={selectedCompany} onChange={handleCompanyChange}>
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="second-select">Select Device:</label>
                    <select id="second-select" name="second-select value={selectedDevice} onChange={handleDeviceChange} disabled={!devices.length}">
                      <option value="">Select Device</option>
                      {devices.map((device) => (
                        <option key={device.product_id} value={device.product_id}>
                          {device.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Select Case Type</label>
                    <div className="select-protector">
                      <div className="row">
                        {filteredVariants.map((variant, index) => (
                          <div className="col-sm-3" key={variant.variant_id}>
                            <div className="mobile-protector">
                              <div className="protector-image">
                                <img
                                  src={variant.image_src || "images/mobile-protector.PNG"}
                                  alt={variant.title}
                                />
                              </div>
                              <div className="protector-content">
                                <h5>{variant.title || "Ultra Bounce Case..."}</h5>
                                <button className="protector-price">
                                  ${variant.price || 100} USD
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button class="customize" id='customization'><img src="" /> Customize</button>
                  <button type="submit" class="add-card" id='add-to-cart' onClick={handleAddToCart}>Add To Cart</button>
                  <button id='reload' onClick={handleReload}>Reload</button>
                </form>
              </div>
            </div>




           
          </div>
        </main>
      </div>
    </div>
  );
};

export default PhoneSelector;
