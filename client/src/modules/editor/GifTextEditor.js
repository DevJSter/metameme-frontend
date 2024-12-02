import React, { useState, useRef, useEffect } from "react";
import gifFrames from "gif-frames";
import gifshot from "gifshot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  X,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  Download,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import MemeEditorSkeleton from "./meme-editor-skeleton";

const GifTextOverlay = ({
  gifURI = "https://media.tenor.com/hmDMrE1yMAkAAAAC/when-the-coding-when-the.gif",
}) => {
  const [textBoxes, setTextBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [gif, setGif] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);
  const [frames, setFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const exportCanvasRef = useRef(null);

  useEffect(() => {
    const loadGif = async () => {
      setIsLoading(true);
      setError(null);

      if (!gifURI) {
        console.error("gifURI is undefined");
        setError("No image URL provided. Please check the gifURI prop.");
        setIsLoading(false);
        return;
      }

      console.log("Attempting to load GIF from URL:", gifURI);

      try {
        const frameData = await gifFrames({
          url: gifURI,
          frames: "all",
          outputType: "canvas",
        });
        console.log(
          "GIF frames loaded successfully:",
          frameData.length,
          "frames"
        );
        setFrames(frameData);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          console.log("GIF image loaded successfully");
          setGif(img);
          updateCanvasSize(img);
          setIsLoading(false);
        };
        img.onerror = (e) => {
          console.error("Error loading GIF image:", e);
          throw new Error("Failed to load GIF image");
        };
        img.src = gifURI;
      } catch (error) {
        console.error("Error in loadGif:", error);

        try {
          console.log("Attempting to load as regular image...");
          const response = await fetch(gifURI);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          const img = new Image();
          img.onload = () => {
            console.log("Image loaded successfully");
            setGif(img);
            setFrames([
              {
                frameInfo: { width: img.width, height: img.height },
                getImage: () => img,
              },
            ]);
            updateCanvasSize(img);
            setIsLoading(false);
          };
          img.onerror = (e) => {
            console.error("Error loading as regular image:", e);
            throw new Error(`Failed to load image: ${e.message}`);
          };
          img.src = URL.createObjectURL(blob);
        } catch (imgError) {
          console.error("Error loading as regular image:", imgError);
          setError(`Failed to load image. ${imgError.message}`);
          setIsLoading(false);
        }
      }
    };

    loadGif();
  }, [gifURI]);

  useEffect(() => {
    const handleResize = () => updateCanvasSize(gif);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gif]);

  useEffect(() => {
    if (canvasSize.width && canvasSize.height && gif) {
      drawCanvas();
    }
  }, [canvasSize, gif, textBoxes]);

  const updateCanvasSize = (img) => {
    if (!img) return;

    const maxWidth = Math.min(800, window.innerWidth - 32);
    const maxHeight = window.innerHeight - 200;

    let width, height;

    if (img.width / img.height > maxWidth / maxHeight) {
      width = maxWidth;
      height = (maxWidth * img.height) / img.width;
    } else {
      height = maxHeight;
      width = (maxHeight * img.width) / img.height;
    }

    setCanvasSize({ width, height });
  };

  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
      context.strokeText(lines[i], x, y + i * lineHeight);
      context.fillText(lines[i], x, y + i * lineHeight);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gif) {
      ctx.drawImage(gif, 0, 0, canvas.width, canvas.height);
    } else {
      console.error("No GIF loaded to draw on canvas");
    }

    textBoxes.forEach((box) => {
      ctx.font = `${box.fontSize}px Arial`;
      ctx.fillStyle = box.color;
      ctx.strokeStyle = box.strokeColor;
      ctx.lineWidth = box.strokeWidth;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxWidth = canvas.width * 0.8;
      const lineHeight = box.fontSize * 1.2;
      wrapText(ctx, box.text, box.x, box.y, maxWidth, lineHeight);
    });
  };

  const addTextBox = () => {
    const newBox = {
      id: Date.now(),
      text: "New Text",
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      fontSize: 20,
      color: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 2,
    };
    setTextBoxes([...textBoxes, newBox]);
    setExpandedBox(newBox.id);
  };

  const handleTextChange = (id, field, value) => {
    setTextBoxes(
      textBoxes.map((box) => (box.id === id ? { ...box, [field]: value } : box))
    );
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setSelectedBox(null);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleStart = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const clickedBox = textBoxes.find(
      (box) => Math.abs(box.x - x) < 50 && Math.abs(box.y - y) < 20
    );

    setSelectedBox(clickedBox);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleMove = (clientX, clientY) => {
    if (selectedBox) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setTextBoxes(
        textBoxes.map((box) =>
          box.id === selectedBox.id ? { ...box, x, y } : box
        )
      );
    }
  };

  const handleTouchEnd = () => {
    setSelectedBox(null);
  };

  const removeTextBox = (id) => {
    setTextBoxes(textBoxes.filter((box) => box.id !== id));
    if (expandedBox === id) setExpandedBox(null);
  };

  const scalePosition = (pos, originalSize, newSize) => {
    return (pos / originalSize) * newSize;
  };

  const exportGif = async () => {
    setIsProcessing(true);
    setIsExporting(true);
    const displayCanvas = canvasRef.current;
    const exportCanvas = exportCanvasRef.current;
    const exportCtx = exportCanvas.getContext("2d");

    const newFrames = await Promise.all(
      frames.map(async (frame, index) => {
        exportCanvas.width = frame.frameInfo.width;
        exportCanvas.height = frame.frameInfo.height;
        exportCtx.drawImage(frame.getImage(), 0, 0);

        textBoxes.forEach((box) => {
          exportCtx.font = `${box.fontSize}px Arial`;
          exportCtx.fillStyle = box.color;
          exportCtx.strokeStyle = box.strokeColor;
          exportCtx.lineWidth = box.strokeWidth;
          exportCtx.textAlign = "center";
          exportCtx.textBaseline = "middle";

          const scaledX = scalePosition(
            box.x,
            displayCanvas.width,
            exportCanvas.width
          );
          const scaledY = scalePosition(
            box.y,
            displayCanvas.height,
            exportCanvas.height
          );
          const scaledFontSize =
            (box.fontSize / displayCanvas.width) * exportCanvas.width;

          const maxWidth = exportCanvas.width * 0.8;
          const lineHeight = scaledFontSize * 1.2;
          wrapText(exportCtx, box.text, scaledX, scaledY, maxWidth, lineHeight);
        });

        setProgress(((index + 1) / frames.length) * 50);
        return exportCanvas.toDataURL("image/png");
      })
    );

    try {
      const result = await new Promise((resolve, reject) => {
        gifshot.createGIF(
          {
            images: newFrames,
            gifWidth: frames[0].frameInfo.width,
            gifHeight: frames[0].frameInfo.height,
            interval: frames[0].frameInfo.delay / 100,
            progressCallback: (captureProgress) => {
              setProgress(50 + captureProgress * 50);
            },
          },
          (obj) => {
            if (!obj.error) {
              resolve(obj);
            } else {
              reject(new Error(obj.errorMsg));
            }
          }
        );
      });

      const link = document.createElement("a");
      link.href = result.image;
      link.download = "edited_gif.gif";
      link.click();
    } catch (error) {
      console.error("Error creating GIF:", error);
    } finally {
      setIsProcessing(false);
      setIsExporting(false);
      setProgress(0);
    }
  };

  if (isLoading) {
    return <MemeEditorSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <p className="mt-2">Error details have been logged to the console.</p>
          <p className="mt-2">Please check the GIF URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto p-4 rounded-lg">
      <div className="lg:w-2/3 mb-4 lg:mb-0 lg:mr-4">
        <div className="relative flex justify-center">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            onMouseLeave={handleMouseUp}
            className="border-2 shadow-dark rounded-lg touch-none"
          />
          <canvas ref={exportCanvasRef} style={{ display: "none" }} />
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              onClick={addTextBox}
              variant="ghost"
              className="rounded-full p-2 bg-main hover:bg-main text-white"
            >
              <PlusCircle size={24} />
            </Button>
            <Button
              onClick={exportGif}
              className="rounded-full p-2 bg-green-500 hover:bg-green-600 text-black"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Download size={24} />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="lg:w-1/3 space-y-4 overflow-y-auto md:max-h-[500px] px-2 py-2">
        {textBoxes.length === 0 && (
          <Card className="font-semibold text-xl p-3">
            Click on Add button to add text&lsquo;s
          </Card>
        )}

        {textBoxes.map((box) => (
          <div
            key={box.id}
            className="bg-white p-4 rounded-lg shadow-light border-2"
          >
            <div className="flex items-center mb-2">
              <Input
                type="text"
                value={box.text}
                onChange={(e) =>
                  handleTextChange(box.id, "text", e.target.value)
                }
                className="mr-2 flex-grow"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setExpandedBox(expandedBox === box.id ? null : box.id)
                }
              >
                {expandedBox === box.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => removeTextBox(box.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {expandedBox === box.id && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <Slider
                    value={[box.fontSize]}
                    onValueChange={(value) =>
                      handleTextChange(box.id, "fontSize", value[0])
                    }
                    min={10}
                    max={50}
                    step={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fill Color
                  </label>
                  <input
                    type="color"
                    value={box.color}
                    onChange={(e) =>
                      handleTextChange(box.id, "color", e.target.value)
                    }
                    className="w-full h-8 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stroke Width
                  </label>
                  <Slider
                    value={[box.strokeWidth]}
                    onValueChange={(value) =>
                      handleTextChange(box.id, "strokeWidth", value[0])
                    }
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stroke Color
                  </label>
                  <input
                    type="color"
                    value={box.strokeColor}
                    onChange={(e) =>
                      handleTextChange(box.id, "strokeColor", e.target.value)
                    }
                    className="w-full h-8 rounded"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GifTextOverlay;
