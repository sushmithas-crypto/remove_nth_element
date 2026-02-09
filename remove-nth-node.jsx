import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

export default function RemoveNthNodeVisualizer() {
  const [nodes, setNodes] = useState([1, 2, 3, 4, 5]);
  const [n, setN] = useState(2);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fastPointer, setFastPointer] = useState(-1);
  const [slowPointer, setSlowPointer] = useState(-1);
  const [explanation, setExplanation] = useState('');
  const [completed, setCompleted] = useState(false);

  const steps = [
    { fast: -1, slow: -1, text: "Initialize two pointers. We'll use the two-pointer technique." },
    { fast: n, slow: -1, text: `Move fast pointer ${n} steps ahead to create a gap of n nodes.` },
    { fast: n, slow: 0, text: "Now move both pointers together until fast reaches the end." },
    { fast: nodes.length, slow: nodes.length - n, text: "Fast pointer reached the end. Slow pointer is now before the node to remove." },
    { fast: -1, slow: -1, text: "Remove the node by skipping it in the linked list!" }
  ];

  useEffect(() => {
    if (step < steps.length) {
      setFastPointer(steps[step].fast);
      setSlowPointer(steps[step].slow);
      setExplanation(steps[step].text);
    }
  }, [step]);

  useEffect(() => {
    if (isPlaying && step < steps.length - 1) {
      const timer = setTimeout(() => {
        setStep(step + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isPlaying && step === steps.length - 1) {
      setTimeout(() => {
        const newNodes = [...nodes];
        newNodes.splice(nodes.length - n, 1);
        setNodes(newNodes);
        setCompleted(true);
        setIsPlaying(false);
      }, 2000);
    }
  }, [isPlaying, step]);

  const handlePlay = () => {
    if (completed) {
      handleReset();
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setNodes([1, 2, 3, 4, 5]);
    setStep(0);
    setIsPlaying(false);
    setCompleted(false);
    setFastPointer(-1);
    setSlowPointer(-1);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else if (step === steps.length - 1) {
      const newNodes = [...nodes];
      newNodes.splice(nodes.length - n, 1);
      setNodes(newNodes);
      setCompleted(true);
    }
  };

  const handleNChange = (newN) => {
    if (newN >= 1 && newN <= 5) {
      setN(newN);
      handleReset();
    }
  };

  const getNodeColor = (index) => {
    if (completed && index === nodes.length - n) return 'bg-red-500';
    if (slowPointer === index) return 'bg-blue-500';
    if (fastPointer === index) return 'bg-green-500';
    return 'bg-gray-700';
  };

  const getNodeOpacity = (index) => {
    if (completed && nodes.length === 4 && index >= nodes.length - n) {
      return 'opacity-30';
    }
    return 'opacity-100';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-center mb-2 text-white">
        Remove Nth Node From End
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Two-Pointer Technique Visualization
      </p>

      {/* Controls */}
      <div className="mb-8 flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-white font-medium">Remove from end:</label>
          <select
            value={n}
            onChange={(e) => handleNChange(Number(e.target.value))}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPlaying}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>n = {num}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Play size={20} />
          {completed ? 'Replay' : 'Play'}
        </button>

        <button
          onClick={handleNext}
          disabled={isPlaying || completed}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <SkipForward size={20} />
          Next Step
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      {/* Linked List Visualization */}
      <div className="mb-8 bg-gray-800 rounded-lg p-8">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {nodes.map((value, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Pointer Labels */}
                <div className="h-8 flex gap-2 mb-2">
                  {slowPointer === index && (
                    <span className="text-blue-400 text-sm font-bold animate-bounce">
                      Slow ↓
                    </span>
                  )}
                  {fastPointer === index && (
                    <span className="text-green-400 text-sm font-bold animate-bounce">
                      Fast ↓
                    </span>
                  )}
                </div>

                {/* Node */}
                <div
                  className={`${getNodeColor(index)} ${getNodeOpacity(index)} 
                    w-16 h-16 rounded-lg flex items-center justify-center 
                    text-white text-2xl font-bold shadow-lg transform transition-all duration-500
                    ${(slowPointer === index || fastPointer === index) ? 'scale-110 ring-4 ring-white' : ''}`}
                >
                  {value}
                </div>

                {/* Index Label */}
                <span className="text-gray-400 text-xs mt-2">
                  idx: {index}
                </span>
              </div>

              {/* Arrow */}
              {index < nodes.length - 1 && (
                <div className="text-gray-500 text-3xl mx-2">→</div>
              )}
            </div>
          ))}

          {/* Null terminator */}
          <div className="flex flex-col items-center">
            <div className="h-8 mb-2">
              {fastPointer === nodes.length && (
                <span className="text-green-400 text-sm font-bold animate-bounce">
                  Fast ↓
                </span>
              )}
            </div>
            <div className="w-16 h-16 rounded-lg flex items-center justify-center 
              border-2 border-dashed border-gray-600 text-gray-500 text-sm font-bold">
              null
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-3">
          Step {step + 1} of {steps.length}
        </h3>
        <p className="text-gray-300 text-lg">{explanation}</p>
      </div>

      {/* Legend */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
            <span className="text-gray-300">Slow Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded"></div>
            <span className="text-gray-300">Fast Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
            <span className="text-gray-300">Normal Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded opacity-30"></div>
            <span className="text-gray-300">Removed Node</span>
          </div>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="mt-6 bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-3">Algorithm</h3>
        <div className="text-gray-300 space-y-2">
          <p>1. Create two pointers: fast and slow</p>
          <p>2. Move fast pointer n steps ahead</p>
          <p>3. Move both pointers until fast reaches the end</p>
          <p>4. Slow pointer will be just before the node to remove</p>
          <p>5. Skip the target node by updating the next pointer</p>
          <p className="mt-4 text-sm text-gray-400">
            Time Complexity: O(L) | Space Complexity: O(1)
          </p>
        </div>
      </div>
    </div>
  );
}
