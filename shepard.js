(function() {
  //Creation and initialization of relevant web audio APIs
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext(); 
  var gainNode = context.createGain();
  gainNode.gain.value = 1;
  gainNode.connect(context.destination);
  var baseFrequency = 1000;
  var oscillators = initializeOscillators();
  window.setInterval(playSound, 5);

  function initializeOscillators() {
    var oscillators = [];
    for(var i = 0; i < (baseFrequency / 100); i++) {
      var oscillator = context.createOscillator();
      var oscillatorGain = context.createGain();
      oscillator.frequency.value = (i + 1) * 100;
      oscillator.type = "sine";
      oscillator.start();
      oscillator.connect(oscillatorGain);
      oscillatorGain.connect(gainNode);
      oscillators[i] = {"oscillator": oscillator, "gain": oscillatorGain};
    };
      return oscillators;
    }

    function playSound() {
      oscillators.forEach(function(elem){
      if(elem.oscillator.frequency.value > 50){
        elem.oscillator.frequency.value -= 0.05;
      }else{
        elem.oscillator.frequency.value = baseFrequency;
      }
      elem.gain.gain.value = getVolume(elem.oscillator.frequency.value) * 100;
    });
  }

  function getVolume(frequency) {
    var sigma = baseFrequency / 20;
    var mean = baseFrequency / 2;
    return (1/(sigma * Math.sqrt(2 * Math.PI))) * Math.pow(Math.E, -(Math.pow(frequency - mean, 2)/(2*Math.pow(sigma, 2)))); //Bell curve
  }
}).call(this);