import Pixi from '../Pixi/Pixi';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
// import { useNavigate } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';

function Customization() {
  const [pixiState] = useState(JSON.parse(localStorage.getItem('pixiState')) || {});

  const [inputValue, setInputValue] = useState(pixiState.inputValue || '');

  const [fontItems, setFontItems] = useState([]);

  const [baseImg, setBaseImg] = useState('');

  const [maskImg, setMaskImg] = useState('');

  const [font, setFont] = useState(pixiState.font || 'Peace Sans');

  const [layoutItems, setLayoutItems] = useState([]);

  const [layout, setLayout] = useState(pixiState.layout || 'layout1');

  const [colortext, setColorText] = useState(pixiState.colortext || 'ffffff');

  const [styles, setStyles] = useState([]);

  const [selectedStyle, setSelectedStyle] = useState(pixiState.selectedStyle || 'Simple');

  const [designs, setDesigns] = useState([]);

  const [colors, setColors] = useState([]);

  const [uLineColor, setULineColor] = useState(pixiState.uLineColor || []);

  const [boxDesignColor, setBoxDesignColor] = useState(pixiState.boxDesignColor || null);

  const [dotDesignColorId, setDotDesignColorId] = useState(pixiState.dotDesignColorId || 'Black');

  const [dotDesignColor, setDotDesignColor] = useState(pixiState.dotDesignColor || 'white');

  const [errorMessage, setErrorMessage] = useState('');

  const [gradientDesign, setGradientDesign] = useState(pixiState.gradientDesign || '');

  const [thumnailDesign, setThumnailDesign] = useState(pixiState.thumnailDesign || 'https://caseusshopify.enactstage.com/caseusapi/images/Teddy.svg');

  const [layoutColor, setLayoutColor] = useState([]);

  const [variantId, setVariantId] = useState('');
  
  const [productInfo, setProductInfo] = useState({});


  // const navigate = useNavigate();
  // const params = useParams();
  const { id } = useParams(); // This will extract the product_id
  // const location = useLocation(); // This gives you access to the query parameters

  useEffect(() => {
    localStorage.setItem('pixiState', JSON.stringify({
      inputValue: inputValue,
      font: font,
      layout: layout,
      colortext: colortext,
      selectedStyle: selectedStyle,
      boxDesignColor: boxDesignColor,
      dotDesignColorId: dotDesignColorId,
      dotDesignColor: dotDesignColor,
      gradientDesign: gradientDesign,
      thumnailDesign: thumnailDesign,
      uLineColor: uLineColor
    }));

  }, [inputValue, fontItems, baseImg, maskImg, font, layoutItems, layout, colortext, styles, selectedStyle, designs, colors, boxDesignColor, dotDesignColorId, dotDesignColor, gradientDesign, thumnailDesign, layoutColor, errorMessage]);
  // console.log('layoutvalue1111222-----------', layout);
  const handleInputChange = (event) => {
    let value = event.target.value;
    const maxLength = layout === 'layout4' ? 3 : 8;

    // Regex to allow only alphabetic characters (both uppercase and lowercase)
    const regex = /^[A-Za-z]*$/;

    if (regex.test(value)) {
      if (font === 'Peace Sans') {
        value = value.toLowerCase();
        if (value.length <= maxLength) {
          setInputValue(value);
          setErrorMessage('');
        } else {
          setErrorMessage(`Maximum length of ${maxLength} characters exceeded.`);
        }
      } else {
        value = value.toUpperCase();
        if (value.length <= maxLength) {
          setInputValue(value);
          setErrorMessage('');
        } else {
          setErrorMessage(`Maximum length of ${maxLength} characters exceeded.`);
        }
      }
    } else {
      setErrorMessage('Text contains invalid characters.');
    }
  };

  useEffect(() => {
    if (layout === 'layout4' && inputValue.length > 3) {
      setInputValue(inputValue.slice(0, 3));
    }
  }, [layout, inputValue, font]);

  useEffect(() => {

    const iconsItems = [
      { id: "Flower", imageUrl: "https://caseus.s3.ap-south-1.amazonaws.com/icons/flower.svg" },
      { id: "Heart", imageUrl: "https://caseus.s3.ap-south-1.amazonaws.com/icons/flower.svg" },
      { id: "Star", imageUrl: "https://caseus.s3.ap-south-1.amazonaws.com/icons/flower.svg" },
    ]

    const styleItems = [
      { id: "Simple", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/f92ba6ff4baac55a9a9d1bbc2c1ce2ee.svg" },
      { id: "Box", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/98c4f7a156418903d5b07d7302b75559.svg" },
      { id: "Dot", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/b6ea6acf8ff1db1fd7d6d36f2e8cc823.svg" },
      { id: "Stroke", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/9979cd0df22b3add284d50420a984e7a.svg" },
      { id: "Gradient", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/6762e6110c10b269f2d3ae6a03d00c47.svg" },
      { id: "Thumnail", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/f450aecf33e5576b3d55ecc70ff91213.svg" }
    ];

    setStyles(styleItems);

    const design = {
      'Box': [
        { id: "Blue", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Blue.svg', color: '0.431, 0.808, 0.937' },
        { id: "Green", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Green.svg', color: '0.255, 0.706, 0.278' },
        { id: "Orange", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Orange.svg', color: '0.937, 0.333, 0.114' },
        { id: "Pink", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Pink.svg', color: '0.941, 0.569, 0.776' },
        { id: "Red", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Red.svg', color: '0.698, 0.055, 0.047' },
        { id: "White", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/White.svg', color: '1.0, 1.0, 1.0' },
        { id: "Yellow", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Yellow.svg', color: '0.973, 0.831, 0.255' },
        { id: "Raspberry-pink", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Raspberry-pink.svg', color: '0.925, 0.274, 0.647' }
      ],
      'Dot': [
        { id: "Black", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Dots/Black.svg', dotColor: '0.0, 0.0, 0.0, 1.0' },
        { id: "White", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Dots/White.svg', dotColor: '1.0, 1.0, 1.0, 1.0' },
        { id: "OrangeGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Dots/OrangeGradient.svg', dotColor: '1.0, 0.647, 0.0, 1.0' },
        { id: "PinkGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Dots/PinkGradient.svg', dotColor: '1.0, 0.753, 0.796, 1.0' }
      ],
      'Stroke': [
        { id: "Blue", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Blue.svg', uLineColor: [0.43, 0.81, 0.94, 1.0] },
        { id: "Green", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Green.svg', uLineColor: [0.251, 0.702, 0.298, 1.0] },
        { id: "Orange", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Orange.svg', uLineColor: [0.945, 0.337, 0.094, 1.0] },
        { id: "White", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/White.svg', uLineColor: [1.0, 1.0, 1.0, 1.0] },
        { id: "Yellow", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Yellow.svg', uLineColor: [0.973, 0.831, 0.255, 1.0] },
        { id: "Thunderbird", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Thunderbird.svg', uLineColor: [0.752, 0.168, 0.094, 1.0] },
        { id: "Raspberry_pink", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Rasbperry_Stroke.svg', uLineColor: [0.925, 0.274, 0.647, 1.0] },
        { id: "Light_orchid", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Light_Orchid_Stroke.svg', uLineColor: [0.886, 0.611, 0.823, 1.0] },
      ],
      'Gradient': [
        { id: "OrangeGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/OrangeGradient.svg' },
        { id: "PinkGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/PinkGradient.svg' },
        { id: "RedGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/RedGradient.svg' },
        { id: "TriGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/TriGradient.svg' },
      ],
      'Thumnail': [
        { id: "Teddy", imageUrl: 'https://caseusshopify.enactstage.com/caseusapi/images/Teddy.svg' },
        { id: "Heart", imageUrl: 'https://caseusshopify.enactstage.com/caseusapi/images/Heart.svg' },
        { id: "Butterfly", imageUrl: 'https://caseusshopify.enactstage.com/caseusapi/images/Butterfly.svg' },
      ]
    };

    setDesigns(design);

    const layoutItems = {
      'Simple': [
        { id: "layout1", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/9c4c82cc261cf174d9d201373a1d02e4.svg" },
        { id: "layout2", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/ac417f35ab911f8462a6e5a438b4d7a7.svg" },
        { id: "layout3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/228dc318b4d260bf0ec1d950ce9c8beb.svg" },
        { id: "layout4", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4adc012cc49894d833c9b202dcf291b0.svg" },
        { id: "layout5", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4ca09b8117dea1765e1e84f867c36dec.svg" },
      ],
      'Box': [
        { id: "layout1", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/9c4c82cc261cf174d9d201373a1d02e4.svg" },
        { id: "layout2", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/ac417f35ab911f8462a6e5a438b4d7a7.svg" },
        { id: "layout4", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4adc012cc49894d833c9b202dcf291b0.svg" },
      ],
      'Dot': [
        { id: "layout1", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/9c4c82cc261cf174d9d201373a1d02e4.svg" },
        { id: "layout2", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/ac417f35ab911f8462a6e5a438b4d7a7.svg" },
        { id: "layout4", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4adc012cc49894d833c9b202dcf291b0.svg" },
      ],
      'Stroke': [
        { id: "layout2", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/ac417f35ab911f8462a6e5a438b4d7a7.svg" },
        { id: "layout4", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4adc012cc49894d833c9b202dcf291b0.svg" },
      ],
      'Gradient': [
        { id: "layout1", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/9c4c82cc261cf174d9d201373a1d02e4.svg" },
        { id: "layout2", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/ac417f35ab911f8462a6e5a438b4d7a7.svg" },
        { id: "layout3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/228dc318b4d260bf0ec1d950ce9c8beb.svg" },
        { id: "layout4", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4adc012cc49894d833c9b202dcf291b0.svg" },
      ],
      'Thumnail': [
        { id: "layout2", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/ac417f35ab911f8462a6e5a438b4d7a7.svg" },
      ]
    };
    setLayoutItems(layoutItems);

    //Layout Design
    const LayoutFontItems = {
      'layout1': [
        { id: "Arial", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/35d0b2830b4f8c6a232ca527b27d529a.svg", font: 'Peace Sans' },
        { id: "Impact", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/b6921243aa49c66eee5a4a1cdb35af9b.svg", font: 'Buenos Aires' },
        { id: "font3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/8e14df29e1e72fea5c396f88da5f09bf.svg", font: 'Guyon Gazebo' },
        { id: "Brush Script MT", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/7e7ee0a8d93a62cfe8100517097b45d9.svg", font: 'Quentin' },
        { id: "Bradley Hand", imageUrl: "https://cdn.casetify.com/static/cms/image/30176/Screenshot_2022-05-19_at_6.46.28_PM.png", font: 'Hyogo' },
        { id: "Y2k Fill", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/3ed54a22c0d80dc6d07b6d9d06e8b27e.svg", font: 'Y2k Fill' }
      ],
      'layout2': [
        { id: "Arial", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/35d0b2830b4f8c6a232ca527b27d529a.svg", font: 'Peace Sans' },
        { id: "Impact", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/b6921243aa49c66eee5a4a1cdb35af9b.svg", font: 'Buenos Aires' },
        { id: "font3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/8e14df29e1e72fea5c396f88da5f09bf.svg", font: 'Guyon Gazebo' },
        { id: "Brush Script MT", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/7e7ee0a8d93a62cfe8100517097b45d9.svg", font: 'Quentin' },
        { id: "Bradley Hand", imageUrl: "https://cdn.casetify.com/static/cms/image/30176/Screenshot_2022-05-19_at_6.46.28_PM.png", font: 'Hyogo' },
        { id: "Y2k Fill", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/3ed54a22c0d80dc6d07b6d9d06e8b27e.svg", font: 'Y2k Fill' }
      ],
      'layout3': [
        { id: "Arial", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/35d0b2830b4f8c6a232ca527b27d529a.svg", font: 'Peace Sans' },
        { id: "Impact", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/b6921243aa49c66eee5a4a1cdb35af9b.svg", font: 'Buenos Aires' },
        { id: "font3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/8e14df29e1e72fea5c396f88da5f09bf.svg", font: 'Guyon Gazebo' },
        { id: "Brush Script MT", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/7e7ee0a8d93a62cfe8100517097b45d9.svg", font: 'Quentin' },
        { id: "Bradley Hand", imageUrl: "https://cdn.casetify.com/static/cms/image/30176/Screenshot_2022-05-19_at_6.46.28_PM.png", font: 'Hyogo' },
        { id: "Y2k Fill", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/3ed54a22c0d80dc6d07b6d9d06e8b27e.svg", font: 'Y2k Fill' }
      ],
      'layout4': [
        { id: "Arial", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/35d0b2830b4f8c6a232ca527b27d529a.svg", font: 'Peace Sans' },
        { id: "Impact", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/b6921243aa49c66eee5a4a1cdb35af9b.svg", font: 'Buenos Aires' },
        { id: "font3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/8e14df29e1e72fea5c396f88da5f09bf.svg", font: 'Guyon Gazebo' },
        { id: "Brush Script MT", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/7e7ee0a8d93a62cfe8100517097b45d9.svg", font: 'Quentin' },
        { id: "Bradley Hand", imageUrl: "https://cdn.casetify.com/static/cms/image/30176/Screenshot_2022-05-19_at_6.46.28_PM.png", font: 'Hyogo' },
        { id: "Y2k Fill", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/3ed54a22c0d80dc6d07b6d9d06e8b27e.svg", font: 'Y2k Fill' }
      ],
      'layout5': [
        { id: "font3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/8e14df29e1e72fea5c396f88da5f09bf.svg", font: 'Guyon Gazebo' },
      ]
    }
    setFontItems(LayoutFontItems);

    const LayoutColorItems = {
      'layout5': [
        { id: "185283", className: '#185283' },
        { id: "a34322", className: '#a34322' },
        { id: "32764f", className: '#32764f' },
        { id: "0a72f6", className: '#0a72f6' },
        { id: "ef6637", className: '#ef6637' },
        { id: "65de9a", className: '#65de9a' }
      ]
    }
    setLayoutColor(LayoutColorItems);

    const colorItems = {
      'Simple': [
        { id: "gradient", className: "gradient" },
        { id: "ffffff", className: "ffffff" },
        { id: "54b643", className: "#54b643" },
        { id: "ba2a25", className: "#ba2a25" },
        { id: "ee5335", className: "#ee5335" },
        { id: "fde04c", className: "#fde04c" },
        { id: "67cef0", className: "#67cef0" },
        { id: "ec46a4", className: "#ec46a4" },
        { id: "f08dc8", className: "#f08dc8" },
      ],
      'Box': [
        { id: "ffffff", className: "ffffff" },
        { id: "54b643", className: "#54b643" },
        { id: "ba2a25", className: "#ba2a25" },
        { id: "ee5335", className: "#ee5335" },
        { id: "fde04c", className: "#fde04c" },
        { id: "67cef0", className: "#67cef0" },
        { id: "ec46a4", className: "#ec46a4" },
        { id: "f08dc8", className: "#f08dc8" }
      ],
      'Dot': [
        { id: "ffffff", className: "ffffff" },
        { id: "54b643", className: "#54b643" },
        { id: "ba2a25", className: "#ba2a25" },
        { id: "ee5335", className: "#ee5335" },
        { id: "fde04c", className: "#fde04c" },
        { id: "67cef0", className: "#67cef0" },
        { id: "ec46a4", className: "#ec46a4" },
        { id: "f08dc8", className: "#f08dc8" }
      ],
      'Stroke': [
        { id: "ffffff", className: "ffffff" },
        { id: "54b643", className: "#54b643" },
        { id: "ba2a25", className: "#ba2a25" },
        { id: "ee5335", className: "#ee5335" },
        { id: "fde04c", className: "#fde04c" },
        { id: "67cef0", className: "#67cef0" },
        { id: "ec46a4", className: "#ec46a4" },
        { id: "f08dc8", className: "#f08dc8" }
      ],
      'Gradient': [
        { id: "ffffff", className: "ffffff" },
      ],
      'Thumnail': [
        { id: "c476dd", className: "#c476dd" },
        { id: "54b643", className: "#54b643" },
        { id: "67cef0", className: "#67cef0" },
        { id: "ec46a4", className: "#ec46a4" },
        { id: "f08dc8", className: "#f08dc8" }
      ]
    };
    setColors(colorItems);
  }, []);

  // if (layout in layoutColor) {
  // } else {
  // }


  // useEffect(() => {
  //   // const product_id = document.querySelector('input[name="product-id"]') ? document.querySelector('input[name="product-id"]').value : null;
  //   // // console.log('Product ID:', product_id); // Debugging log
  //   // const product_id = 8230530842822
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`https://caseusshopify.enactstage.com/caseusapiproduct/data`, {
  //         params: { id: params?.id }
  //       });
  //       const data = response.data.data;
  //       if (data) {
  //         setBaseImg(data.product_base_img); // Adjust based on your data structure
  //         setMaskImg(data.product_mask_img); // Adjust based on your data structure
  //         localStorage.setItem('product_width', data.product_width);
  //         localStorage.setItem('product_height', data.product_height);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching product data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  useEffect(() => {
    // Extract the variant_id from the query string
    const product_id = 8230524256454
    const searchParams = new URLSearchParams(location.search);
    const variant_id = searchParams.get('variant');
    setVariantId(variant_id);

    const fetchData = async () => {
      try {
        // Define the params object
        const params = { id: product_id }; // Use product_id from useParams

        // Add variant_id if it exists
        if (variant_id) {
          params.variant_id = variant_id;
        }

        // Fetch data with the appropriate params
        const response = await axios.get(`https://caseusshopify.enactstage.com/caseusapi/product/data`, { params });
        const data = response.data.data;

        if (data) {
          setBaseImg(data.product_base_img);
          setMaskImg(data.product_mask_img);
          localStorage.setItem('product_width', data.product_width);  // Save width to localStorage
          localStorage.setItem('product_height', data.product_height);  // Save height to localStorage
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    // Fetch data when component mounts
    fetchData();
  }, [id, location.search]);


  const handleStyleChange = (item) => {
    setSelectedStyle(item.id);

    if (item.id == 'Stroke') {
      setULineColor(designs[item.id][0]['uLineColor']);
    } else if (item.id == 'Box') {
      setBoxDesignColor(designs[item.id][0]['color']);
    } else if (item.id == 'Dot') {
      setDotDesignColorId(designs[item.id][0]['id']);
      setDotDesignColor(designs[item.id][0]['dotColor']);
    } else if (item.id == 'Thumnail') {
      setThumnailDesign(designs[item.id][0]['imageUrl']);
    } else if (item.id == 'Gradient') {
      setGradientDesign(designs[item.id][0]['id']);
    }
  }

  const handleStyleDesignChange = (item) => {
    if (selectedStyle == 'Stroke') {
      setULineColor(item['uLineColor']);
    } else if (selectedStyle == 'Box') {
      setBoxDesignColor(item['color']);
    }
    else if (selectedStyle == 'Dot') {
      setDotDesignColorId(item['id']);
      setDotDesignColor(item['dotColor']);
    }
    else if (selectedStyle == 'Dot') {
      setDotDesignColorId(item['id']);
      setDotDesignColor(item['dotColor']);
    }
    else if (selectedStyle == 'Thumnail') {
      setThumnailDesign(item['imageUrl']);
    }
    else if (selectedStyle == 'Gradient') {
      setGradientDesign(item['id']);
    }
  }

  const navPhone = () => {
    navigate('/phone');
  };


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
  const displayValue = font === 'Peace Sans' ? inputValue.toLowerCase() : inputValue.toUpperCase();
  // Determine the colors to be displayed based on the selected layout

  return (
    <>
      <div className='main'>
        <div className="left-container">
          <Pixi selectedStyle={selectedStyle}
            uLineColor={uLineColor}
            boxDesignColor={boxDesignColor}
            dotDesignColorId={dotDesignColorId}
            dotDesignColor={dotDesignColor}
            thumnailDesign={thumnailDesign}
            inputValue={inputValue}
            colortext={colortext}
            font={font}
            baseImg={baseImg}
            maskImg={maskImg}
            onExtractImage={handleExtractImage}
            layout={layout}
            gradient={gradientDesign} />

          <div id="myCanvas"></div>
        </div>

        <div className="right-container">
          <h1 className="custom-header">
            Customize
            <img
              src="https://cdn-icons-png.flaticon.com/512/2734/2734822.png"
              alt="Close"
              className="cross-icon"
              onClick={() => navPhone()}
            // onClick={handleCompleteClick}
            />
          </h1>

          <div className="selector-container">
            <span className="spanstyle">Name</span>
            <ul className="text-center text-md-left dragscroll square-box">
              <div className="input-container">
                <div className="input-container">
                  <input
                    className="inputbox"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter text"
                    maxLength={layout === 'layout5' ? 2 : layout === 'layout4' ? 3 : 8}
                  />
                  <span className="character-count">
                    {`(${displayValue.length}/${layout === 'layout5' ? 2 : layout === 'layout4' ? 3 : 8})`}
                  </span>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </div>
            </ul>
          </div>

          <div className="selector-container">
            <span className="spanstyle">Style</span>
            <ul className="text-center text-md-left dragscroll square-box style">
              {styles.map((item, index) => (
                <li
                  key={item.id}
                  id={item.id}
                  className={`item ${index === 0 ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                  onClick={() => handleStyleChange(item)}
                ></li>
              ))}
            </ul>
          </div>
          {
            (designs[selectedStyle] || []).length > 0 && (
              <div className="selector-container">
                <span className="spanstyle">Design</span>
                <ul className="text-center text-md-left dragscroll square-box design">

                  {(designs[selectedStyle] || []).map((item, index) => (
                    <li
                      key={item.id}
                      id={item.id}
                      className={`item ${index === 0 ? 'active' : ''}`}
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                      onClick={() => handleStyleDesignChange(item)}
                    ></li>
                  ))}
                </ul>
              </div>
            )
          }

          <div className="layout-container">
            <span className="spanstyle">Layout</span>
            <ul className="text-center text-md-left square-box layout">

              {(layoutItems[selectedStyle] || []).map((item, index) => (
                <li
                  key={item.id}
                  id={item.id}
                  className={`item ${index === 0 ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                  onClick={() => setLayout(item.id)}
                ></li>
              ))}
            </ul>
          </div>

          <div className="selector-container">
            <span className="spanstyle">Font</span>
            <ul className="text-center text-md-left dragscroll square-box font">

              {(fontItems[layout] || []).map((item, index) => (
                <li
                  key={item.id}
                  id={item.id}
                  className={`item ${index === 0 ? 'active' : ''}`}
                  style={{
                    backgroundImage: `url(${item.imageUrl})`,
                    fontFamily: item.font // Set the font family dynamically
                  }}
                  onClick={() => setFont(item.font)}
                ></li>
              ))}
            </ul>
          </div>

          <div className="color-container">
            <span className="spanstyle">Color</span>
            <ul className="text-center text-md-left circle-button color">
              {((layout in layoutColor) && colors[selectedStyle].length === 9
                ? layoutColor[layout] // Use the array defined for layout5
                : colors[selectedStyle] || [0]) // Use the default array
                .map((item, index) => (
                  <li
                    key={item.id}
                    id={item.id}
                    className={`item ${index === 0 ? 'active' : ''} ${item.id === 'gradient' ? 'gradient' : ''}`}
                    style={{ backgroundColor: item.id !== 'gradient' ? item.className : 'transparent' }}
                    onClick={() => setColorText(item.id)}
                  ></li>
                ))}
            </ul>
          </div>


          <button className='complete' onClick={() => navPhone()}>Complete</button>

        </div>
      </div>
    </>

  );
}

export default Customization;
