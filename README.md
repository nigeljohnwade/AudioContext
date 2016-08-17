# AudioContext

Wrapper for the web audio API. 
Ultimately I only really want the library of helper functions, but at the minute I need the synth application for working out how best to implement things.
Library written in ES2015 using BabelJS for transpilation.

## Usage
Currently I am using the audioContext.js file with requirejs, so in application.js I use:
```
<script src='js/require.js' data-main='js/application'></script>
```
It is my intention to learn how to make the library work with other module systems as well as a straight include with a script tag.

## Dependencies
*  RequireJS

## Development Dependencies
*  babel-cli
*  babel-preset-es2015
*  npm-watch

npm-watch is used to auto-transpile the es-2015 source into more universal javascript.
npm run watch should be executed in the root directory to run the npm script that handles transpilation.
Alternatively npm run build will run the transpilation once.

## Functions

All of the functions return object so they need to assigned a reference to be usable.

#### Example

```
window.filter1 = audioContext.createBiquadFilterNode(
    context,
    distortion,
    document.querySelector('#filter1Type').value,
    Math.pow(2, document.querySelector('#filter1frequency').value) * 55,
    document.querySelector('#filter1Q').value,
    document.querySelector('#filter1Gain').value
    );
```        
In this example the filter is being created with its values derived from the state of inputs onmm te web page in teh synth application.

#### General

init: Initialises a reference to the webaudio API

#### Primitive Nodes

The primitve nodes are used to directly create node as they are available in the API. 
The defaults are the same as the web audio defaults as far as I know, but I specified them in case that varies from browser to browser.
For all of the functions the context parameter must be defined and it should be a valid AudioContext, such as the one returned form the init function.
I believe it is possible to have more than one instance of the AudioContext but I have not had a reason to find out.
The destination parameter is not necessary but if specified it should be an existing node instance.

createOscillatorNode: function(context, destination, waveform = 'sine', frequency = 440, detune = 0)

createBiquadFilterNode: function(context, destination, type = 'lowpass', frequency = 350, q = 1, gain = 0)

createAnalyserNode: function(context, destination, fftSize = 2048, minDecibels = -100, maxDecibels = -30)

createGainNode: function(context, destination, gain = 1)

createDynamicsCompressorNode: function(context, destination, threshold = -24, knee = 30, ratio =12, reduction = 0, attack = 0.003, release = 0.25)

createWaveShaperNode: function(context, destination, curve = null, oversample = 'none')

createDelayNode: function(context, destination, delay = 0)

createStereoPannerNode: function(context, destination, pan = 0)


#### Utilities

The utilities section is for supporting functions such as the distortion curve for the wave shaper to create distortion.
There are other useful curve generators I have come accross but not yet implemented.

makeDistortionCurve: function(amount) 

#### Compound Nodes

Compound node are objects that combine a number of primitives in a particular way that has a common enough use case. 
The LFO for example really requires a gain node to allow the output to be scaled for its target. 
For tremelo effects connected to gain nodes the gain can be set to 1, but for frequency it really needs to be set a lot higher to have any audible effect.

createLfoNode: function(context, destination, waveform = 'sine', frequency = '0.1', gain = 1)
