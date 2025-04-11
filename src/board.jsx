import './board.css'
import html2canvas from 'html2canvas';
import React, { useEffect, useState, useRef } from 'react'
import marker from './assets/marker.png';
import cursor from './assets/cursor.png';
import text from './assets/text.png';
import shapes from './assets/shape.png';
import emojis from './assets/emoji.png';
import images from './assets/images.png';

import laugh from './assets/emojis/laugh.png';
import anxious from './assets/emojis/anxious.png';
import eyebrow from './assets/emojis/eyebrow.png';
import laugh2 from './assets/emojis/laugh2.png';
import nerd from './assets/emojis/nerd.png';
import grinning from './assets/emojis/grinning.png';
import party from './assets/emojis/party.png';
import shock from './assets/emojis/shock.png';

import circle from './assets/shapes/circle.png';
import square from './assets/shapes/square.png';
import heart from './assets/shapes/heart.png';
import star from './assets/shapes/star.png';
import rectangle from './assets/shapes/rectangle.png';
import hexagon from './assets/shapes/hexagon.png';
import cube from './assets/shapes/cube.png';
import triangle from './assets/shapes/triangle.png';

import blue from './assets/blue.png';
import black from './assets/black.png';
import red from './assets/red.png';
import green from './assets/green.png';
import eraser from './assets/eraser.png';

import TextBox from './textbox';

export default function Board() {
    const canvasRef = useRef(null); // Reference to the canvas element
    const [isDrawing, setIsDrawing] = useState(false); // State to track if the mouse is pressed
    const [isMarker, setIsMarker] = useState(false);
    const [selectedMarker, SetSelectedMarker] = useState(0);
    const [strokeColor, setStrokeColor] = useState('black');

    const [eraserPosition, setEraserPosition] = useState({ x: 0, y: 0 });
    const [showEraser, setShowEraser] = useState(false);
    const [showThickNess, setShowThickNess] = useState(true);
    const [thicknessValue, setThicknessValue] = useState(4);
    function handleThicknessChange(event) {
        setThicknessValue(event.target.value);
    };

    const emojis_array = [laugh, laugh2, anxious, party, grinning, shock, 
        nerd, eyebrow, emojis];
    const shapes_array = [circle, rectangle, triangle, square, heart, star,
        cube, hexagon];
    const [selectedShape, setSelectedShape] = useState(null);
    const [showShapes, setShowShapes] = useState(null);
    // Get the 2D drawing context from the canvas

    function markerClicked(i) {
        SetSelectedMarker(i)
        if (i === 0) {
            setStrokeColor('black')
        }
        else if (i === 1) {
            setStrokeColor('blue')
        }
        else if (i === 2) {
            setStrokeColor('red')
        }
        else if (i === 3) {
            setStrokeColor('green')
        }
        else if (i === 4) {
            setStrokeColor('white')
        }
        else {
            setStrokeColor('black')
        }
    }
    const getCanvasContext = () => {
        const canvas = canvasRef.current;
        return canvas ? canvas.getContext('2d') : null;
    };

    useEffect(() => {

        const ctx = getCanvasContext();
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [canvasRef]);
    const startDrawing = (e) => {
        document.querySelector('.markers-container').classList.remove('active');
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.beginPath(); // Start a new path for drawing
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); // Start drawing from the mouse position
            setIsDrawing(true); // Set drawing state to true
        }
        if (selectedMarker === 4) {
            setShowEraser(true);
        }
    };

    const draw = (e) => {
        if (!isDrawing) return; // Don't draw if the mouse is not pressed
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); // Draw a line to the new mouse position
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeColor === 'white' ? thicknessValue * 2 : thicknessValue; // Set line width (customizable)
            ctx.stroke(); // Perform the drawing
            setEraserPosition({ x: e.clientX, y: e.clientY - 50 });
        }
    };
    const stopDrawing = () => {
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.closePath(); // Complete the drawing path
            setIsDrawing(false); // Set drawing state to false
        }
        setShowEraser(false)
    };

    
    //----------------------------dropping images and shiefting their positions--------------------------------------------------------------
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [droppedImages, setDroppedImages] = useState([]);
    const [draggingImageId, setDraggingImageId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
          const img = new Image();
          img.src = loadEvent.target.result;
        
        img.onload = () => {
            const newImage = {
            id: Date.now() + i, // Unique ID for each image
            src: img.src,
            x: event.clientX, // Position based on the drop
            y: event.clientY,
            width: 300,
            height: 200,
            
        };
        setDroppedImages((prevImages) => [...prevImages, newImage]);
    };
};

