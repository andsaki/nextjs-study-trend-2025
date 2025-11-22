"use client";

import { useState, useCallback } from "react";
import { MermaidDiagram } from "./MermaidDiagram";
import { DiagramModal } from "./DiagramModal";
import { colors, spacing } from "../../../src/design-system/tokens";

interface ClickableDiagramProps {
  chart: string;
  title: string;
}

export function ClickableDiagram({ chart, title }: ClickableDiagramProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div
        style={{
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onClick={handleOpen}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <MermaidDiagram chart={chart} />
        <div
          style={{
            position: "absolute",
            top: spacing.scale[2],
            right: spacing.scale[2],
            backgroundColor: colors.primitive.gray[900],
            color: colors.text.inverse,
            padding: `${spacing.scale[1]} ${spacing.scale[3]}`,
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            opacity: 0.8,
          }}
        >
          クリックで拡大 🔍
        </div>
      </div>

      <DiagramModal
        isOpen={isModalOpen}
        onClose={handleClose}
        chart={chart}
        title={title}
      />
    </>
  );
}
