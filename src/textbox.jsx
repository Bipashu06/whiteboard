import React, { useState, useRef, useEffect } from 'react';
import './textbox.css';
import images from './assets/images.png';

export default function TextBox({ id, positionX, positionY, onDelete }) {
  const [position, setPosition] = useState({ x: positionX, y: positionY });
  const [size, setSize] = useState({ width: 200, height: 50 });
  const [font_size, setFont_size] = useState(10 + (size.width / 200) * 10); // Initial font size
  const divRef = useRef(null);
  const [isTyping, setIsTyping] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(size.width / size.height);
  const [textColor, setTextColor] = useState('black');
  const [fontWeight, setFontWeight] = useState('300');
  const [isOpen, setIsOpen] = useState(false);
  const options = ["200", "300", "400", "500", "600", "700", "800"];
  // Dragging functionality
  const handleDragMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position.x;
    const startPosY = position.y;

    const onMouseMove = (e) => {
      const newPosX = startPosX + (e.clientX - startX);
      const newPosY = startPosY + (e.clientY - startY);
      setPosition({ x: newPosX, y: newPosY });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Resizing functionality (right handle)
  const handleResizeRight = (e) => {
    setIsTyping(true);
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = size.width;

    const onMouseMove = (e) => {
      let newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 100 && newWidth <= 800) { // Control minimum and maximum width
        setSize({ width: newWidth });
        setAspectRatio(newWidth / size.height);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Handle scale resize (with aspect ratio)
  const handleScaleResize = (e) => {
    setIsTyping(true);
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = size.width;

    const onMouseMove = (e) => {
      let newWidth = startWidth + (e.clientX - startX);
      let newHeight = newWidth / aspectRatio; // Maintain aspect ratio

      if (newWidth > 100 && newWidth <= 800) { // Control min and max width
        setSize({ width: newWidth, height: newHeight });

        // Dynamically adjust the font size based on the new width
        const newFontSize = (newHeight * 0.4); // Example scale factor
        setFont_size(newFontSize);
      }
    };
    const onMouseUp = () => {

      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning={true}
      className="text-box"
      style={{
        fontSize: `${font_size}px`, // Adjust the font size dynamically
        width: `${size.width}px`,
        height: isTyping ? 'auto' : `${size.height}px`,
        transform: `translate(${position.x}px, ${position.y}px)`,
        color: textColor,
        fontWeight: fontWeight
      }}
      onDoubleClick={() => onDelete(id)}
      onMouseDown={handleDragMouseDown}
    >
      <div contentEditable="false"
        className="text-edit-controlls">
        <input type="color" id='text_box_color_input'
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            setTextColor(e.target.value);
          }} />
        <div className="weight-list-container">
          <div className="selected-value" onClick={() => setIsOpen(!isOpen)}>{fontWeight}</div>
          {isOpen && (
            <div className="options">
              {options.map((opt) => (
                <div
                  key={opt}
                  className={`option ${fontWeight === opt ? "selected" : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Don't steal focus
                    setFontWeight(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        contentEditable="false"
        className="resize-handle"
        onMouseDown={handleResizeRight}
      ></div>

      <div
        contentEditable="false"
        className="boxSize-handler"
        onMouseDown={handleScaleResize}
      ></div>
      Double click to delete!!
    </div>
  );
}