reader.readAsDataURL(file);
}
}
};


const handleDragOver = (event) => {
    event.preventDefault();
};




const [imageResizing, setImageResizing] = useState(false);
const [imageLastWidth, setImageLastWidth] = useState(0);
 const [imageLastX, setImageLastX]= useState(0);

const handleImageMouseDown = (image, event) => {
    const parentDiv = event.currentTarget; // The parent div
    const targetElement = event.target; // The clicked element
    if(parentDiv !== targetElement && parentDiv.contains(targetElement)){
        setImageResizing(true);
    }
    else{
        setImageResizing(false);
    }
    setDraggingImageId(image.id);
    setSelectedImageIndex(image.id);

    setImageLastWidth(image.width);
    setImageLastX(image.x);
    setDragOffset({
        x: event.clientX - image.x,
        y: event.clientY - image.y,
    });
    
};


const handleMouseMove = (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
  if (draggingImageId !== null && imageResizing !== true) {
    setDroppedImages((prevImages) =>
      prevImages.map((image) =>
        image.id === draggingImageId
          ? { ...image, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y}
          : image
      )
    );
  }
  else if(draggingImageId !== null && imageResizing === true){
    let newWidth = null;

    if (imageLastX <= imageLastWidth / 2) {
        newWidth = mouseX;
    } else {
        newWidth = mouseX - (imageLastX - imageLastWidth / 2);
    }
    
    setDroppedImages((prevImages) =>
        prevImages.map((image) => {
            if (image.id === draggingImageId) {
                const isSquare = image.width === image.height;
                const newHeight = isSquare ? newWidth : newWidth * (2 / 3);
                
                return {
                    ...image,
                    width: newWidth,
                    height: newHeight,
                };
            }
            return image;
        })
    );
    
}
};
const handleMouseUp = () => {
  setDraggingImageId(null);
};
const handleImageDelete = (imageId) => {
    setDroppedImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
};
//------------------------------------------------------------------------------------------------------------------------------------------------

    const saveCanvasAsImage = () => { 
        if(content.length <= 1 ){
            alert('file name cant be empty')
            return null;
        }
        if(content.length >= 15){
            alert('file name is too long')
            return null;
        }
        const canvasContainer = document.getElementById('draw-area'); 
        html2canvas(canvasContainer, { scale: 3, logging: true, useCORS: true }).then((canvas) => {
        const image = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${content}.jpg`; 
        link.click(); 
    });
    };






    const [textBoxAdd, setTextBoxAdd] = useState(false);
    const [textBoxes, setTextBoxes] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const divRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null)
    const ColorMarkers = [black, blue, red, green, eraser];
    function changeCursor() {
        document.querySelector('.main-page').classList.toggle('ChangeCursor');
    }
    function handleClick(n) {
        setActiveIndex(n);
        if (n === 2) {
            setTextBoxAdd(prevState => {
                const newState = !prevState;
                return newState;
            })
        }
        if (n === 0) {
            setIsMarker(true);
        }
        else {
            setIsMarker(false);
        }
    }
    function showMarkers() {
        document.querySelector('.markers-container').classList.toggle('active');
    }
    function showEmojis() {
        document.querySelector('.emojis-container').classList.toggle('active');
    }
   
    function addTextBox(e) {
        const newTextBox = {
            id: Date.now(), // Unique ID based on timestamp
            component: <TextBox key={Date.now()} positionX={e.clientX - 100} positionY={e.clientY - 100} />
        };
    
        setTextBoxes((prevTextBoxes) => [...prevTextBoxes, newTextBox]);
        setTextBoxAdd(prevState => !prevState);
        setActiveIndex(null);
    }
    function deleteTextBox(id) {
        setTextBoxes((prevTextBoxes) => prevTextBoxes.filter(textBox => textBox.id !== id));
    }
    

    //set position of eraser
    function checkClick(e){
        
        if(showEraser)
            setEraserPosition({ x: e.clientX, y: e.clientY });
    }
    //for file name check
    useEffect(() => {
       
        const handleKeyDown = (e) => {
            if (document.querySelector('.page-name').textContent.length > 14) {
                if (e.key !== 'Backspace'){
                    e.preventDefault();
                    setShowAlert(true);
                }
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (divRef.current) {
                    divRef.current.blur();
                }
                const slicedName = document.querySelector('.page-name').textContent.slice(0, 15);
                document.querySelector('.page-name').textContent = slicedName;
                setShowAlert(false)
            }
        };

        return () => {
            window.removeEventListener('click', Print);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const Print= (e) => {
        return null;
    }



    const [content, setContent] = useState('Untitled');
    function checkNameLength(e) {
        if (divRef.current) {
            setContent(divRef.current.innerText); // Update the content state with the current text
        }
        if (divRef.current.textContent.length > 14 && e.key !== 'backspace') {  
            e.preventDefault();
            setShowAlert(true)
        }
        else {
            setShowAlert(false)
        }
    }


    const imageInputhandler = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            id: Date.now() + Math.random(),
            src: URL.createObjectURL(file), // Ensure you are using 'src' for the image URL
            x: 200 + (droppedImages.length) * 20, // Initial position or set it as needed
            y: 200 + (droppedImages.length) * 20, // Initial position or set it as needed
            height: 200,
            width: 300,
        }));
        setDroppedImages((prevImages) => [...prevImages, ...newImages]);
    };

    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const addemoji = (imageUrl) => {
        if(!imageUrl) return null;
        const newImage = {
            id: Date.now() + Math.random(),
            src: imageUrl,
            x: 200 + droppedImages.length * 20,
            y: 200 + droppedImages.length * 20,
            height: 100,
            width: 100,
        };
        setDroppedImages((prevImages) => [...prevImages, newImage]);
        setActiveIndex(null);
        setSelectedEmoji(null);
    };
    const addShape = (imageUrl) => {
        if(!imageUrl) return null;
        const newImage = {
            id: Date.now() + Math.random(),
            src: imageUrl,
            x: 200 + droppedImages.length * 20,
            y: 200 + droppedImages.length * 20,
            height: 100,
            width: 100,
        };
        setDroppedImages((prevImages) => [...prevImages, newImage]);
        setActiveIndex(null);
        setSelectedShape(null);
    };

    function fileInputClicked(){
        document.getElementById('imageInput').click();
    }
//  console.log(window.innerHeight, droppedImages[0].width - droppedImages[0].x, droppedImages)
    

    return (
        <>
            <div className="main-page"
            >
                <div className="top-nav">
                    <div className="page-name-container">
                        <div
                            ref={divRef}
                            className="page-name"
                            onInput={checkNameLength}
                            contentEditable="true"  
                        >NewArt</div>
                        <div className={`alert ${showAlert ? 'show' : 'hide'}`}>
                            must be less <br /> than 16
                        </div>
                    </div>
                    <button onClick={saveCanvasAsImage}>Save Image</button>
                </div>
                <div className={`thickness-bar ${showThickNess ? 'show' : 'hide'}`}>
                    Thickness: {thicknessValue}
                    <input
                        type="range"
                        min="2"
                        max="20"
                        value={thicknessValue}
                        onChange={handleThicknessChange}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="drawing-area"
                id='draw-area'
                   onMouseUp={handleMouseUp}
                   onMouseMove={handleMouseMove}
                   onMouseLeave={handleMouseUp}
                   onDragOver={handleDragOver}
                   onDrop={handleDrop}

                    onMouseDown={() => {checkClick}}    
                    onClick={(e) => {
                        if(!e.target.closest('.droppedImage')){
                            setSelectedImageIndex(null)
                        }
                        if (textBoxAdd) {
                            addTextBox(e);
                        }else if(activeIndex === 4){
                            addemoji(emojis_array[selectedEmoji]);
                        }
                        else if(activeIndex === 3){
                            addShape(shapes_array[selectedShape]);
                        }
                    }
                    } >
                    {droppedImages.map((image, index) => {
                         const maxWidth = window.innerWidth - image.width / 2; // Maximum width limit
                         const maxHeight = window.innerHeight - 93;
                         const topPosition = Math.min(Math.max(image.y, image.height / 2 + 53 + 8) , maxHeight);
                         const leftPosition = Math.min(Math.max(image.x, image.width / 2), maxWidth); // Ensure image.x is between 0 and maxWidth
                         const isSelected = selectedImageIndex === image.id;
                        return (
                            <div  className={`droppedImage ${selectedImageIndex === image.id ? 'selected' : ''}`}
                                key={image.id}
                                style={{
                                    position: 'absolute',
                                    left: `${leftPosition}px`,
                                    top: `${topPosition}px`, 
                                    width: `${image.width < 100 ? 100: image.width}px`,
                                    height: `${image.height < 67 ? 66.666 : image.height}px`,
                                    backgroundImage: `url(${image.src})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    borderRadius: '5px',
                                    cursor: 'move',
                                    transform: 'translate(-50%, -80%)',
                                }}
                                
                                onMouseDown={(e) => {
                                    handleImageMouseDown(image, e);
                                }}
                                
                             
                            >
                            {isSelected && (
                                <>
                                <div 
                                onMouseDown={(e) => {handleImageMouseDown(image, e)}}
                                className="resize-controller">
                                </div>
                                <img 
                                    onClick={() => handleImageDelete(image.id)}
                                    width="30" height="30" id = 'delete-image' src="https://img.icons8.com/material-outlined/30/trash--v1.png" alt="trash--v1"/>
                                </>
                            )}
                          
                            </div>

                        )
                    })}
                    {textBoxes.map(({ component, id }, index) => {
                        return (
                            <React.Fragment key={index}>
                                {React.cloneElement(component, { id, onDelete: deleteTextBox })}
                            </React.Fragment>
                        );
                    })}
                    <div
                        className={`eraser ${showEraser ? 'show' : 'hide'}`}
                        style={{
                            position: 'absolute',
                            // padding: `${thicknessValue}px`,
                            height: `${thicknessValue}px`,
                            width: `${thicknessValue}px`,
                            left: eraserPosition.x,
                            top: eraserPosition.y,
                            pointerEvents: 'none',
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        width={window.innerWidth}  // Width of the canvas (customizable)
                        height={window.innerHeight} // Height of the canvas (customizable)
                        className="drawable-canvas" // Optional styling through CSS

                        onMouseDown={isMarker ? startDrawing : null}  // Conditional for starting drawing
                        onMouseMove={isMarker ? draw : null}          // Conditional for drawing
                        onMouseUp={isMarker ? stopDrawing : null}     // Conditional for stopping drawing
                        onMouseEnter={() => {
                            if(isDrawing){
                                draw();
                            }
                        }}
                    />

                </div>
                <div className="controls-bar">
                    <div
                        className={`control ${activeIndex === 0 ? 'active' : ''}`}
                        onClick={() => { handleClick(0); showMarkers(); }}
                        id="marker">
                        <img src={ColorMarkers[selectedMarker]} style={{
                            width: '16px', height: '26px'
                            , paddingLeft: '4px'
                        }} alt="" />
                        <div className="markers-container">
                            {ColorMarkers.map((marker, index) => {
                                return (
                                    <img src={marker} key={index}
                                        onClick={() => markerClicked(index)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div
                        className={`control ${activeIndex === 1 ? 'active' : ''}`}
                        onClick={() => { handleClick(1); changeCursor(); }}
                        id="cursor">
                        <img src={cursor} alt="" />
                    </div>
                    <div
                        className={`control ${activeIndex === 2 ? 'active' : ''}`}
                        onClick={() => { handleClick(2) }}
                        id="text">
                        <img src={text} alt="" />
                    </div>
                    <div
                        className={`control ${activeIndex === 3 ? 'active' : ''}`}
                        onClick={() => { handleClick(3); setShowShapes(!showShapes)}}
                        id="shapes">
                        <img src={shapes} alt="" />
                        <div className='shapes-container'
                         style={{display: showShapes ? 'grid' : 'none', top: '40%', left: '104%', gap: '10px'}}>
                            {shapes_array.map((shapes, index) => (
                                <img src={shapes} alt="" id={index} onClick={() => setSelectedShape(index)}/>
                            ))}
                        </div>
                    </div>
                    <div
                        className={`control ${activeIndex === 4 ? 'active' : ''}`}
                        onClick={() => { handleClick(4); showEmojis(); }}
                        id="emojis">
                        <img src={emojis} alt="" />
                        <div className="emojis-container">
                            {emojis_array.map((imoji, index) => (
                                <img src={imoji} alt="" id={index} onClick={() => setSelectedEmoji(index)}/>
                            ))}
                        </div>
                    </div>
                    <div
                        className={`control ${activeIndex === 5 ? 'active' : ''}`}
                        onClick={() => { handleClick(5);
                            fileInputClicked();
                         }}
                        id="images">
                        <img src={images} alt="" />
                    </div>
                    <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        multiple
                        onChange={imageInputhandler}
                        style={{ display: 'none' }}  // Hide the input
                    />
                </div>

            </div>

        </>
    )
}