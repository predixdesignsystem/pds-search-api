# px-simple-chart-common-behavior

## Overview

`Px-simple-chart-common-behavior` is a Polymer behavior that provides the basic operations for `px-simple-bar-chart`,
`px-simple-line-chart`, and `px-simple-horizontal-bar-chart`.
For example several functions are made available in order to define the
width and height of the SVG chart drawn using the D3.js graphics library.
The adds two attributes to an element: `width` and `height` attributes which
may be defined as: Number, Number as String, or "auto". Numbers will be
coerced into String and auto will set the element up to be responsive.

## Dependencies
The `px-simple-chart-common-behavior` module depends on two other libraries:

- D3.js
- window.px library

## How to use it

This behavior is not stand-alone. It must be used as a Polymer Behavior attached
to another component. In order to understand Polymer Behaviors you can read
about them on the
[Polymer Behaviors Documentation page](https://www.polymer-project.org/1.0/docs/devguide/behaviors.html)
or even watch a
[YouTube video by Rob Dodson](https://www.youtube.com/watch?v=YrlmieL3Z0k)
about them.

#### Step One: Install via Bower

```
bower install
```

#### Step Two: Import the component in the head of your component's HTML file

```html
<link rel="import" href="../px-simple-chart-common-behavior/px-simple-chart-common-behavior.html" />
```

#### Step Three: Add the behavior declaration to your Polymer element declaration

```javascript
Polymer({
    is: 'px-simple-chart',
    behaviors: [pxSimpleChartCommonBehavior],
    ...    
```

#### Step Four: Use the behaviors in your component!

---

## What is included with this behavior?

##### Public Properties

The `px-simple-chart-common-behavior` defines the following public properties:

`width` - sets the width of the component in pixels.
`height` - sets the height of the component in pixels.

##### Private Properties

The `px-simple-chart-common-behavior` defines the following private properties:

`defaultWidth` - sets the default width of the component in pixels.
`defaultHeight` - sets the default height of the component in pixels.
`minimumWidth` - sets the minimum width of the component in pixels.
`minimumHeight` - sets the minimum height of the component in pixels.

These private properties may be overridden in your component's code.

##### Internal Private Methods

`attached` - Polymer fires this event automatically, we use it to define
this.svg and initiate the component

`_drawChart` - removes previous chart, draws new chart. Debounced.

`_removeChart` - removes previous chart contents. Debounced.

`_removeChartDebounced` - resizes the SVG element and clears any internal contents. This is necessary between redrawing the chart. Depends on this.svg being a D3 selection of the chart's SVG element as defined in `attached`

`_addStyleScope` - adds the style-scope class of the component to all SVG child nodes. This is necessary because Polymer, while applying the class to child HTML elements, does not apply the class to child SVG elements.

`_clearSVG` - selects the SVG of the chart, shrinks it to 1px by 1px and empties it of child elements. This is necessary to do before drawing or redrawing the chart.

`_getSeriesTotal` - returns the sum of the values of a series

`_getLongestSeries` - returns the longest series based on the array of series passed

`_calculateTextSize` - returns the size of a temporary SVG text element and its position relative to the viewport. Useful to calculate the dimensions of an SVG text element before you actually attach it to your SVG chart.

`_calculateTextHeight` - returns height of SVG text element

`_calculateTextWidth` - returns width of SVG text element

`_reconcileValue` - reconcile the incoming value on an element's attribute. This is necessary because some values may come in as one type but need to be interpreted as another type.

`_ensureMinimum` - ensures that a Number is equal to or greater than a min

`_reconcileDimensionValue` - reconciles the value assigned to height or width

`_getAutoValue` -  returns the 'automatic' value for height or width based on parent node dimensions

`_getElementPadding` - returns the padding of an element's computed style

`_setDimensions` - sets the dimensions of the component's `this.widthValue` and `this.heightValue`
