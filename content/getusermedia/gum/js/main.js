/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

// Put variables in global scope to make them available to the browser console.

const video = document.querySelector('video');
const canvas = window.canvas = document.querySelector('canvas');
canvas.width = 340;
canvas.height = 500;
const constraints = window.constraints = {
    audio: false,
    video: { facingMode: { exact: "environment" } }
};

const button = document.querySelector("#Capture");
// button.onclick= function(){
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth,video.videoHeight);
//     console.log("capture");
// }
function capture(){setInterval(function(){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth,video.videoHeight);
    console.log("capture");
},200)};

function handleSuccess(stream) {
  const videoTracks = stream.getVideoTracks();
  console.log("stream:",stream);
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
  capture();

}

/*function captureFrame(){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log("capture");
}*/

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    let v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
      captureFrame();
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}
navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
//document.querySelector('#capture').addEventListener('click', e => init(e));