import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import designs from './designs.js';

const Pixi = ({
  selectedStyle,
  uLineColor,
  boxDesignColor,
  dotDesignColor,
  thumnailDesign,
  inputValue,
  colortext,
  font,
  baseImg,
  maskImg,
  onExtractImage,
  layout,
  dotDesignColorId
}) => {
  const appRef = useRef(null);
  const maskImageRef = useRef(null);
  const thumnailImageRef = useRef(null);

  // State to store base64 image data
  const [base64Image, setBase64Image] = useState('');

  useEffect(() => {
    if (baseImg && maskImg) {
      console.log('Initializing PIXI application');

      const app = new PIXI.Application({
        backgroundColor: 0xffffff,
        resolution: 2,
        height: 560,
        width: 560,
      });

      document.body.querySelector('#myCanvas').appendChild(app.view);
      appRef.current = app; // Store the PIXI Application instance

      const loader = new PIXI.Loader();
      loader.add('base', baseImg);
      loader.add('mask', maskImg);

      if (thumnailDesign) {
        loader.add('thumnail', thumnailDesign);
      }

      loader.load((loader, resources) => {
        const baseImage = new PIXI.Sprite(resources.base.texture);
        const maskImage = new PIXI.Sprite(resources.mask.texture);
        baseImage.anchor.set(0.5);
        baseImage.x = app.screen.width / 2;
        baseImage.y = app.screen.height / 2;

        maskImage.anchor.set(0.5);
        maskImage.x = app.screen.width / 2;
        maskImage.y = app.screen.height / 2;
        maskImageRef.current = maskImage;

        app.stage.addChild(baseImage);
        app.stage.addChild(maskImage);

        if (thumnailDesign) {
          const thumnailImage = new PIXI.Sprite(resources.thumnail.texture);
          thumnailImage.anchor.set(0.5);
          thumnailImage.x = app.screen.width / 2;
          thumnailImage.y = app.screen.height / 2;
          thumnailImage.width = resources.thumnail.texture.orig.width + 50;
          thumnailImage.height = resources.thumnail.texture.orig.height + 50;
          thumnailImageRef.current = thumnailImage;
          app.stage.addChild(thumnailImage);
        }

        // Initial design setup
        updateDesign();
      });

      return () => {
        // Cleanup: Destroy PIXI Application instance
        app.destroy(true, { children: true, texture: true, baseTexture: true });
      };
    }
  }, [baseImg, maskImg, thumnailDesign]);
  useEffect(() => {
    if (appRef.current && maskImageRef.current) {
      // Update design when dependent props change
      updateDesign();
    }
  }, [
    selectedStyle,
    uLineColor,
    boxDesignColor,
    dotDesignColor,
    inputValue,
    colortext,
    font,
    maskImg,
    layout,
    dotDesignColorId
  ]);

  useEffect(() => {
    if (onExtractImage) {
      // Handle extract image action
      onExtractImage(extractImage);
    }
  }, [onExtractImage]);

  const updateDesign = () => {
    const app = appRef.current;
    const maskImage = maskImageRef.current;
    const thumnailImage = thumnailImageRef.current;
    let designString;

    if (selectedStyle == 'Dot') {
      designString = designs[selectedStyle][dotDesignColorId];
    } else {
      designString = designs[selectedStyle];
    }
    // Setup your container dimensions for each layout
    const layoutDimensions = {
      layout1: { width: 60, height: 30 },
      layout2: { width: 40, height: 30 },
      layout3: { width: 180, height: 100 },
      layout4: { width: 90, height: 90 },
    };

    const baseFontSize = 160;
    const scalingFactor = 14;
    const maxLength = 8;

    let value = inputValue.slice(0, maxLength).toUpperCase();
    localStorage.setItem('text', value);

    let textStyleConfig = {
      dropShadowAngle: 10,
      dropShadowColor: '#cdc137',
      fill: `#${colortext}`,
      fontFamily: `${font}`,
      textBaseline: "bottom",
      wordWrap: true,
    };

    if (selectedStyle === 'Box') {
      designString = designString.replaceAll('%BOX_COLOR%', boxDesignColor);
    }
    if (selectedStyle === 'Dot') {
      designString = designString.replaceAll('%DOT_COLOR%', dotDesignColor);
    }
    if (selectedStyle === 'Stroke') {
      uLineColor = uLineColor;
    }
    if (selectedStyle === 'Gradient') {
      textStyleConfig.fill = '#ffffff';
    }
    if (selectedStyle === 'Thumnail') {
      textStyleConfig.fontFamily = 'Y2k Fill';
      textStyleConfig.fontSize = 15;
      layout = 'layout2'
    }

    const filter = new PIXI.Filter(null, designString, {
      uResolution: [maskImage.texture.width, maskImage.texture.height],
      uLineColor: uLineColor,
    });

    maskImage.filters = [filter];

    if (font === 'Peace Sans') {
      textStyleConfig.stroke = '#050505';
      textStyleConfig.strokeThickness = 5;
      value = inputValue.slice(0, maxLength).toLowerCase();
    }

    const applyLayoutSpecificFontSize = (layout) => {
      let fontSize;
      let containerWidth;
      let containerHeight;

      switch (layout) {
        case 'layout1':
          fontSize = 160;
          containerWidth = layoutDimensions.layout1.width;
          containerHeight = layoutDimensions.layout1.height;
          break;
        case 'layout2':
          fontSize = 300;
          containerWidth = layoutDimensions.layout2.width;
          containerHeight = layoutDimensions.layout2.height;
          break;
        case 'layout3':
          fontSize = 200;  // Default font size for layout 3
          containerWidth = layoutDimensions.layout3.width;
          containerHeight = layoutDimensions.layout3.height;
          break;
        case 'layout4':
          fontSize = 100;
          containerWidth = layoutDimensions.layout4.width;
          containerHeight = layoutDimensions.layout4.height;
          break;
        default:
          fontSize = baseFontSize;
          containerWidth = 200; // Default container width
          containerHeight = 100; // Default container height
          break;
      }

      fontSize -= (value.length - 1) * scalingFactor;

      return { fontSize, containerWidth, containerHeight };
    };

    // Define layout functions
    const applyLayout1 = (text, containerWidth, containerHeight) => {
      let textStyleConfig = {
        ...text.style,
        fontSize: 150,
        textBaseline: font === 'Y2k Fill' ? "alphabetic" : "bottom",
      };
      const style = new PIXI.TextStyle(textStyleConfig);
      text.style = style;
      text.rotation = 4.7124;
      text.anchor.set(0.5, 0.5); // Center the anchor point
      text.x = app.screen.width - 360 / 2;
      text.y = app.screen.height / 2 + 55;
    };

    const applyLayout2 = (text, containerWidth, containerHeight) => {
      let textStyleConfig = {
        ...text.style,
        fontSize: selectedStyle === 'Thumnail' ? 70 : 150, // Adjust font size for Thumnail style
          textBaseline: selectedStyle === 'Thumnail' ? "alphabetic" : "alphabetic",
      };
      const style = new PIXI.TextStyle(textStyleConfig);
      text.style = style;
    
      if (selectedStyle === 'Thumnail') {
        // Custom positioning and dimensions for Thumnail style
        const textArea = {
          x: app.screen.width / 2 - 100,
          y: app.screen.height / 2 - 50,
          width: 50, // Adjust width for Thumnail style
          height: 60, // Adjust height for Thumnail style
        };
        text.x = textArea.x + (textArea.width - text.width) / 2 + 80;
        text.y = textArea.y + (textArea.height - text.height) / 2 + 30;
      } else {
        // Default positioning and dimensions for layout2
        const textArea = {
          x: app.screen.width / 2 - 100,
          y: app.screen.height / 2 - 20,
          width: containerWidth,
          height: containerHeight,
        };
        text.x = textArea.x + (textArea.width - text.width) / 2 + 80;
        text.y = textArea.y + (textArea.height - text.height) / 2 + 30;
      }
    };
    

    let bottomText; // Define bottomText variable outside functions to make it accessible after initialization

    const applyLayout3 = (text, containerWidth, containerHeight) => {
      let textStyleConfig = {
        ...text.style,
        fontWeight: 'bold',
        fill: `#${colortext}`,
        fontFamily: `${font}`,
        textBaseline: font === 'Y2k Fill' ? "alphabetic" : "bottom",
      };
      const style = new PIXI.TextStyle(textStyleConfig);
      text.style = style;
      const textArea = {
        x: app.screen.width / 2 - 100,
        y: app.screen.height / 2 - 20,
        width: containerWidth,
        height: containerHeight,
      };
      // Calculate the position for the bottom alignment
      text.x = textArea.x + (textArea.width - text.width) / 2 + 10;
      text.y = app.screen.height - text.height - 70 + 30; // Adjust positioning as needed
    };

    const applyLayout4 = (text, containerWidth, containerHeight) => {
      let textStyleConfig = {
        ...text.style,
        fontSize: 80,
        textBaseline: font === 'Y2k Fill' ? "alphabetic" : "bottom",
      };
      const style = new PIXI.TextStyle(textStyleConfig);
      text.style = style;
      text.rotation = 4.7124;
      text.anchor.set(0.5, 0.5); // Center the anchor point
      text.x = app.screen.width / 2 - 10 + 30 ;
      text.y = app.screen.height / 2 + 80 - 10 ;
    };

    // Set the font size based on the layout
    const { fontSize, containerWidth, containerHeight } = applyLayoutSpecificFontSize(layout);

    // Create the text object based on the incoming value and style configuration
    const style = new PIXI.TextStyle(textStyleConfig);
    let text = new PIXI.Text(value, style);

    // Ensure the text fits within the specified container dimensions
    const scaleTextToFitContainer = (text, containerWidth, containerHeight) => {
      const scaleX = containerWidth / text.width;
      const scaleY = containerHeight / text.height;
      const scale = Math.min(scaleX, scaleY);
      text.scale.set(scale, scale);
      text.x = (containerWidth - text.width * scale) / 2;
      text.y = (containerHeight - text.height * scale) / 2;
    };

    scaleTextToFitContainer(text, containerWidth, containerHeight);

    // Apply layout based on the selected layout
    switch (layout) {
      case 'layout1':
        applyLayout1(text, containerWidth, containerHeight);
        break;
      case 'layout2':
        applyLayout2(text, containerWidth, containerHeight);
        break;
      case 'layout3':
        applyLayout3(text, containerWidth, containerHeight);
        break;
      case 'layout4':
        applyLayout4(text, containerWidth, containerHeight);
        break;
      default:
        applyLayout1(text, containerWidth, containerHeight);
        break;
    }

    // Remove previous text objects from the stage
    const childrenToRemove = app.stage.children.filter(child => child instanceof PIXI.Text);
    childrenToRemove.forEach(child => app.stage.removeChild(child));

    if (selectedStyle === 'Thumnail' && thumnailImage) {
      app.stage.addChild(thumnailImage);
    } else if (thumnailImage) {
      app.stage.removeChild(thumnailImage);
    }

    app.stage.addChild(maskImage);
    app.stage.addChild(text);

    if (bottomText) {
      app.stage.addChild(bottomText);
    }
  };
  const extractImage = () => {
    const app = appRef.current;
    if (app) {
      // Extract the base64 image data from the PIXI stage
      const image = app.renderer.plugins.extract.base64(app.stage);
      localStorage.setItem('base64', image);
      // Set the base64 image data into the state
      setBase64Image(image);

      // Create a link element for downloading the image
      const link = document.createElement('a');
      link.href = image;
      link.download = 'design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <div>
      <div id="myCanvas"></div>
    </div>
  );
};

export default Pixi;
