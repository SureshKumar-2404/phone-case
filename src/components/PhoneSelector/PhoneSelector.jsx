import Pixi from '../Pixi/Pixi';
import React, { useState, useEffect, useRef } from 'react';
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

  const appRef = useRef(null);

  const handleExtractImage = (extractImage) => {
    // Attach extractImage function to a ref or state to use it later
    appRef.current = extractImage;
  };

  const handleCompleteClick = () => {
    if (appRef.current) {
      appRef.current();
    }

    var customizationValue = localStorage.getItem('text');

    if (customizationValue) {
      document.getElementById('customization').value = customizationValue;
    }

    var base64 = localStorage.getItem('base64');
    if (base64) {
      var imgElement = document.querySelector('#product-base-img img');
      if (imgElement) {
        imgElement.src = base64;
        imgElement.removeAttribute('srcset');
      } else {
      }
    } else {
    }
  };

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
    <>
      <div class="container">
        <main class="caseus">
          <div class="row">
            <div class="col-sm-6">
              <div class="image-left">

                {pixiMaskImg && (
                  <div>
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
                      inputValue={pixiState.inputValue || ''}
                      onExtractImage={handleExtractImage}
                    />
                  </div>
                )}
              </div>
            </div>
            <div class="col-sm-6">
              <div class="right">
                <h1>{productInfo.title}</h1>
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
                    <select value={selectedCompany} onChange={handleCompanyChange}>
                      <option value="">Apple</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="second-select">Select Device:</label>
                    <select value={selectedDevice} onChange={handleDeviceChange} disabled={!devices.length}>
                      <option value="">Select Device</option>
                      {devices.map((device) => (
                        <option key={device.product_id} value={device.product_id}>
                          {device.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div class="form-group">
                    <label for="">Select Case Type</label>
                    <div class="select-protector">
                      <div class="row">
                        <div class="col-sm-3">
                          <div class="mobile-protector">
                            <div class="protector-image">
                              <img src="images/mobile-protector.PNG" alt="protector" />
                            </div>
                            <div class="protector-content">
                              <h5>Ultra Bounce Case...</h5>
                              <button class="protector-price">$100 USD</button>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-3">
                          <div class="mobile-protector">
                            <div class="protector-image">
                              <img src="images/mobile-protector.PNG" alt="protector" />
                            </div>
                            <div class="protector-content">
                              <h5>Ultra Bounce Case...</h5>
                              <button class="protector-price">$100 USD</button>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-3">
                          <div class="mobile-protector">
                            <div class="protector-image">
                              <img src="images/mobile-protector.PNG" alt="protector" />
                            </div>
                            <div class="protector-content">
                              <h5>Ultra Bounce Case...</h5>
                              <button class="protector-price">$100 USD</button>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-3">
                          <div class="mobile-protector">
                            <div class="protector-image">
                              <img src="images/mobile-protector.PNG" alt="protector" />
                            </div>
                            <div class="protector-content">
                              <h5>Ultra Bounce Case...</h5>
                              <button class="protector-price">$100 USD</button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div> */}
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
                  <button id='reload' onClick={handleReload}>Reload</button>
                  <button id='customization' class="customize"> Customize</button>
                  <button type="submit" class="custom-button add-card" id='add-to-cart1' onClick={handleAddToCart}>Add To Cart</button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PhoneSelector;
