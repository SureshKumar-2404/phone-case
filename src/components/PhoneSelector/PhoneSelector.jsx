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
  const [variantId, setVariantId] = useState(((localStorage.getItem('variantId')) || ''));
  const [variantBaseImg, setVariantBaseImg] = useState('');
  const [variantTitle, setVariantTitle] = useState('');
  const [variantPrice, setVariantPrice] = useState('');

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

  useEffect(() => {
    localStorage.setItem('variantId', variantId);
    localStorage.setItem('pixiMaskImg', pixiMaskImg);
    localStorage.setItem('variantBaseImg', variantBaseImg);
    localStorage.setItem('variantTitle', variantTitle);
    localStorage.setItem('variantPrice', variantPrice);
  }, [variantId, pixiMaskImg, variantBaseImg, variantTitle, variantPrice]);

  // const handleDeviceChange = async (event) => {
  //   const productId = event.target.value;

  //   setSelectedDevice(productId);
  //   localStorage.setItem('selectedDevice', productId);
  //   setProductInfo({});

  //   if (productId) {
  //     try {
  //       const response = await axios.get(`https://caseusshopify.enactstage.com/caseusapi/products/${productId}`);
  //       const productData = response.data;
  //       setProductInfo(productData);
  //       localStorage.setItem('productInfo', JSON.stringify(productData));

  //       // Automatically select the first available variant by default
  //       if (productData.variants && productData.variants.length > 0) {
  //         const firstVariant = productData.variants[0];
  //         setVariantId(firstVariant.variant_id);
  //         setVariantBaseImg(firstVariant.image_src);
  //         setVariantTitle(firstVariant.title);
  //         setVariantPrice(firstVariant.price);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching product details:', error);
  //     }
  //   }
  // };
  const handleDeviceChange = async (event) => {
    const productId = event.target.value;

    setSelectedDevice(productId);
    localStorage.setItem('selectedDevice', productId);
    setProductInfo({});

    if (productId) {
      try {
        const response = await axios.get(`https://caseusshopify.enactstage.com/caseusapi/products/${productId}`);
        const productData = response.data;
        setProductInfo(productData);
        localStorage.setItem('productInfo', JSON.stringify(productData));

        // Check if variant data is already in localStorage
        const storedVariantId = localStorage.getItem('variantId');
        const storedVariantBaseImg = localStorage.getItem('variantBaseImg');
        const storedVariantTitle = localStorage.getItem('variantTitle');
        const storedVariantPrice = localStorage.getItem('variantPrice');

        console.log(' storedVariantId---------', storedVariantId);
        console.log(' storedVariantBaseImg---------', storedVariantBaseImg);
        console.log(' storedVariantTitle---------', storedVariantTitle);
        console.log(' storedVariantPrice---------', storedVariantPrice);

        // If variant data is in localStorage, use it, otherwise use the first available variant
        if (storedVariantId && storedVariantBaseImg && storedVariantTitle && storedVariantPrice) {
          setVariantId(storedVariantId);
          setVariantBaseImg(storedVariantBaseImg);
          setVariantTitle(storedVariantTitle);
          setVariantPrice(storedVariantPrice);
        } else if (productData.variants && productData.variants.length > 0) {
          // If no data in localStorage, select the first available variant
          const firstVariant = productData.variants[0];
          setVariantId(firstVariant.variant_id);
          setVariantBaseImg(firstVariant.image_src);
          setVariantTitle(firstVariant.title);
          setVariantPrice(firstVariant.price);
        }
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

  const appRef = useRef(null);

  const handleExtractImage = (extractImage) => {
    // Attach extractImage function to a ref or state to use it later
    appRef.current = extractImage;
  };
  const handleCompleteClick = () => {
    if (appRef.current) {
      appRef.current();
    }
  }

  // const handleAddToCart = async () => {
  //   const text = localStorage.getItem('text');
  //   let variantToAdd;

  //   if (hasValidVariants && variantId) {
  //     // Use selected variant
  //     variantToAdd = variantId;
  //   } else {
  //     // Use default variant if no valid variants are present
  //     variantToAdd = productInfo.variants[0]?.variant_id;
  //   }

  //   try {
  //     // Create a new FormData object
  //     const formData = new FormData();
  //     formData.append('id', variantToAdd);
  //     formData.append('quantity', 1);
  //     formData.append('properties[customization]', text);
  //     formData.append('properties[File_upload]', "hello");
  //     formData.append('properties[Base64Img]', "https://caseus.s3.ap-south-1.amazonaws.com/files/1725521615524-design.png");


  //     // Send form data using axios
  //     const response = await axios.post('/cart/add.js', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error adding to cart:', error);
  //   }
  // };


  const handleReload = () => {
    setPixiState(JSON.parse(localStorage.getItem('pixiState')) || {});
  };

  return (
    <div>

      <div className="container">
        <main className="caseus">
          <div className="row">
            <div className="col-sm-6">
              <div className="image-left">
                {productInfo.title && pixiMaskImg ? (
                  <Pixi
                    baseImg={variantBaseImg || productInfo.image_src}
                    maskImg={pixiMaskImg}
                    font={pixiState.font}
                    layout={pixiState.layout}
                    colortext={pixiState.colortext}
                    selectedStyle={pixiState.selectedStyle || 'Simple'}
                    boxDesignColor={pixiState.boxDesignColor}
                    dotDesignColorId={pixiState.dotDesignColorId}
                    dotDesignColor={pixiState.dotDesignColor}
                    gradient={pixiState.gradientDesign}
                    thumnailDesign={pixiState.thumnailDesign}
                    uLineColor={pixiState.uLineColor}
                    inputValue={pixiState.inputValue || ''}
                    onExtractImage={handleExtractImage}
                    pageType='phone'
                  />
                ) : (
                  <img
                    src="https://cdn.shopify.com/s/files/1/0611/3879/6742/files/base_iphone-15-pro-max_16006058_natural-titanium.png?v=1718360252"
                    alt="Default Image"
                    style={{ width: "55%", margin: "auto", display: "block" }}
                  />
                )}
              </div>

            </div>

            <div className="col-sm-6">
              <div className="right">
                <h1>{variantTitle || productInfo.title}</h1>
                <div className="payment-section">
                  <h3>{variantPrice}</h3>
                </div>

                <div className="form-group-parent">
                  <div className="form-group">
                    <label htmlFor="first-select">Select Brand:</label>
                    <select id="first-select" name="first-select" value={selectedCompany} onChange={handleCompanyChange}>
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="second-select">Select Device:</label>
                    <select id="second-select" name="second-select" value={selectedDevice} onChange={handleDeviceChange} disabled={!devices.length}>
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
                                  onClick={() => {
                                    console.log("hello------111");
                                    setVariantId(variant.variant_id);
                                    setVariantBaseImg(variant.image_src);
                                    setVariantTitle(variant.title);
                                    setVariantPrice(variant.price);
                                    handleCompleteClick();
                                  }} />
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
                  {/* Hidden input fields for product_id and variant_id */}
                  <input type="hidden" id="product_id" name="product_id" value={productInfo.product_id} />
                  <input type="hidden" id="variant_id" name="variant_id" value={variantId} />
                  <input type="file" id="file_upload" name="file_upload" class="d-none" />
                  <button type="button" className="customize" id='customization'><img src="" /> Customize</button>
                  <button type="button" className="add-card" id='add-to-cart1'>Add To Cart</button>
                  <button id='reload' onClick={handleReload}>Reload</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PhoneSelector;
