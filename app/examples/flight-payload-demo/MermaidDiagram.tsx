"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

let initialized = false;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        fontSize: 12,
      });
      initialized = true;
    }

    const renderDiagram = async () => {
      if (containerRef.current && chart) {
        try {
          const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
        } catch (error) {
          console.error("Mermaid rendering error:", error);
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "#f9fafb",
        borderRadius: "0.5rem",
        overflow: "auto",
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
