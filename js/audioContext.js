define({
    init: function(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    },
    createOscillatorNode: function(waveform, frequency, detune, context, destination){
        var _osc = context.createOscillator()
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
        var _filter = context.createBiquadFilter();
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
        var _analyser = context.createAnalyser();
        _analyser.connect(destination);
        return _analyser;
    },
    createGainNode: function(gain, context, destination){
        var _gain = context.createGain();
        _gain.gain.value = gain;
        _gain.connect(destination);
        return _gain;
    },
    createWaveShaperNode: function(amount, oversample, context, destination){
        var _waveShaper = context.createWaveShaper();
        //_waveShaper.curve = this.makeDistortionCurve(amount);
        //_waveShaper.oversample = oversample;
        _waveShaper.connect.destination;
        return _waveShaper;
    },
    makeDistortionCurve: function(amount) {
        var k = typeof amount === 'number' ? amount : 50,
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
    }
});