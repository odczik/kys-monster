const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

// Create video element for webcam
const video = document.createElement('video');
video.style.height = '500px';
document.body.appendChild(video);

let resolution = 50;
let scale = 10; // Scale factor for the output image
let isProcessing = false; // Flag to prevent processing overlap
let animationId; // To store the animation frame ID
let stream = null; // To store the media stream

// Setup webcam
async function setupWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 }
            } 
        });
        video.srcObject = stream;
        video.play();
        
        // Start the processing loop once video is ready
        video.onloadeddata = () => {
            startProcessing();
        };
    } catch (error) {
        console.error('Error accessing webcam:', error);
        alert('Error accessing webcam. Please make sure you have a camera connected and have granted permission to use it.');
    }
}

function stopWebcam() {
    // Stop the animation
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Stop all video tracks
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    // Clear the video source
    video.srcObject = null;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startProcessing() {
    // Cancel any existing animation frame
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    function processFrame() {
        if (!isProcessing) {
            isProcessing = true;
            drawImage();
            isProcessing = false;
        }
        animationId = requestAnimationFrame(processFrame);
    }
    
    // Start the animation loop
    processFrame();
}

function drawImage() {
    // Get video dimensions
    const origWidth = video.videoWidth;
    const origHeight = video.videoHeight;
    
    if (origWidth === 0 || origHeight === 0) return; // Skip if video not ready
    
    // Set canvas to video size initially
    canvas.width = origWidth;
    canvas.height = origHeight;
    
    // Draw the current video frame to get its pixel data
    ctx.drawImage(video, 0, 0, origWidth, origHeight);
    const imageData = ctx.getImageData(0, 0, origWidth, origHeight);
    const data = imageData.data;
    
    // Calculate the new dimensions
    const newWidth = Math.floor(origWidth / origHeight * resolution);
    const newHeight = resolution;
    
    // Resize the canvas to the final size
    canvas.width = newWidth * scale;
    canvas.height = newHeight * scale;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Resize and convert to grayscale
    const outputArray = new Uint8ClampedArray(newWidth * newHeight);
    
    // Calculate how many original pixels correspond to one output pixel
    const xRatio = origWidth / newWidth;
    const yRatio = origHeight / newHeight;
    
    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            // Calculate the corresponding region in the original image
            const srcX = Math.floor(x * xRatio);
            const srcY = Math.floor(y * yRatio);
            const srcWidth = Math.ceil(xRatio);
            const srcHeight = Math.ceil(yRatio);
            
            // Average the pixels in this region
            let total = 0;
            let pixelCount = 0;
            
            for (let j = 0; j < srcHeight; j++) {
                for (let k = 0; k < srcWidth; k++) {
                    const origX = srcX + k;
                    const origY = srcY + j;
                    
                    // Skip if out of bounds
                    if (origX >= origWidth || origY >= origHeight) continue;
                    
                    const pixelIndex = (origY * origWidth + origX) * 4;
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];
                    
                    total += (r + g + b) / 3; // Grayscale conversion
                    pixelCount++;
                }
            }
            
            // Store the average in our output array
            const average = Math.floor(total / pixelCount);
            outputArray[y * newWidth + x] = average;
        }
    }
    
    for(let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            let offset = 0;
            if(y % 2 === 0) {
                offset = scale / 2;
            }
            const pixelIndex = outputArray[y * newWidth + x];

            // Calculate radius based on the pixel value
            let radius;
            const colorScaling = document.getElementById("color").value;
            if(document.getElementById("invert").checked) {
                radius = pixelIndex / 255 * scale * colorScaling;
            } else {
                radius = 255 /pixelIndex * scale * (colorScaling / 10);
            }

            ctx.fillStyle = `black`;
            ctx.beginPath();
            ctx.arc(x * scale + scale / 2 + offset, y * scale + scale / 2, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();            
        }
    }
}

// Add event listeners for the buttons
startBtn.addEventListener('click', setupWebcam);
stopBtn.addEventListener('click', stopWebcam);

document.getElementById("res").addEventListener("input", (e) => {
    resolution = e.target.value;
    scale = 500 / resolution;
});