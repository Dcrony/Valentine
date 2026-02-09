import { useState, useRef, useEffect } from "react";

export default function MovingNoButton({ onClick }) {
  const [position, setPosition] = useState(null); // null means default layout position
  const buttonRef = useRef(null);

  // Audio for run away effect (optional, can be added later)

  const moveButton = () => {
    if (!buttonRef.current) return;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get button dimensions
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    // Calculate safe area (padding from edges)
    const padding = 20;

    // Generate random position within viewport
    // Ensure it doesn't spawn off-screen
    const maxLeft = viewportWidth - buttonWidth - padding;
    const maxTop = viewportHeight - buttonHeight - padding;

    const newLeft = Math.max(padding, Math.random() * maxLeft);
    const newTop = Math.max(padding, Math.random() * maxTop);

    setPosition({
      left: newLeft,
      top: newTop,
      position: 'fixed' // Allow it to break out of container
    });
  };

  const styles = {
    button: {
      padding: '12px 24px',
      backgroundColor: '#9ca3af', // Gray-400 initially
      color: 'white',
      borderRadius: '12px',
      border: 'none',
      fontSize: '1.25rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease', // Smooth transition for color/transform
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 50, // Ensure it stays on top when moving
      ...position ? {
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        transition: 'left 0.2s ease-out, top 0.2s ease-out', // Faster movement
        backgroundColor: '#ef4444', // Turn red when running
      } : {
        backgroundColor: '#6b7280', // Default gray
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      style={styles.button}
      onMouseEnter={moveButton}
      // On mobile, touch might trigger click, so we move on touch start too
      onTouchStart={moveButton}
      onClick={(e) => {
        // Just in case they preserve, clicking still works (or we can block it)
        onClick();
      }}
    >
      No 💔
    </button>
  );
}