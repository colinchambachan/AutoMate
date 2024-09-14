navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log("Microphone access granted!");

    let mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, 500);

  }).catch(err => {
    console.error("Error accessing microphone:", err);
  });