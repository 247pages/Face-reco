// Load the face detection model
async function loadModel() {
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
  return model;
}

// Start the webcam and perform face detection
async function run() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;

  const model = await loadModel();

  video.addEventListener('loadeddata', async () => {
    video.play();

    async function detectFace() {
      const predictions = await model.estimateFaces(video);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (predictions.length > 0) {
        predictions.forEach(prediction => {
          const keypoints = prediction.scaledMesh;
          for (let i = 0; i < keypoints.length; i++) {
            const [x, y] = keypoints[i];
            ctx.beginPath();
            ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
          }
        });
      }
      requestAnimationFrame(detectFace);
    }

    detectFace();
  });
}

run();
