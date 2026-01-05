import React, { useRef, useImperativeHandle, forwardRef } from "react";
import Webcam from "react-webcam";

const CameraComponent = forwardRef(({ onCapture }, ref) => {
  const webcamRef = useRef(null);

  // Ekspos fungsi capture ke komponen induk (CameraAttendance)
  useImperativeHandle(ref, () => ({
    capture: () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        onCapture(imageSrc);
      }
    },
  }));

  const videoConstraints = {
    width: 720,
    height: 960,
    facingMode: "user",
  };

  return (
    <div className="w-full h-full">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="w-full h-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />
    </div>
  );
});

export default CameraComponent;
