requirejs(['audioContext'], function(audioContext){
    window.context = audioContext.init();
    console.log(context);
    window.filter1 = audioContext.createBiquadFilterNode('bandpass', 2000, 1, null, context.destination);
    window.osc1 = audioContext.createOscillatorNode('sawtooth', 220, context, filter1);
    osc1.start(0);
    window.osc2 = audioContext.createOscillatorNode('square', 110, context, filter1);
    osc2.start(0);
});