const GrainOverlay = () => (
  <div className="grain-overlay">
    <svg>
      <filter id="grain-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch">
          <animate attributeName="seed" from="0" to="100" dur="0.5s" repeatCount="indefinite" />
        </feTurbulence>
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  </div>
);

export default GrainOverlay;
