const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

// Create video element for webcam
const video = document.createElement('video');
video.style.height = '500px';
document.body.appendChild(video);

let isProcessing = false; // Flag to prevent processing overlap
let animationId; // To store the animation frame ID
let stream = null; // To store the media stream

const threshold = document.getElementById('thres');

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

let lastFrame;
let motionPixels = new Map(); // Store motion pixels with their timestamps

function drawImage() {
    const thres = parseInt(threshold.value, 10) || 10;
    const fadeTime = parseInt(document.getElementById('fade').value, 10) || 1000;
    const minMotionArea = parseInt(document.getElementById('amount').value, 10) || 4;
    const maxMotionPixels = 10000;
    const currentTime = Date.now();

    // Get video dimensions
    const origWidth = video.videoWidth;
    const origHeight = video.videoHeight;
    
    if (origWidth === 0 || origHeight === 0) return;
    
    // Set canvas to video size initially
    canvas.width = origWidth;
    canvas.height = origHeight;
    
    // Draw the current video frame to get its pixel data
    ctx.drawImage(video, 0, 0, origWidth, origHeight);
    const imageData = ctx.getImageData(0, 0, origWidth, origHeight);
    const data = imageData.data;

    if (!lastFrame) {
        lastFrame = new Uint8ClampedArray(data);
        return;
    }

    // Optimized single-pass motion detection with noise filtering
    const tempMotionPixels = [];
    
    for (let y = 1; y < origHeight - 1; y++) {
        for (let x = 1; x < origWidth - 1; x++) {
            const index = (y * origWidth + x) * 4;

            // Calculate grayscale difference more efficiently
            const currentGray = (data[index] + data[index + 1] + data[index + 2]) / 3;
            const lastGray = (lastFrame[index] + lastFrame[index + 1] + lastFrame[index + 2]) / 3;
            const diff = Math.abs(currentGray - lastGray);

            if (diff > thres) {
                // Check neighbors for noise reduction in the same loop
                let neighbors = 0;
                const stride = origWidth * 4;
                
                // Optimized neighbor checking (unrolled loop)
                if (Math.abs(((data[index - stride] + data[index - stride + 1] + data[index - stride + 2]) / 3) - 
                    ((lastFrame[index - stride] + lastFrame[index - stride + 1] + lastFrame[index - stride + 2]) / 3)) > thres) neighbors++;
                if (Math.abs(((data[index + stride] + data[index + stride + 1] + data[index + stride + 2]) / 3) - 
                    ((lastFrame[index + stride] + lastFrame[index + stride + 1] + lastFrame[index + stride + 2]) / 3)) > thres) neighbors++;
                if (Math.abs(((data[index - 4] + data[index - 3] + data[index - 2]) / 3) - 
                    ((lastFrame[index - 4] + lastFrame[index - 3] + lastFrame[index - 2]) / 3)) > thres) neighbors++;
                if (Math.abs(((data[index + 4] + data[index + 5] + data[index + 6]) / 3) - 
                    ((lastFrame[index + 4] + lastFrame[index + 5] + lastFrame[index + 6]) / 3)) > thres) neighbors++;

                if (neighbors >= minMotionArea) { // Reduced requirement for faster processing
                    tempMotionPixels.push({
                        x: x,
                        y: y,
                        timestamp: currentTime,
                        color: { r: data[index], g: data[index + 1], b: data[index + 2] }
                    });
                }
            }
        }
    }

    // Batch add new motion pixels
    tempMotionPixels.forEach(pixel => {
        const pixelKey = `${pixel.x},${pixel.y}`;
        motionPixels.set(pixelKey, pixel);
    });

    // Optimized fading and cleanup in single pass
    const expiredKeys = [];
    motionPixels.forEach((pixel, key) => {
        const age = currentTime - pixel.timestamp;
        
        if (age < fadeTime) {
            const opacity = 1 - (age / fadeTime);
            ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            ctx.fillRect(pixel.x, pixel.y, 2, 2); // Use fillRect instead of strokeRect for better performance
        } else {
            expiredKeys.push(key);
        }
    });

    // Batch remove expired pixels
    expiredKeys.forEach(key => motionPixels.delete(key));

    // Limit motion pixels more efficiently
    if (motionPixels.size > maxMotionPixels) {
        const excess = motionPixels.size - maxMotionPixels;
        const keys = Array.from(motionPixels.keys());
        for (let i = 0; i < excess; i++) {
            motionPixels.delete(keys[i]);
        }
    }

    // Update last frame
    lastFrame.set(data);
}

// Add event listeners for the buttons
startBtn.addEventListener('click', setupWebcam);
stopBtn.addEventListener('click', stopWebcam);