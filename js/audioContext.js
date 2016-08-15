define({
    init: function(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    },
    createOscillatorNode: function(waveform, frequency, detune, context, destination){
        const _osc = context.createOscillator()
        _osc.type = waveform;
        _osc.frequency.value = frequency;
        if(destination){
            _osc.connect(destination);
        }
        if (detune) {
            _osc.detune.value = detune;
        }
        return _osc;
    },
    createBiquadFilterNode: function(type, frequency, q, gain, context, destination){
        const _filter = context.createBiquadFilter();
        _filter.type = type;
        _filter.frequency.value = frequency;
        if(q){
            _filter.Q.value = q;
        }
        if(gain){
            _filter.gain.value = gain;
        }
        if (destination) {
            _filter.connect(destination)
        }
        return _filter;
    },
    createAnalyserNode: function(context, destination){
        const _analyser = context.createAnalyser();
        _analyser.connect(destination);
        return _analyser;
    },
    createGainNode: function(gain, context, destination){
        const _gain = context.createGain();
        _gain.gain.value = gain;
        _gain.connect(destination);
        return _gain;
    },
    createDynamicsCompressorNode: function(threshold, knee, ratio, reduction, attack, release, context, destination){
        const _comp = context.createDynamicsCompressor();
        _comp.threshold.value = threshold;
        _comp.knee.value = knee;
        _comp.ratio.value = ratio;
        _comp.reduction.value = reduction;
        _comp.attack.value = attack;
        _comp.release.value = release;
        _comp.connect(destination);
        return _comp;
    },
    createWaveShaperNode: function(amount, oversample, context, destination){
        const _waveShaper = context.createWaveShaper();
        _waveShaper.curve = this.makeDistortionCurve(amount);
        _waveShaper.oversample = oversample;
        _waveShaper.connect(destination);
        return _waveShaper;
    },
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
    createLfoNode: function(waveform, frequency, gain, context, destination){
        const _lfo ={};
        _lfo.gain = this.createGainNode(gain, context, destination);
        _lfo.oscillator = this.createOscillatorNode(waveform, frequency, 0, context, _lfo.gain);
        _lfo.oscillator.start(0);
        return _lfo;
    },
});