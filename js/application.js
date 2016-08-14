requirejs(['audioContext'], function(audioContext){
    window.context = audioContext.init();
    window.masterVolume = audioContext.createGainNode(1, context, context.destination);
    window.analyser = audioContext.createAnalyserNode(context, masterVolume);
    window.gainStage = audioContext.createGainNode(1, context, analyser);
    window.distortion = audioContext.createWaveShaperNode(400, '4x', context, gainStage);
    window.filter1 = audioContext.createBiquadFilterNode(
        document.querySelector('#filter1Type').value,
        Math.pow(2, document.querySelector('#filter1frequency').value) * 55,
        document.querySelector('#filter1Q').value,
        document.querySelector('#filter1Gain').value,
        context,
        gainStage
        );
    window.playOscillators = function(time){
        window.osc1 = audioContext.createOscillatorNode(
            document.querySelector('#oscillator1Type').value,
            Math.pow(2, document.querySelector('#oscillator1Octave').value) * 55,
            0,
            context,
            filter1
            );
        window.osc2 = audioContext.createOscillatorNode(
            document.querySelector('#oscillator2Type').value,
            (Math.pow(2, document.querySelector('#oscillator1Octave').value) * 55) * Math.pow(2, document.querySelector('#oscillator2Octave').value),
            document.querySelector('#oscillator2Detune').value,
            context,
            filter1
            );
        osc1.start(time);
        osc2.start(time);
    };
    window.lfo1 = audioContext.createLfoNode('sine', 0.1, 100, context, filter1.frequency);
    window.bufferLength = analyser.frequencyBinCount;
    window.dataArray = new Uint8Array(bufferLength);
    var canvas = document.querySelector("#oscilliscope canvas");
    window.canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    window.drawWaveform = function(){
        //drawVisual = requestAnimationFrame(draw);
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
});