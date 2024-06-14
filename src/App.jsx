import Pixi from './Pixi.jsx';
import { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [fontItems, setFontItems] = useState([]);
  const [baseImg, setBaseImg] = useState('');
  const [maskImg, setMaskImg] = useState('');

  const [imageItems2, setImageItems2] = useState([]);
  const [font, setFont] = useState('Peace Sans');
  const [layout, setLayout] = useState('layout1');
  const [colortext, setColorText] = useState('white');
  const [styles, setStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('Simple');

  const [designs, setDesigns] = useState([]);
  const [selectedDesignColor, setSelectedDesignColor] = useState(null);

  const [colors, setColors] = useState([]);
  const [uLineColor, setULineColor] = useState([]);
  const [boxDesignColor, setBoxDesignColor] = useState(null);
  const [dotDesignColor, setDotDesignColor] = useState('white');
  const [thumnailDesign, setThumnailDesign] = useState('https://caseus.s3.ap-south-1.amazonaws.com/Teddy.svg');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  useEffect(() => {
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
        // { id: "Orange", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Orange.svg', uLineColor: [0.0, 0.0, 1.0, 1.0] },
        // { id: "PinkGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/PinkGradient.svg', uLineColor: [0.0, 0.0, 1.0, 1.0] },
      ],
      'Gradient': [
        { id: "OrangeGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/OrangeGradient.svg' },
        { id: "PinkGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/PinkGradient.svg' },
        { id: "RedGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/RedGradient.svg' },
        { id: "TriGradient", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Stroke/Gradient/TriGradient.svg' },
      ],
      'Thumnail': [
        { id: "Teddy", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Teddy.svg' },
        { id: "Heart", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Heart.svg' },
        { id: "Butterfly", imageUrl: 'https://caseus.s3.ap-south-1.amazonaws.com/Butterfly.svg' },
      ]
    };

    setDesigns(design);

    const fontItems = [
      { id: "Arial", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/35d0b2830b4f8c6a232ca527b27d529a.svg", font: 'Peace Sans' },
      { id: "Impact", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/b6921243aa49c66eee5a4a1cdb35af9b.svg", font: 'Buenos Aires' },
      { id: "font3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/8e14df29e1e72fea5c396f88da5f09bf.svg", font: 'Guyon Gazebo' },
      { id: "Brush Script MT", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/7e7ee0a8d93a62cfe8100517097b45d9.svg", font: 'Quentin' },
      { id: "Bradley Hand", imageUrl: "https://cdn.casetify.com/static/cms/image/30176/Screenshot_2022-05-19_at_6.46.28_PM.png", font: 'Hyogo' },
      { id: "Y2k Fill", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/3ed54a22c0d80dc6d07b6d9d06e8b27e.svg", font: 'Y2k Fill' }
    ];
    setFontItems(fontItems);

    const imageItems2 = [
      { id: "layout1", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/9c4c82cc261cf174d9d201373a1d02e4.svg" },
      { id: "layout2", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/ac417f35ab911f8462a6e5a438b4d7a7.svg" },
      { id: "layout3", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/228dc318b4d260bf0ec1d950ce9c8beb.svg" },
      { id: "layout4", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4adc012cc49894d833c9b202dcf291b0.svg" },
      { id: "layout5", imageUrl: "https://ctgimage1.s3.amazonaws.com/cms/image/4ca09b8117dea1765e1e84f867c36dec.svg" }
    ];
    setImageItems2(imageItems2);

    const colorItems = [
      { id: "white", className: "white" },
      { id: "green", className: "green" },
      { id: "red", className: "red" },
      { id: "orange", className: "orange" },
      { id: "yellow", className: "yellow" },
      { id: "aqua", className: "blue" },
      { id: "pink", className: "pink" },
      { id: "magenta", className: "magenta" }
    ];
    setColors(colorItems);
  }, []);

  useEffect(() => {
    const product_id = document.querySelector('input[name="product-id"]').value;
    // // console.log('Product ID:', product_id); // Debugging log
    // const product_id = 8230530842822
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/product/data`, {
          params: { id: product_id }
        });
        const data = response.data.data;
        if (data) {
          setBaseImg(data.product_base_img); // Adjust based on your data structure
          setMaskImg(data.product_mask_img); // Adjust based on your data structure
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchData();
  }, []);

  const handleStyleChange = (item) => {
    setSelectedStyle(item.id);

    if (item.id == 'Stroke') {
      setULineColor(designs[item.id][0]['uLineColor']);
    } else if (item.id == 'Box') {
      setBoxDesignColor(designs[item.id][0]['color']);
    } else if (item.id == 'Dot') {
      setDotDesignColor(designs[item.id][0]['dotColor']);
    } else if (item.id == 'Thumnail') {
      setThumnailDesign(designs[item.id][0]['imageUrl']);
    }
  }

  const handleStyleDesignChange = (item) => {
    if (selectedStyle == 'Stroke') {
      setULineColor(item['uLineColor']);
    } else if (selectedStyle == 'Box') {
      setBoxDesignColor(item['color']);
    }
    else if (selectedStyle == 'Dot') {
      setDotDesignColor(item['dotColor']);
    }
    if (selectedStyle == 'Thumnail') {
      setThumnailDesign(item['imageUrl']);
    }
  }

  const appRef = useRef(null);

  const handleExtractImage = (extractImage) => {
    // Attach extractImage function to a ref or state to use it later
    appRef.current = extractImage;
  };

  const handleCompleteClick = () => {
    if (appRef.current) {
      appRef.current();
    }
  };

  return (
    <>
      <div className='main'>
        <div className="left-container">
          <Pixi selectedStyle={selectedStyle} uLineColor={uLineColor} boxDesignColor={boxDesignColor} dotDesignColor={dotDesignColor} thumnailDesign={thumnailDesign} inputValue={inputValue} colortext={colortext} font={font} baseImg={baseImg} maskImg={maskImg} onExtractImage={handleExtractImage} />

          <div id="myCanvas"></div>
        </div>

        <div className="right-container">
          <h1 className="custom-header">
            Customize
            <img
              src="https://cdn-icons-png.flaticon.com/512/2734/2734822.png"
              alt="Close"
              className="cross-icon"
            />
          </h1>

          <div className="selector-container">
            <span className="spanstyle">Name</span>
            <ul className="text-center text-md-left dragscroll square-box">

              <div className="input-container">
                <input
                  className='inputbox'
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter text"
                  maxLength={8}
                />
                <span className="character-count">
                  {`(${inputValue.length}/${8})`}
                </span>
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

          <div className="selector-container">
            <span className="spanstyle">Font</span>
            <ul className="text-center text-md-left dragscroll square-box font">

              {fontItems.map((item, index) => (
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

          <div className="layout-container">
            <span className="spanstyle">Layout</span>
            <ul className="text-center text-md-left square-box layout">

              {imageItems2.map((item, index) => (
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

          <div className="color-container">
            <span className="spanstyle ">Color</span>
            <ul className="text-center text-md-left circle-button color">

              {colors.map((item, index) => (
                <li
                  key={item.id}
                  id={item.id}
                  className={`item ${item.className} ${index === 0 ? 'active' : ''}`}
                  onClick={() => setColorText(item.id)}
                ></li>
              ))}
            </ul>
          </div>

          <button className='complete' onClick={handleCompleteClick}>Complete</button>

        </div>
      </div>
    </>

  );
}

export default App;
