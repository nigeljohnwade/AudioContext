define({
    init: function(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return new AudioContext();
    },
    createOscillatorNode: function(waveform, frequency, context, destination){
        var _osc = context.createOscillator()
        _osc.type = waveform;
        _osc.frequency.value = frequency;
        if(destination){
            _osc.connect(destination);
        }
        return _osc;
    },
    createBiquadFilterNode: function(type, frequency, q, gain, destination){
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
    }
});