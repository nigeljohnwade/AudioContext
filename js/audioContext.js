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
    createAnalyserNode: function(source, context, destination){
        var _analyser = context.createAnalyser();
        source.connect(_analyser);
        _analyser.connect(destination);
        return _analyser;
    },
    createGainNode: function(gain, source, context, destination){
        var _gain = context.createGain();
        _gain.gain.value = gain;
        return _gain;
    }
});