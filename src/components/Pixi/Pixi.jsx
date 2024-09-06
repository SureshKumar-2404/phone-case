import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import designs from './designs.js';
import { log } from 'react-modal/lib/helpers/ariaAppHider.js';


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
  dotDesignColorId,
  gradient
}) => {
  const appRef = useRef(null);
  const maskImageRef = useRef(null);
  const thumnailImageRef = useRef(null);

  // State to store base64 image data
  const [base64Image, setBase64Image] = useState('');

  useEffect(() => {
    if (baseImg && maskImg) {

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
    gradient,
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

  const gradientColors = {
    'OrangeGradient': {
      color1: [1.0, 0.549, 0.0],   // #ff8c00
      color2: [1.0, 0.412, 0.706], // #ff69b4
      color3: [0.0, 1.0, 1.0]      // #00ffff
    },
    'PinkGradient': {
      color1: [0.937, 0.510, 0.800], // #ef82cc
      color2: [0.757, 0.718, 0.784], // #c1b7c8
      color3: [0.882, 0.824, 0.671]  // #e1d2ab
    },
    'RedGradient': {
      color1: [0.620, 0.905, 0.980], // #9ee7fa
      color2: [0.831, 0.820, 0.694], // #d4d1b1
      color3: [0.933, 0.349, 0.208]  // #ee5935
    },
    'TriGradient': {
      color1: [1.0, 0.0, 0.0],    // Red (#ff0000)
      color2: [1.0, 1.0, 0.0],    // Yellow (#ffff00)
      color3: [0.0, 1.0, 0.0]     // Green (#00ff00)
    }
  };


  //Monogram Print Layout

  // console.log('messageoutside the if condition-----', messages);

  const gradientDesignTemplate = `
  precision mediump float;

  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;

  void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);

      if (color.a == 0.0) {
          // Transparent areas, apply gradient
          vec3 color1 = vec3(%COLOR1%);
          vec3 color2 = vec3(%COLOR2%);
          vec3 color3 = vec3(%COLOR3%);

          float gradientFactor = vTextureCoord.y; // Use y coordinate for vertical gradient

          vec3 gradientColor;
          if (gradientFactor < 0.333) {
              gradientColor = mix(color1, color2, gradientFactor / 0.333);
          } else if (gradientFactor < 0.667) {
              gradientColor = mix(color2, color3, (gradientFactor - 0.333) / 0.334);
          } else {
              gradientColor = color3;
          }

          gl_FragColor = vec4(gradientColor, 1.0);
      } else if (color.rgb == vec3(0.0)) {
          // Change black part to transparent
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else {
          // Keep other colors unchanged
          gl_FragColor = color;
      }
  }
  `;
  // Function to generate the monogram pattern

  function generateGradientDesign(gradient) {
    if (gradient in gradientColors) {
      const colors = gradientColors[gradient];
      let gradientDesign = gradientDesignTemplate;
      gradientDesign = gradientDesign.replace('%COLOR1%', colors.color1.join(', '));
      gradientDesign = gradientDesign.replace('%COLOR2%', colors.color2.join(', '));
      gradientDesign = gradientDesign.replace('%COLOR3%', colors.color3.join(', '));
      return gradientDesign;
    }
    return gradientDesignTemplate; // Default design
  }
  //Monogram Pattern
  const generateMonogramPattern = (letters, color1, color2, spacing, fontSize) => {
    if (!maskImageRef.current) return;

    // Clear previous text elements
    maskImageRef.current.removeChildren();

    const textStyle1 = new PIXI.TextStyle({
      fontFamily: font,
      fontSize: fontSize,
      fill: color1,
    });

    const textStyle2 = new PIXI.TextStyle({
      fontFamily: font,
      fontSize: fontSize,
      fill: color2,
    });

    const letter1 = new PIXI.Text(letters[0], textStyle1);
    const letter2 = new PIXI.Text(letters[1], textStyle2);

    const patternWidth = letter1.width + spacing;
    const patternHeight = letter1.height + spacing;

    const numRows = Math.ceil(appRef.current.view.height / patternHeight);
    const numCols = Math.ceil(appRef.current.view.width / patternWidth);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = col * patternWidth;
        const y = row * patternHeight;

        const isEvenPosition = (row + col) % 2 === 0;
        const letter = isEvenPosition ? new PIXI.Text(letters[0], textStyle1) : new PIXI.Text(letters[1], textStyle2);

        letter.position.set(x, y);
        maskImageRef.current.addChild(letter);
      }
    }
  };
  const updateDesign = () => {
    const app = appRef.current;
    const maskImage = maskImageRef.current;
    const thumnailImage = thumnailImageRef.current;
    let designString;

    if (selectedStyle === 'Dot') {
      designString = designs[selectedStyle][dotDesignColorId];
    } else {
      designString = designs[selectedStyle];
    }

    // Setup your container dimensions for each layout
    const layoutDimensions = {
      layout1: { width: 100, height: 80 },
      layout2: { width: 40, height: 30 },
      layout3: { width: 150, height: 150 },
      layout4: { width: 100, height: 80 },
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

    if (colortext === 'gradient') {
      textStyleConfig.fill = [
        "#ed1c24",
        "#f78d1e",
        "#ffdf00",
        "#02ad5c",
        "#0665c8",
        "#81419c"
      ];
      textStyleConfig.fillGradientType = 1;
    } else {
      textStyleConfig.fill = `#${colortext}`;
    }

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
      designString = generateGradientDesign(gradient);
    }
    if (selectedStyle === 'Thumnail') {
      textStyleConfig.fontFamily = 'Y2k Fill';
      textStyleConfig.fontSize = 15;
      layout = 'layout2';
    }

    if (!maskImage.texture) {
      return;
    }

    const filter = new PIXI.Filter(null, designString, {
      uResolution: [maskImage.texture.width, maskImage.texture.height],
      uLineColor: uLineColor,
    });

    maskImage.filters = [filter];


    if (font === 'Peace Sans') {
      textStyleConfig.lineJoin = "round";
      textStyleConfig.dropShadow = true;
      textStyleConfig.dropShadowAngle = 2.6;
      textStyleConfig.dropShadowColor = "#050505";
      textStyleConfig.stroke = '#000000';
      textStyleConfig.strokeThickness = 6;
      textStyleConfig.font = 'Peace Sans'
      value = inputValue.slice(0, maxLength).toLowerCase();
    }

    //Monogram
    // let messages = []; // Array to store all message objects


    const applyLayoutSpecificFontSize = (layout) => {
      let fontSize;
      let containerWidth;
      let containerHeight;

      switch (layout) {
        case 'layout1':
          fontSize = 80;
          containerWidth = layoutDimensions.layout1.width;
          containerHeight = layoutDimensions.layout1.height;
          break;
        case 'layout2':
          fontSize = 300;
          containerWidth = layoutDimensions.layout2.width;
          containerHeight = layoutDimensions.layout2.height;
          break;
        case 'layout3':
          fontSize = 150;  // Default font size for layout 3
          containerWidth = layoutDimensions.layout3.width;
          containerHeight = layoutDimensions.layout3.height;
          break;
        case 'layout4':
          fontSize = 150;
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
        fontSize: 60,
        textBaseline: font === 'Y2k Fill' ? "alphabetic" : "alphabetic",
      };
      if (font === 'Peace Sans') {
        textStyleConfig.lineJoin = "round";
        textStyleConfig.dropShadow = true;
        textStyleConfig.dropShadowAngle = 2.6;
        textStyleConfig.dropShadowColor = "#050505";
        textStyleConfig.stroke = '#000000';
        textStyleConfig.strokeThickness = 6;
        textStyleConfig.font = 'Peace Sans'
        value = inputValue.slice(0, maxLength).toLowerCase();
      }
      if (font === 'Brush Script MT') {
        textStyleConfig.font = 'Peace Sans';
        textStyleConfig.fontSize = 70;
        textStyleConfig.wordWrap = true;
        textStyleConfig.wordWrapWidth = containerWidth;
        textStyleConfig.lineHeight = 30
      }
      const style = new PIXI.TextStyle(textStyleConfig);
      text.style = style;
      text.rotation = 4.7124;
      text.anchor.set(0.5, 0.5); // Center the anchor point
      const textArea = {
        x: app.screen.width / 2 - containerWidth / 2,
        y: app.screen.height / 2 - containerHeight / 2,
        width: containerWidth,
        height: containerHeight,
      };
      text.x = textArea.x + (textArea.width - text.height) / 2 + 20; // Adjust for rotation
      text.y = textArea.y + (textArea.height - text.width) / 2 + 30; // Adjust for rotation
      text.x = app.screen.width - 450 / 2 - 15;
      text.y = app.screen.height / 2 + 60;
    };

    const applyLayout2 = (text, containerWidth, containerHeight) => {
      let textStyleConfig = {
        ...text.style,
        fontSize: selectedStyle === 'Thumnail' ? 70 : 150, // Adjust font size for Thumnail style
        textBaseline: selectedStyle === 'Thumnail' ? "alphabetic" : "alphabetic",
      };
      if (font === 'Peace Sans') {
        textStyleConfig.lineJoin = "round";
        textStyleConfig.dropShadow = true;
        textStyleConfig.dropShadowAngle = 2.6;
        textStyleConfig.dropShadowColor = "#050505";
        textStyleConfig.stroke = '#000000';
        textStyleConfig.strokeThickness = 6;
        textStyleConfig.font = 'Peace Sans'
        value = inputValue.slice(0, maxLength).toLowerCase();
      }

      if (font === 'Brush Script MT') {
        textStyleConfig.font = 'Peace Sans';
        textStyleConfig.fontSize = 70;
        textStyleConfig.wordWrap = true;
        textStyleConfig.wordWrapWidth = containerWidth;
        textStyleConfig.lineHeight = 30
      }
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
        textBaseline: font === 'Y2k Fill' ? "alphabetic" : "alphabetic",
        letterSpacing: 1,
      };
      if (colortext === 'gradient') {
        textStyleConfig.fill = [
          "#ed1c24",
          "#f78d1e",
          "#ffdf00",
          "#02ad5c",
          "#0665c8",
          "#81419c"
        ];
        textStyleConfig.fillGradientType = 1;
      } else {
        textStyleConfig.fill = `#${colortext}`;
      }
      // if (font === 'Peace Sans') {
      //   textStyleConfig.stroke = '#050505';
      //   textStyleConfig.strokeThickness = 5;
      //   value = inputValue.slice(0, maxLength).toLowerCase();
      // }
      if (font === 'Peace Sans') {
        textStyleConfig.lineJoin = "bevel";
        textStyleConfig.dropShadow = true;
        textStyleConfig.dropShadowAngle = 0.5;
        textStyleConfig.dropShadowColor = "#050505";
        textStyleConfig.stroke = '#000000';
        textStyleConfig.strokeThickness = 2;
        textStyleConfig.font = 'Peace Sans',
          textStyleConfig.letterSpacing = 1,
          value = inputValue.slice(0, maxLength).toLowerCase();
      }

      if (font === 'Brush Script MT') {
        textStyleConfig.font = 'Peace Sans';
        textStyleConfig.fontSize = 70;
        textStyleConfig.wordWrap = true;
        textStyleConfig.wordWrapWidth = containerWidth;
        textStyleConfig.lineHeight = 30;
      }
      const style = new PIXI.TextStyle(textStyleConfig);
      text.style = style;
      const textArea = {
        x: app.screen.width / 2 - 100,
        y: app.screen.height / 2 - 30,
        width: containerWidth,
        height: containerHeight,
      };
      // Calculate the position for the bottom alignment
      text.x = textArea.x + (textArea.width - text.width) / 2 + 30;
      text.y = app.screen.height - text.height - 70; // Adjust positioning as needed
    };
    //Make Monogram Design

    const applyLayout4 = (text, containerWidth, containerHeight) => {
      let textStyleConfig = {
        ...text.style,
        letterSpacing: 1,
        fontSize: font === 'Peace Sans' ? 85 : 75,
        textBaseline: font === 'Y2k Fill' ? "alphabetic" : "alphabetic",
      };
      if (font === 'Peace Sans') {
        textStyleConfig.lineJoin = "round";
        textStyleConfig.dropShadow = true;
        textStyleConfig.dropShadowAngle = 2.1;
        textStyleConfig.dropShadowColor = "#050505";
        textStyleConfig.stroke = '#000000';
        textStyleConfig.strokeThickness = 4;
        textStyleConfig.font = 'Peace Sans';
        textStyleConfig.letterSpacing = 1;
        value = inputValue.slice(0, maxLength).toLowerCase();
      }
      if (font === 'Brush Script MT') {
        textStyleConfig.font = 'Peace Sans';
        textStyleConfig.fontSize = 70;
        textStyleConfig.wordWrap = true;
        textStyleConfig.wordWrapWidth = containerWidth;
        textStyleConfig.lineHeight = 30
      }
      const style = new PIXI.TextStyle(textStyleConfig);
      text.style = style;

      // Set anchor to the center
      text.anchor.set(0.5, 0.5);

      // Define the container area
      const textArea = {
        x: (app.screen.width - containerWidth) / 2,
        y: (app.screen.height - containerHeight) / 2,
        width: containerWidth,
        height: containerHeight,
      };

      // Adjust text position to fit within the container
      text.x = textArea.x + textArea.width / 2 - 10;
      text.y = textArea.y + textArea.height / 2 + 90;

      text.rotation = 4.7124; // Rotate the text as needed
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

    //Add gradient color 
    if (layout === 'layout5') {
      let inputValue = "AB";
      const letters = inputValue.split("");
      const firstLetter = letters[0].toUpperCase();
      const secondLetter = letters[1] ? letters[1].toUpperCase() : firstLetter;

      // Text styles for the alternating letters
      const textStyleA = new PIXI.TextStyle({
        fontFamily: "Guyon Gazebo",
        fontSize: 80,
        fill: "#fff9dc",
        align: "center",
        stroke: "#000000",
        strokeThickness: 3,
      });

      const textStyleB = new PIXI.TextStyle({
        fontFamily: "Guyon Gazebo",
        fontSize: 80,
        fill: `#${colortext}`,
        align: "center",
        stroke: "#000000",
        strokeThickness: 3,
      });

      const settings = {
        letters: [firstLetter, secondLetter],
        spacingX: 50, // Horizontal spacing between letters
        spacingY: 100, // Vertical spacing between letters
        offsetY: 20,  // Vertical offset for the second letter
        rotation: Math.PI / 10, // Rotation angle for the letters
        rowCount: 11, // Number of rows
        columnCount: 11, // Number of columns
      };

      const maskArea = {
        width: maskImage.texture.width,
        height: maskImage.texture.height,
        x: app.screen.width / 2 - maskImage.texture.width / 2,
        y: app.screen.height / 2 - maskImage.texture.height / 2,
      };

      // Create a container to hold the text
      const textContainer = new PIXI.Container();

      for (let row = 0; row < settings.rowCount; row++) {
        for (let col = 0; col < settings.columnCount; col++) {
          const letterIndex = col % settings.letters.length;
          const letter = settings.letters[letterIndex];
          const textStyle = letterIndex === 0 ? textStyleA : textStyleB;

          const message = new PIXI.Text(letter, textStyle);
          message.anchor.set(0.5);

          // Calculate position based on the mask area and row/column indices
          const xPosition = maskArea.x + (col * settings.spacingX);
          const yPosition = maskArea.y + (row * settings.spacingY) + (letterIndex === 1 ? settings.offsetY : 0);

          // Ensure the text fits within the mask area
          if (xPosition < maskArea.x + maskArea.width && yPosition < maskArea.y + maskArea.height) {
            message.position.set(xPosition, yPosition);
            message.rotation = settings.rotation;
            app.stage.addChild(message);
          }
        }
      }

      // Define the fragment shader for the filter
      const designString = `
          varying vec2 vTextureCoord;
          uniform sampler2D uSampler;
          uniform vec2 uResolution;
          uniform vec4 uLineColor;
  
          void main(void) {
              vec4 color = texture2D(uSampler, vTextureCoord);
  
              // Example shader logic: make black parts transparent
              if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
                  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
              } else {
                  gl_FragColor = color;
              }
          }
      `;

      // Create and apply the filter
      const filter = new PIXI.Filter(null, designString, {
        uResolution: [maskImage.texture.width, maskImage.texture.height],
        uLineColor: [1.0, 1.0, 0.0, 1.0], // Example: Yellow color for the line (RGBA)
      });

      textContainer.filters = [filter];

      // Add the text container to the stage
      app.stage.addChild(textContainer);
    }

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
    }
  };


  return (
    <div>
      <div id="myCanvas"></div>
    </div>
  );
};

export default Pixi;
