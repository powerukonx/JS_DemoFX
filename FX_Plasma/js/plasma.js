const canvas      = document.getElementsByTagName('canvas')[0];
const context     = canvas.getContext('2d');
const output      = context.createImageData(canvas.width, canvas.height);
const w           = output.width;
const h           = output.height;

// Globals variables declaration
var vTimer      = false;
var vColorR     = [];
var vColorG     = [];
var vColorB     = [];
var vSinus      = [];
var vAngle1     = 0;
var vAngle2     = 0;  
var outputData  = output.data;

// Call at startup
function fSetup() {
    
    // Make colors look up tables
    for (var i = 0; i < 256; i++) {
        
        var vFreq   = Math.PI*i/256;
        vColorR[i]  = Math.floor(128 + 127 * Math.sin(3 * vFreq));
        vColorG[i]  = Math.floor(128 + 127 * Math.sin(2 * vFreq));
        vColorB[i]  = Math.floor(128 + 127 * Math.sin(1 * vFreq)); 
    }
    
    // Make sinus look up table
    for (var i = 0; i < 256; i++) {
        
        vSinus[i] = Math.floor(128 + 127 * Math.sin(2 * Math.PI * i / 256));
    }
   
    fPlay();
}

// Main effect loop
function fLoop() {
  
    for (var y = 0; y < h; y++) {
    
        for (var x = 0; x < w; x++) {
          
            var val =  (vSinus[(y*2 + vAngle1) & 255]
                     +  vSinus[(x*2 + vAngle2) & 255]
                     +  vSinus[(vAngle2 + 128) & 255]
                     +  vSinus[( (x>>1) + (y>>1) + vAngle1) & 255]) & 255;
          
            outputData[(y * w + x)*4 + 0] = vColorR[val];
            outputData[(y * w + x)*4 + 1] = vColorG[val];
            outputData[(y * w + x)*4 + 2] = vColorB[val];
            outputData[(y * w + x)*4 + 3] = 255;
        }
    }

    vAngle1 = (vAngle1 - 3) & 255;
    vAngle2 = (vAngle2 + 2) & 255;
  
    context.putImageData(output, 0, 0);
}

// When play button clicked
function fPlay() {
  
  if (vTimer === false) {
  
      vTimer = setInterval(fLoop, 10);
      
      document.getElementById("btPlayPause").textContent  = "PAUSE FX";
      document.getElementById("btPlayPause").onclick      = fPause;
  }
}

// When pause button clicked
function fPause() {
  
  if (vTimer != false) {
  
      clearInterval(vTimer);
      vTimer = false;
  
      document.getElementById("btPlayPause").textContent  = "PLAY FX";
      document.getElementById("btPlayPause").onclick      = fPlay;
  }
}


