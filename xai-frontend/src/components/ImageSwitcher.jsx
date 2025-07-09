import React, { useState } from 'react';

const ImageSwitcher = ({imageGradCam, originalImageSrc}) => {
  const [activeGradType, setActiveGradType] = useState(0); // 0 for Grad Image, 1 for Original Image

  console.log(imageGradCam);
  console.log(originalImageSrc);
  return (
    <div className="image-switcher-container">
      {/* View Type of Image Section */}
      <div className="view-type-section">
        <span>View Type of Image</span>

        <div className="toggle-switch-container">
          <div
            className="toggle-slider"
            style={{
              // Use inline style for dynamic transform, as it depends on state
              transform: activeGradType === 0 ? "translateX(0)" : "translateX(100%)",
            }}
          />
          <div
            className={`toggle-option ${activeGradType === 0 ? 'active' : ''}`}
            onClick={() => setActiveGradType(0)}
          >
            Grad Image
          </div>
          <div
            className={`toggle-option ${activeGradType === 1 ? 'active' : ''}`}
            onClick={() => setActiveGradType(1)}
          >
            Original Image
          </div>
        </div>
      </div>

      {/* Conditional Image Display */}
      <div className="image-display-container">
        <img
          src={activeGradType === 0 ? imageGradCam : originalImageSrc}
          alt={activeGradType === 0 ? "Grad-CAM Heatmap" : "Original Input"}
          className="displayed-image"
        />
      </div>
    </div>
  );
}

export default ImageSwitcher;