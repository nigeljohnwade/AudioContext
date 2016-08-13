requirejs(['audioContext'], function(audioContext){
    window.context = audioContext.init();
    console.log(context);
    window.filter1 = audioContext.createBiquadFilterNode('lowpass', 2000, 1, null, context, context.destination);
    window.playOscillators = function(time){
        window.osc1 = audioContext.createOscillatorNode('sine', 220, 0, context, filter1);
        window.osc2 = audioContext.createOscillatorNode('sawtooth', 110, 0, context, filter1);
        osc1.start(time);
        osc2.start(time);
    }
    window.analyser = audioContext.createAnalyserNode(filter1, context, context.destination);
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
        canvasCtx.lineWidth = 5;
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
});