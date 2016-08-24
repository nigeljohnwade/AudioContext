requirejs(['audioContext'], function(audioContext){
    window.context = audioContext.init();
    window.masterVolume = audioContext.createGainNode(context, context.destination, 1);
    window.convolver = audioContext.createConvolverNode(context, masterVolume, null);
    audioContext.getAudioByXhr('../audio/BathHouse.wav', window.convolver);
    window.panner = audioContext.createStereoPannerNode(context, convolver, 0);
    window.analyser = audioContext.createAnalyserNode(context, panner);
    window.echoUnit = audioContext.createEchoUnit(context, analyser);
    window.input = audioContext.createUserMediaNode(context, echoUnit.input);
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