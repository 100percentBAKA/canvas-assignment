import React, { useEffect, useState, useRef } from "react";
import { Card } from "./components/Card";

const App = () => {
  const [selectedTool, setSelectedTool] = useState("rectangle");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(20);
  const [text, setText] = useState("");
  const [shapeProperties, setShapeProperties] = useState({
    x: null,
    y: null,
    radius: 50,
    width: 100,
    height: 100,
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("http://localhost:8000/hello");
        const result = await response.json();
        console.log("Backend Connection Check:", result);

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } catch (error) {
        console.error("Connection error:", error);
      }
    };

    checkConnection();
  }, []);

  const exportCanvasHTML = async () => {
    try {
      const response = await fetch("http://localhost:8000/canvas/export-html");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "canvas.html";
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to export as HTML");
      }
    } catch (error) {
      console.error("Error exporting as HTML:", error);
    }
  };

  const exportCanvasSVG = async () => {
    try {
      const response = await fetch("http://localhost:8000/canvas/export-svg");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "canvas.svg";
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to export as SVG");
      }
    } catch (error) {
      console.error("Error exporting as SVG:", error);
    }
  };

  const clearCanvas = async () => {
    try {
      const response = await fetch("http://localhost:8000/canvas/clear", {
        method: "POST",
      });

      if (response.ok) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; // Reset canvas background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        alert("Canvas cleared successfully");
      } else {
        console.error("Failed to clear canvas");
      }
    } catch (error) {
      console.error("Error clearing canvas:", error);
    }
  };

  const downloadCanvasPNG = async () => {
    try {
      const response = await fetch("http://localhost:8000/canvas/download");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "canvas.png";
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download PNG");
      }
    } catch (error) {
      console.error("Error downloading PNG:", error);
    }
  };

  const handleShapeSubmit = async () => {
    if (!shapeProperties.x || !shapeProperties.y) {
      alert("Please provide X and Y coordinates.");
      return;
    }

    // Validation for X and Y coordinates
    if (shapeProperties.x > 400 || shapeProperties.y > 400) {
      alert("X and Y coordinates must not exceed 400.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = color;

    if (selectedTool === "circle") {
      ctx.beginPath();
      ctx.arc(
        shapeProperties.x,
        shapeProperties.y,
        shapeProperties.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else if (selectedTool === "rectangle") {
      ctx.fillRect(
        shapeProperties.x,
        shapeProperties.y,
        shapeProperties.width,
        shapeProperties.height
      );
    }

    try {
      const response = await fetch(
        "http://localhost:8000/canvas/draw-element",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: selectedTool,
            x: shapeProperties.x,
            y: shapeProperties.y,
            ...(selectedTool === "circle"
              ? { radius: shapeProperties.radius }
              : {
                  width: shapeProperties.width,
                  height: shapeProperties.height,
                }),
            color,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to draw shape");
    } catch (error) {
      console.error(`Failed to draw ${selectedTool}:`, error);
    }
  };

  const handleTextSubmit = async () => {
    if (!shapeProperties.x || !shapeProperties.y || !text) {
      alert("Please provide X, Y coordinates and text.");
      return;
    }

    // Validation for X and Y coordinates
    if (shapeProperties.x > 400 || shapeProperties.y > 400) {
      alert("X and Y coordinates must not exceed 400.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, shapeProperties.x, shapeProperties.y);

    try {
      const response = await fetch("http://localhost:8000/canvas/draw-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          x: shapeProperties.x,
          y: shapeProperties.y,
          fontSize,
          color,
        }),
      });

      if (!response.ok) throw new Error("Failed to draw text");
    } catch (error) {
      console.error("Failed to submit text:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-6xl mx-auto p-6 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Toolbar */}
          <div className="w-full md:w-64 space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Drawing Tools</h3>

            <div className="flex flex-wrap gap-2">
              {["rectangle", "circle", "text"].map((tool) => (
                <button
                  key={tool}
                  onClick={() => setSelectedTool(tool)}
                  className={`px-3 py-2 rounded ${
                    selectedTool === tool
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {tool.charAt(0).toUpperCase() + tool.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1"
                />
              </div>

              {selectedTool === "text" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium">
                        X Coordinate
                      </label>
                      <input
                        type="number"
                        value={shapeProperties.x || ""}
                        onChange={(e) =>
                          setShapeProperties({
                            ...shapeProperties,
                            x: parseInt(e.target.value) || null,
                          })
                        }
                        className="mt-1 w-full p-2 border rounded"
                        placeholder="Enter X"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Y Coordinate
                      </label>
                      <input
                        type="number"
                        value={shapeProperties.y || ""}
                        onChange={(e) =>
                          setShapeProperties({
                            ...shapeProperties,
                            y: parseInt(e.target.value) || null,
                          })
                        }
                        className="mt-1 w-full p-2 border rounded"
                        placeholder="Enter Y"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Font Size
                    </label>
                    <input
                      type="number"
                      value={fontSize || ""}
                      onChange={(e) =>
                        setFontSize(parseInt(e.target.value) || "")
                      }
                      className="mt-1 w-full p-2 border rounded"
                      min="8"
                      max="72"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Text</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="mt-1 w-full p-2 border rounded"
                      placeholder="Enter text"
                    />
                  </div>
                  <button
                    onClick={handleTextSubmit}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Text
                  </button>
                </>
              )}

              {(selectedTool === "rectangle" || selectedTool === "circle") && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium">X</label>
                      <input
                        type="number"
                        value={shapeProperties.x || ""}
                        onChange={(e) =>
                          setShapeProperties({
                            ...shapeProperties,
                            x: parseInt(e.target.value) || null,
                          })
                        }
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Y</label>
                      <input
                        type="number"
                        value={shapeProperties.y || ""}
                        onChange={(e) =>
                          setShapeProperties({
                            ...shapeProperties,
                            y: parseInt(e.target.value) || null,
                          })
                        }
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  {selectedTool === "circle" ? (
                    <div>
                      <label className="block text-sm font-medium">
                        Radius
                      </label>
                      <input
                        type="number"
                        value={shapeProperties.radius || ""}
                        onChange={(e) =>
                          setShapeProperties({
                            ...shapeProperties,
                            radius: parseInt(e.target.value) || null,
                          })
                        }
                        className="mt-1 w-full p-2 border rounded"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium">
                          Width
                        </label>
                        <input
                          type="number"
                          value={shapeProperties.width || ""}
                          onChange={(e) =>
                            setShapeProperties({
                              ...shapeProperties,
                              width: parseInt(e.target.value) || null,
                            })
                          }
                          className="mt-1 w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Height
                        </label>
                        <input
                          type="number"
                          value={shapeProperties.height || ""}
                          onChange={(e) =>
                            setShapeProperties({
                              ...shapeProperties,
                              height: parseInt(e.target.value) || null,
                            })
                          }
                          className="mt-1 w-full p-2 border rounded"
                        />
                      </div>
                    </>
                  )}
                  <button
                    onClick={handleShapeSubmit}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Shape
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1">
            <canvas
              ref={canvasRef}
              className="w-full h-[600px] border border-gray-300 rounded"
            />
          </div>
        </div>
      </Card>

      <Card className="max-w-6xl mx-auto p-6 bg-white mt-6">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">Options</h3>
          <div className="flex flex-row items-center space-x-4">
            <button
              onClick={exportCanvasHTML}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Export as HTML
            </button>
            <button
              onClick={exportCanvasSVG}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Export as SVG
            </button>
            <button
              onClick={downloadCanvasPNG}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Download as PNG
            </button>
            <button
              onClick={clearCanvas}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Clear Canvas
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default App;
