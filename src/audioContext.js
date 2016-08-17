define({
    init: function(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    },
    //Primitive Nodes
    createOscillatorNode: function(context, destination, waveform = 'sine', frequency = 440, detune = 0){
        if (!context) {
            throw 'No context defined';
        }
        const _osc = context.createOscillator()
        _osc.type = waveform;
        _osc.frequency.value = frequency;
        _osc.detune.value = detune;
        if(destination){
            _osc.connect(destination);
        }
        return _osc;
    },
    createBiquadFilterNode: function(context, destination, type = 'lowpass', frequency = 350, q = 1, gain = 0){
        if (!context) {
            throw 'No context defined';
        }
        const _filter = context.createBiquadFilter();
        _filter.type = type;
        _filter.frequency.value = frequency;
        _filter.Q.value = q;
        _filter.gain.value = gain;
        if (destination) {
            _filter.connect(destination)
        }
        return _filter;
    },
    createAnalyserNode: function(context, destination, fftSize = 2048, minDecibels = -100, maxDecibels = -30){
        if (!context) {
            throw 'No context defined';
        }
        const _analyser = context.createAnalyser();
        _analyser.fftSize = fftSize;
        _analyser.minDecibels = minDecibels;
        _analyser.maxDecibels = maxDecibels;
        if (destination) {
            _analyser.connect(destination);
        }
        return _analyser;
    },
    createGainNode: function(context, destination, gain = 1){
        if (!context) {
            throw 'No context defined';
        }
        const _gain = context.createGain();
        _gain.gain.value = gain;
        if (destination) {
            _gain.connect(destination);
        }
        return _gain;
    },
    createDynamicsCompressorNode: function(context, destination, threshold = -24, knee = 30, ratio =12, reduction = 0, attack = 0.003, release = 0.25){
        if (!context) {
            throw 'No context defined';
        }
        const _comp = context.createDynamicsCompressor();
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
    createWaveShaperNode: function(context, destination, amount, oversample){
        if (!context) {
            throw 'No context defined';
        }        
        const _waveShaper = context.createWaveShaper();
        _waveShaper.curve = this.makeDistortionCurve(amount);
        _waveShaper.oversample = oversample;
        if (destination) {
            _waveShaper.connect(destination);
        }
        return _waveShaper;
    },
    createDelayNode: function(context, destination, delay){
        if (!context) {
            throw 'No context defined';
        }           
        const _delay = context.createDelay();
        _delay.delayTime.value = delay;
        if (destination) {
            _delay.connect(destination);
        }
        return _delay;
    },
    //Utilities
    makeDistortionCurve: function(amount) {
        let k = typeof amount === 'number' ? amount : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for ( ; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
    },
    //Compound Nodes
    createLfoNode: function(context, destination, waveform = 'sine', frequency = '0.1', gain = 1){
        const _lfo ={};
        _lfo.gain = this.createGainNode(context, destination, gain);
        _lfo.oscillator = this.createOscillatorNode(context, _lfo.gain, waveform, frequency, 0);
        _lfo.oscillator.start(0);
        return _lfo;
    },
});