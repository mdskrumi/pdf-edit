import React, { useRef, useState } from "react";

const DrawOnImage: React.FC<{
  imageUrl: string;
  index: number;
  setImageUrls: Function;
}> = ({ imageUrl, index, setImageUrls }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const [myImage, setMyImage] = useState(imageUrl);

  const handleMouseDown = (event: any) => {
    setIsDrawing(true);
    setStartX(event.nativeEvent.offsetX);
    setStartY(event.nativeEvent.offsetY);
  };

  const handleMouseMove = (event: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    // @ts-ignore
    const context = canvas.getContext("2d");
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;

    // @ts-ignore
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imageRef.current, 0, 0);

    const width = currentX - startX;
    const height = currentY - startY;

    context.fillStyle = "rgba(0, 0, 0, 1)"; // Red color with 30% opacity
    context.fillRect(startX, startY, width, height);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    // @ts-ignore
    const dataURL = canvas.toDataURL("image/png");
    setImageUrls((urls: any) =>
      urls.map((u: any, idx: any) => {
        if (idx === index) {
          console.log("Updating");
          return dataURL;
        } else {
          return u;
        }
      })
    );
  };

  return (
    <div key={index}>
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Image to Draw On"
        onLoad={() => {
          const image = imageRef.current;
          const canvas = canvasRef.current;
          // @ts-ignore
          canvas.width = image.width;
          // @ts-ignore
          canvas.height = image.height;
          // @ts-ignore
          canvas.getContext("2d").drawImage(image, 0, 0);
        }}
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default DrawOnImage;
