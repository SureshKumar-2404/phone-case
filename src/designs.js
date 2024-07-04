const simpleDesign = `
  precision mediump float;
  uniform sampler2D uSampler;
  varying vec2 vTextureCoord;

  void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);

      if (color.a == 0.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else {
          float greenComponent = clamp(1.0 - vTextureCoord.y, 0.0, 1.0);
          float yellowComponent = 1.0 - greenComponent;
          gl_FragColor = vec4(0.0, greenComponent, 0.0, 1.0) + vec4(1.0, 1.0, 0.0, 1.0) * yellowComponent;
      }
  }
`;

const strokeDesign = `
  precision mediump float;

  uniform sampler2D uSampler;
  varying vec2 vTextureCoord;
  uniform vec2 uResolution;
  uniform vec4 uLineColor;

  void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);

      if (color.a == 0.0) {

          vec2 imageSize = vec2(500.0, 500.0); // Image size, adjust as needed

          float lineAngle = 65.0; // Angle of the stroke line
          vec2 lineStart = vec2(115.0, 150.0); // Starting point of the stroke line, adjust as needed
          float lineLength = 200.0; // Length of the stroke line, equal to image size
          vec2 lineDirection = normalize(vec2(cos(radians(lineAngle)), sin(radians(lineAngle))));

          vec2 uv = vTextureCoord * imageSize;
          float lineDistance = dot(uv - lineStart, lineDirection);
          float lineWidth = 35.0; // Adjust this value to widen or narrow the line

          bool isStroke = abs(lineDistance) < lineWidth && all(greaterThanEqual(uv, vec2(0.0))) && all(lessThan(uv, imageSize));

          if (isStroke) {
              gl_FragColor = uLineColor;
          }

      } else if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
          // Change black part to transparent
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else {
          // Keep other colors unchanged
          gl_FragColor = vec4(color.rgb, 1.0);
      }
  }
`;

const boxDesign = `
precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
uniform vec2 uResolution;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);

    if (color.a == 0.0) {
        // Create checkered pattern for transparent areas
        float checkerSize = 22.2;
        vec2 coord = mod((vTextureCoord * uResolution + 0.5  *checkerSize) / checkerSize, 2.0);
        float checker = mod(floor(coord.x) + floor(coord.y + (checkerSize*0.4)), 2.0);
        vec3 checkerColor = checker == 0.0 ? vec3(%BOX_COLOR%) : vec3(0.0); // black and white
        gl_FragColor = vec4(checkerColor, 1.0);
    } else if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
        // Change black part to transparent
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
        // Keep other colors unchanged
        gl_FragColor = vec4(color.rgb, 1.0);
    }
}

`;

const dotDesign = `
precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
uniform vec2 uResolution;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);

    vec2 imageSize = uResolution; // Use the provided resolution
    vec2 uv = vTextureCoord * imageSize;

    // Define grid size and dot radius
    float gridSizeX = 35.0; // Distance between dot centers horizontally
    float gridSizeY = 15.0; // Distance between dot centers vertically
    float dotRadius = 6.0; // Radius of each dot

    // Calculate the row and column index
    float rowIndex = floor(uv.y / gridSizeY);
    float colIndex = floor((uv.x - (mod(rowIndex, 2.0) * gridSizeX * 0.5)) / gridSizeX);

    // Apply an offset for every other row to create a staggered effect
    float offsetX = mod(rowIndex, 2.0) * gridSizeX * 0.5;

    // Calculate the position of the current point in the grid with the offset
    vec2 gridPosition = mod(vec2(uv.x - offsetX, uv.y), vec2(gridSizeX, gridSizeY));

    // Calculate the distance from the center of the current grid cell
    vec2 distanceFromCenter = gridPosition - vec2(gridSizeX * 0.5, gridSizeY * 0.5);
    float distance = length(distanceFromCenter);

    // Check if the distance is less than the dot radius to determine if the current point is within a dot
    bool isDot = distance < dotRadius;

    if (color.a == 0.0) {
        if (isDot) {
            gl_FragColor = vec4(%DOT_COLOR%); // Set dot color to black
        } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Transparent background
        }
    } else if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
        // Change black part to transparent
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else if (color.r == 1.0 && color.g == 1.0 && color.b == 1.0) {
        // Change white part to transparent
        gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);
    } else {
        // Keep other colors unchanged
        gl_FragColor = vec4(color.rgb, 1.0);
    }
}
`;

const dotDesign1= `
precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
uniform vec2 uResolution;
uniform vec4 uLineColor;

vec4 getGradientColor(vec2 uv) {
    vec4 color1 = vec4(0.835, 0.231, 0.231, 1.0); // hsla(0, 64%, 53%, 1)
    vec4 color2 = vec4(0.988, 0.816, 0.404, 1.0); // hsla(47, 92%, 65%, 1)
    vec4 color3 = vec4(0.49, 0.969, 0.196, 1.0); // hsla(125, 98%, 50%, 1)
    vec4 color4 = vec4(0.196, 0.784, 0.922, 1.0); // hsla(209, 100%, 47%, 1)

    vec4 topColor = mix(color1, color2, uv.x);
    vec4 bottomColor = mix(color3, color4, uv.x);
    return mix(bottomColor, topColor, uv.y);
}

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);

    vec2 imageSize = uResolution; // Use the provided resolution
    vec2 uv = vTextureCoord * imageSize;

    // Define grid size and dot radius
    float gridSizeX = 35.0; // Distance between dot centers horizontally
    float gridSizeY = 15.0; // Distance between dot centers vertically
    float dotRadius = 6.0; // Radius of each dot

    // Calculate the row and column index
    float rowIndex = floor(uv.y / gridSizeY);
    float colIndex = floor((uv.x - (mod(rowIndex, 2.0) * gridSizeX * 0.5)) / gridSizeX);

    // Apply an offset for every other row to create a staggered effect
    float offsetX = mod(rowIndex, 2.0) * gridSizeX * 0.5;

    // Calculate the position of the current point in the grid with the offset
    vec2 gridPosition = mod(vec2(uv.x - offsetX, uv.y), vec2(gridSizeX, gridSizeY));

    // Calculate the distance from the center of the current grid cell
    vec2 distanceFromCenter = gridPosition - vec2(gridSizeX * 0.5, gridSizeY * 0.5);
    float distance = length(distanceFromCenter);

    // Check if the distance is less than the dot radius to determine if the current point is within a dot
    bool isDot = distance < dotRadius;

    if (color.a == 0.0) {
        if (isDot) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Set dot color to white
        } else {
            gl_FragColor = getGradientColor(vTextureCoord); // Gradient background color
        }
    } else if (color.r == 0.0 && color.g == 0.0 && color.b == 0.0) {
        // Change black part to transparent
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else if (color.r == 1.0 && color.g == 1.0 && color.b == 1.0) {
        // Change white part to transparent
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
        // Keep other colors unchanged
        gl_FragColor = vec4(color.rgb, 1.0);
    }
}
`;

const gradientDesign = `
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


const designs = {
    'Simple': simpleDesign,
    'Stroke': strokeDesign,
    'Box': boxDesign,
    'Dot': {
        'White': dotDesign,
        'Black': dotDesign,
        'OrangeGradient': dotDesign1,
        'PinkGradient': dotDesign1,
    },
    'Gradient': gradientDesign,
    'Thumnail': simpleDesign
};

export default designs;
