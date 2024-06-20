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

    let designString = designs[selectedStyle];

    const baseFontSize = 130;
    const scalingFactor = 14;
    const maxLength = 8;

    let value = inputValue.slice(0, maxLength).toUpperCase();
    localStorage.setItem('text', value);
    let textStyleConfig = {
      dropShadowAngle: 10,
      dropShadowColor: '#cdc137',
      fontSize: baseFontSize - value.length * scalingFactor,
      fontWeight: 600,
      fill: `${colortext}`,
      fontFamily: `${font}`,
      breakWords: true,
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
      textStyleConfig.fontSize = 20;
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

    if (font === 'Y2k Fill') {
      textStyleConfig.fontSize = 20;
    }

    const style = new PIXI.TextStyle(textStyleConfig);
    const text = new PIXI.Text(value, style);

    const textArea = {
      x: app.screen.width / 2 - 100,
      y: app.screen.height / 2 - 20,
      width: 200,
      height: 40,
    };

    text.x = textArea.x + (textArea.width - text.width) / 2;
    text.y = textArea.y + (textArea.height - text.height) / 2;

    const childrenToRemove = app.stage.children.filter(child => child instanceof PIXI.Text);
    childrenToRemove.forEach(child => app.stage.removeChild(child));

    app.stage.addChild(maskImage);
    app.stage.addChild(text);

    if (selectedStyle === 'Thumnail' && thumnailImage) {
      app.stage.addChild(thumnailImage);
    } else if (thumnailImage) {
      app.stage.removeChild(thumnailImage);
    }
  };

  const extractImage = () => {
    const app = appRef.current;
    if (app) {
      // Extract the base64 image data from the PIXI stage
      const image = app.renderer.plugins.extract.base64(app.stage);
      console.log('image', image);

      // Set the base64 image data into the state
      setBase64Image(image);

      // Store the base64 image data in localStorage
      localStorage.setItem('base64Image', image);

      // Create a link element for downloading the image
      const link = document.createElement('a');
      link.href = image;
      // link.download = 'design.png';

      // Append the link to the document body, trigger a click, and remove the link
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
