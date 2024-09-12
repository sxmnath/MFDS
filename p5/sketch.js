

// The video
let video;
// For displaying the label
let label = "waiting...";
// The classifier
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/yDHcyMTFm/';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIPBPy-qpFF6VzXGsKCfkpbtrr27OV8-A",
            authDomain: "m-faultdet.firebaseapp.com",
            databaseURL: "https://m-faultdet-default-rtdb.firebaseio.com",
            projectId: "m-faultdet",
            storageBucket: "m-faultdet.appspot.com",
            messagingSenderId: "5321188890",
            appId: "1:5321188890:web:8fd38f5e2a0bdd849c93a3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const statusRef = database.ref('status');

// STEP 1: Load the model!
function preload() {
  classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
  createCanvas(800, 600);
  // Create the video
  video = createCapture(VIDEO);
  video.hide();
  // STEP 2: Start classifying
  classifyVideo();
}

// STEP 2 classify the video!
function classifyVideo() {
  classifier.classify(video, gotResults);
}

function draw() {
  background(0);

  // Draw the video
  image(video, 0, 0);

  // STEP 4: Draw the label
  textSize(50);
  textAlign(CENTER, CENTER);
  fill(255);
  text(label, width / 2, height - 25);
}

// STEP 3: Get the classification!
function gotResults(error, results) {
  // Something went wrong!
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again!
  label = results[0].label;
  
  // Check for FAULT
  if (label === "FAULT") {
    // Update status in Firebase
    statusRef.set("FAULT");
    // Send an email (see backend setup below)
    sendFaultEmail();
  } else {
    statusRef.set("NORMAL");
  }

  classifyVideo();
}

// Function to send an email when FAULT is detected
function sendFaultEmail() {
  fetch('https://mfds1-l5rig3e2l-somnaths-projects-8bc9a7ab.vercel.app/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: 'FAULT Detected',
      body: 'A FAULT has been detected in the system.',
      to: ['somnathchak315@gmail.com'] // Add your email recipients here
    }),
  }).then(response => {
    if (!response.ok) {
      console.error('Failed to send email');
    }
  }).catch(error => {
    console.error('Error:', error);
  });
}
