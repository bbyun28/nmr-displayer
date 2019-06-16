const configuration={
    serieStyle: {
        unselected: {
            // if the spectrum is not selected
            line: {}, // SVG line properties for color, width, styl
            marker: {} // SVG line properties for size, shape (???), color, border, etc.
          },
          selected: {
            // if the spectrum is selected
            line: {}, // SVG line properties
            marker: {} // SVG line properties
          }
    },
  xAxis: {
    label: 'δ (ppm)',
    forcedMin: 0, // by default min value
    forceMax: 10, // by default max value
    flipped: true,
    primaryGrid: true,
    secondaryGrid: true,
    primaryGridColor: '#AAAAAA',
    secondaryGridColor: '#DDDDDD',
    styles: {
      line: {},
      text: {}
    }
  },
  yAxis: {
    label: 'Intensity',
    primaryGrid: true,
    secondaryGrid: true,
    primaryGridColor: '#AAAAAA',
    secondaryGridColor: '#DDDDDD'
  }
}

let chart={
  data: [
    // array of spectra. They will share the same axis
    // each series is a React component in the SVG dom
    // if a series has to be rerender a new object in the array is created
    {
        id: '',
      data: [{x:1, y:1, color:'red'}], // an array of colors for each segment of line. Use always modulo color.length to get the color
      isFid: true, // allows to determine the label of the axis
      is2D: false,
      color: 'green',
    }
  ],
  annotations: [ // different react component per annotation type and annotations
    /*
        Each data may be associated with one or many annotations
        Annotations include:
        - line
        - rectangle
        - integral (surface under the line)
        - circle / ellipse
        An annotation may have relative position (based on the X / Y units) or
        absolute position (based on 0,0 that it the top left point)
        Annotations should have a format as close as possible to the SVG properties
    */
    {
      type: 'rectangle',
      position: [
        // to be defined how to specify the position
        {
          x: 1, // units may be a number or a string with px or %
          y: 1,
          dx: '2px', // dx and dy allows to specify a shift from X / Y. The unit can change
          dy: '1px'
        },
        {
          x: 1.5,
          y: 1.5
        }
      ],
      style: {},
    },
    {
      type: 'label',
      text: 'My label',
      position: [
        // to be defined how to specify the position
        {
          x: 1, // units may be a number or a string with px or %
          y: 1,
          dx: '2px', // dx and dy allows to specify a shift from X / Y. The unit can change
          dy: '1px'
        }
      ],
      style: {},
    }
  ]
},
  events: [
    {
        type: 'key',
        modifiers: ['alt', 'shift'],
       
        callback: (event) => {}
        // be able to
      },
    {
      type: 'mouseClick',
      modifiers: ['alt', 'shift'],
      style: {
        crosshair,
        pointer,
        zoom,
        none
      },
      callback: (event, {x,y,...}) => {}
      // be able to
    },
    {
        type: 'mouseMove',
        modifiers: [],
        style: {
          crosshair,
          pointer,
          zoom,
          none
        },
        callback: (event, {x,y,...}) => {}
        // be able to
      }
  ]
};

module.exports={configuration,chart}