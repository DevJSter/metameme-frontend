import React, { useState, useRef, useEffect } from "react";
import {
  Crop,
  Type,
  Move,
  Image,
  Palette,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const GifEditor = () => {
  const [mode, setMode] = useState("move");
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [textInput, setTextInput] = useState("");
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 281 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCanvasSize({ width: img.width, height: img.height });
    };
    img.src = "https://media.tenor.com/2nKSTDDekOgAAAAC/coding-kira.gif";
  }, []);

  const handleAddText = () => {
    if (textInput) {
      const newElement = {
        type: "text",
        content: textInput,
        x: canvasSize.width / 2,
        y: canvasSize.height / 2,
        fontSize: 24,
        fontFamily: "Arial",
        color: "#000000",
        bold: false,
        italic: false,
        underline: false,
        align: "left",
      };
      setElements([...elements, newElement]);
      setTextInput("");
    }
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedElement = elements.find(
      (el) => x >= el.x && x <= el.x + 100 && y >= el.y && y <= el.y + 30
    );

    setSelectedElement(clickedElement || null);
  };

  const handleElementDrag = (e, index) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(elements.map((el, i) => (i === index ? { ...el, x, y } : el)));
  };

  const updateElementProperty = (property, value) => {
    setElements(
      elements.map((el) =>
        el === selectedElement ? { ...el, [property]: value } : el
      )
    );
    setSelectedElement({ ...selectedElement, [property]: value });
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Toolbox</h2>
        <Button
          onClick={() => setMode("move")}
          variant={mode === "move" ? "default" : "outline"}
          className="mb-2"
        >
          <Move className="mr-2 h-4 w-4" /> Move
        </Button>
        <Button
          onClick={() => setMode("text")}
          variant={mode === "text" ? "default" : "outline"}
          className="mb-2"
        >
          <Type className="mr-2 h-4 w-4" /> Text
        </Button>
        <Button
          onClick={() => setMode("image")}
          variant={mode === "image" ? "default" : "outline"}
          className="mb-2"
        >
          <Image className="mr-2 h-4 w-4" /> Image
        </Button>
        {mode === "text" && (
          <div className="mt-4">
            <Input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text"
              className="mb-2"
            />
            <Button onClick={handleAddText}>Add Text</Button>
          </div>
        )}
      </div>
      <div className="flex-grow p-4">
        <div
          className="relative"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            className="border border-gray-300"
          />
          <img
            src="https://media.tenor.com/2nKSTDDekOgAAAAC/coding-kira.gif"
            alt="Coding Kira"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {elements.map((element, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: element.x,
                top: element.y,
                cursor: mode === "move" ? "move" : "default",
                fontSize: `${element.fontSize}px`,
                fontFamily: element.fontFamily,
                color: element.color,
                fontWeight: element.bold ? "bold" : "normal",
                fontStyle: element.italic ? "italic" : "normal",
                textDecoration: element.underline ? "underline" : "none",
                textAlign: element.align,
              }}
              onMouseDown={(e) =>
                mode === "move" && handleElementDrag(e, index)
              }
            >
              {element.content}
            </div>
          ))}
        </div>
      </div>
      {selectedElement && (
        <div className="w-64 bg-gray-100 p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Element Properties</h2>
          <Input
            type="text"
            value={selectedElement.content}
            onChange={(e) => updateElementProperty("content", e.target.value)}
            className="mb-2"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mb-2">
                Font: {selectedElement.fontFamily}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              {[
                "Arial",
                "Verdana",
                "Times New Roman",
                "Courier",
                "serif",
                "sans-serif",
              ].map((font) => (
                <Button
                  key={font}
                  onClick={() => updateElementProperty("fontFamily", font)}
                  className="w-full mb-1"
                >
                  {font}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
          <div className="flex mb-2">
            <Button
              onClick={() =>
                updateElementProperty("bold", !selectedElement.bold)
              }
              variant={selectedElement.bold ? "default" : "outline"}
              className="mr-1"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              onClick={() =>
                updateElementProperty("italic", !selectedElement.italic)
              }
              variant={selectedElement.italic ? "default" : "outline"}
              className="mr-1"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              onClick={() =>
                updateElementProperty("underline", !selectedElement.underline)
              }
              variant={selectedElement.underline ? "default" : "outline"}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex mb-2">
            <Button
              onClick={() => updateElementProperty("align", "left")}
              variant={selectedElement.align === "left" ? "default" : "outline"}
              className="mr-1"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => updateElementProperty("align", "center")}
              variant={
                selectedElement.align === "center" ? "default" : "outline"
              }
              className="mr-1"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => updateElementProperty("align", "right")}
              variant={
                selectedElement.align === "right" ? "default" : "outline"
              }
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Font Size
            </label>
            <Slider
              value={[selectedElement.fontSize]}
              onValueChange={(value) =>
                updateElementProperty("fontSize", value[0])
              }
              max={72}
              min={8}
              step={1}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <Input
              type="color"
              value={selectedElement.color}
              onChange={(e) => updateElementProperty("color", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GifEditor;
