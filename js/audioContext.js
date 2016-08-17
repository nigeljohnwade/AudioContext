'use strict';

define({
    init: function init() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    },
    //Primitive Nodes
    createOscillatorNode: function createOscillatorNode(context, destination) {
        var waveform = arguments.length <= 2 || arguments[2] === undefined ? 'sine' : arguments[2];
        var frequency = arguments.length <= 3 || arguments[3] === undefined ? 440 : arguments[3];
        var detune = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

        if (!context) {
            throw 'No context defined';
        }
        var _osc = context.createOscillator();
        _osc.type = waveform;
        _osc.frequency.value = frequency;
        _osc.detune.value = detune;
        if (destination) {
            _osc.connect(destination);
        }
        return _osc;
    },
    createBiquadFilterNode: function createBiquadFilterNode(context, destination) {
        var type = arguments.length <= 2 || arguments[2] === undefined ? 'lowpass' : arguments[2];
        var frequency = arguments.length <= 3 || arguments[3] === undefined ? 350 : arguments[3];
        var q = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];
        var gain = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

        if (!context) {
            throw 'No context defined';
        }
        var _filter = context.createBiquadFilter();
        _filter.type = type;
        _filter.frequency.value = frequency;
        _filter.Q.value = q;
        _filter.gain.value = gain;
        if (destination) {
            _filter.connect(destination);
        }
        return _filter;
    },
    createAnalyserNode: function createAnalyserNode(context, destination) {
        var fftSize = arguments.length <= 2 || arguments[2] === undefined ? 2048 : arguments[2];
        var minDecibels = arguments.length <= 3 || arguments[3] === undefined ? -100 : arguments[3];
        var maxDecibels = arguments.length <= 4 || arguments[4] === undefined ? -30 : arguments[4];

        if (!context) {
            throw 'No context defined';
        }
        var _analyser = context.createAnalyser();
        _analyser.fftSize = fftSize;
        _analyser.minDecibels = minDecibels;
        _analyser.maxDecibels = maxDecibels;
        if (destination) {
            _analyser.connect(destination);
        }
        return _analyser;
    },
    createGainNode: function createGainNode(context, destination) {
        var gain = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        if (!context) {
            throw 'No context defined';
        }
        var _gain = context.createGain();
        _gain.gain.value = gain;
        if (destination) {
            _gain.connect(destination);
        }
        return _gain;
    },
    createDynamicsCompressorNode: function createDynamicsCompressorNode(context, destination) {
        var threshold = arguments.length <= 2 || arguments[2] === undefined ? -24 : arguments[2];
        var knee = arguments.length <= 3 || arguments[3] === undefined ? 30 : arguments[3];
        var ratio = arguments.length <= 4 || arguments[4] === undefined ? 12 : arguments[4];
        var reduction = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
        var attack = arguments.length <= 6 || arguments[6] === undefined ? 0.003 : arguments[6];
        var release = arguments.length <= 7 || arguments[7] === undefined ? 0.25 : arguments[7];

        if (!context) {
            throw 'No context defined';
        }
        var _comp = context.createDynamicsCompressor();
        _comp.threshold.value = threshold;
        _comp.knee.value = knee;
        _comp.ratio.value = ratio;
        _comp.reduction.value = reduction;
        _comp.attack.value = attack;
        _comp.release.value = release;
        if (destination) {
            _comp.connect(destination);
        }
        return _comp;
    },
    createWaveShaperNode: function createWaveShaperNode(context, destination) {
        var curve = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var oversample = arguments.length <= 3 || arguments[3] === undefined ? 'none' : arguments[3];

        if (!context) {
            throw 'No context defined';
        }
        var _waveShaper = context.createWaveShaper();
        _waveShaper.curve = curve;
        _waveShaper.oversample = oversample;
        if (destination) {
            _waveShaper.connect(destination);
        }
        return _waveShaper;
    },
    createDelayNode: function createDelayNode(context, destination) {
        var delay = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        if (!context) {
            throw 'No context defined';
        }
        var _delay = context.createDelay();
        _delay.delayTime.value = delay;
        if (destination) {
            _delay.connect(destination);
        }
        return _delay;
    },
    createStereoPannerNode: function createStereoPannerNode(context, destination) {
        var pan = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var _pan = context.createStereoPanner();
        _pan.pan.value = pan;
        if (destination) {
            _pan.connect(destination);
        }
        return _pan;
    },
    //Utilities
    makeDistortionCurve: function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x = void 0;
        for (; i < n_samples; ++i) {
            x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    },
    //Compound Nodes
    createLfoNode: function createLfoNode(context, destination) {
        var waveform = arguments.length <= 2 || arguments[2] === undefined ? 'sine' : arguments[2];
        var frequency = arguments.length <= 3 || arguments[3] === undefined ? '0.1' : arguments[3];
        var gain = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];

        var _lfo = {};
        _lfo.gain = this.createGainNode(context, destination, gain);
        _lfo.oscillator = this.createOscillatorNode(context, _lfo.gain, waveform, frequency, 0);
        _lfo.oscillator.start(0);
        return _lfo;
    }
});