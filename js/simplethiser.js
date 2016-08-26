requirejs(['audioContext'], function(audioContext){
    window.context = audioContext.init();
    window.masterVolume = audioContext.createGainNode(context, context.destination, 1);
    window.convolver = audioContext.createConvolverNode(context, masterVolume, null);
    audioContext.getAudioByXhr('../audio/BathHouse.wav', window.convolver);
    window.panner = audioContext.createStereoPannerNode(context, convolver, 0);
    window.analyser = audioContext.createAnalyserNode(context, panner);
    window.delay = audioContext.createDelayNode(context, analyser, 0.5);
    window.delayFeedback = audioContext.createGainNode(context, delay, 0.8);
    delay.connect(delayFeedback);
    window.compressor = audioContext.createDynamicsCompressorNode(
        context,
        delay,
        document.querySelector('#dynamicsThreshold').value,
        document.querySelector('#dynamicsKnee').value,
        document.querySelector('#dynamicsRatio').value,
        document.querySelector('#dynamicsReduction').value,
        document.querySelector('#dynamicsAttack').value,
        document.querySelector('#dynamicsRelease').value
        );
    compressor.connect(analyser);
    window.gainStage = audioContext.createGainNode(context, compressor, 0);
    window.distortion = audioContext.createWaveShaperNode(context, gainStage, audioContext.makeDistortionCurve(400), 'none' );
    distortion.setCurve = function(amount){
        distortion.curve = audioContext.makeDistortionCurve(amount);
    }
    window.filter1 = audioContext.createBiquadFilterNode(
        context,
        distortion,
        document.querySelector('#filter1Type').value,
        Math.pow(2, document.querySelector('#filter1frequency').value) * 55,
        document.querySelector('#filter1Q').value,
        document.querySelector('#filter1Gain').value
        );
    window.osc1 = audioContext.createOscillatorNode(
        context,
        filter1,
        document.querySelector('#oscillator1Type').value,
        Math.pow(2, document.querySelector('#oscillator1Octave').value) * 55,
        0
        );
    window.osc2 = audioContext.createOscillatorNode(
        context,
        filter1,
        document.querySelector('#oscillator2Type').value,
        (Math.pow(2, document.querySelector('#oscillator1Octave').value) * 55) * Math.pow(2, document.querySelector('#oscillator2Octave').value),
        document.querySelector('#oscillator2Detune').value
        );
    osc1.start(0);
    osc2.start(0);
    window.lfo1 = audioContext.createLfoNode(context, filter1.frequency, 'sine', 0.1, 100);
    window.envelope = function(context, audioParam, startValue, peakValue, attackTime, decayTime, sustainValue, holdTime, releaseTime){
        audioContext.linearEnvelopeADSR(context, audioParam, startValue, peakValue, attackTime, decayTime, sustainValue, holdTime, releaseTime);
    };
    window.bufferLength = analyser.frequencyBinCount;
    window.dataArray = new Uint8Array(bufferLength);
    var canvas = document.querySelector("#oscilliscope canvas");
    window.canvasCtx = canvas.getContext("2d"); 
    window.drawWaveform = function(){
        canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
        canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = 'rgb(0, 255, 0)';
        canvasCtx.beginPath();
        var sliceWidth = canvasCtx.canvas.width * 1.0 / bufferLength;
        var x = 0;
        for(var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * canvasCtx.canvas.height/2;
            if(i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
    }
    window.animateWaveform = function(){
        drawWaveform();
        requestAnimationFrame(animateWaveform);
    }
    animateWaveform();
});