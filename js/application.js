requirejs(['audioContext'], function(audioContext){
    window.context = audioContext.init();
    console.log(context);
    window.filter1 = audioContext.createBiquadFilterNode('lowpass', 2000, 1, null, context.destination);
    window.playOscillators = function(time){
        window.osc1 = audioContext.createOscillatorNode('sine', 220, 0, context, filter1);
        window.osc2 = audioContext.createOscillatorNode('sawtooth', 110, 0, context, filter1);
        osc1.start(time);
        osc2.start(time);
    }
});