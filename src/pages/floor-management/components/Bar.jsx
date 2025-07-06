import { Button } from "@/components/ui/button";
import { Group, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useFloorManagement } from "../hooks/use-Floor-Management";
import { checkOverlap } from "../lib/utils";
import { toast } from "react-toastify";
import { forwardRef } from "react";
import { X } from "lucide-react";

const Bar = forwardRef(({ barId, position, height, width, text }, ref) => {
  const {
    elements,
    setElements,
    selectedId,
    userRole,
    setSelectedId,
    stageSize,
  } = useFloorManagement();

  const bars = elements.filter((el) => el.type === "bar");

  // Bar drag end (update elements)
  const handleBarDragEnd = (e, barId) => {
    if (userRole !== "admin") return;
    const newPosition = {
      x: e.target.x(),
      y: e.target.y(),
    };
    const draggedBar = bars.find((bar) => bar.id === barId);
    if (!draggedBar) return;
    const width = draggedBar.width || 80;
    const height = draggedBar.height || 90;
    const draggedRect = {
      x: newPosition.x,
      y: newPosition.y,
      width,
      height,
    };
    const hasOverlap = bars.some((bar) => {
      if (bar.id === barId) return false;
      const barRect = {
        x: bar.x,
        y: bar.y,
        width: bar.width || 80,
        height: bar.height || 90,
      };
      return checkOverlap(draggedRect, barRect);
    });
    const isWithinBounds =
      newPosition.x >= 0 &&
      newPosition.y >= 0 &&
      newPosition.x + width <= stageSize.width - 270 &&
      newPosition.y + height <= stageSize.height;
    if (hasOverlap) {
      toast.warn("Cannot place bar here - it overlaps with another bar.");
      e.target.x(draggedBar.x);
      e.target.y(draggedBar.y);
      e.target.getStage().batchDraw();
      return;
    }
    if (!isWithinBounds) {
      toast.error("Cannot place bar outside the floor area.");
      e.target.x(draggedBar.x);
      e.target.y(draggedBar.y);
      e.target.getStage().batchDraw();
      return;
    }
    setElements((prev) =>
      prev.map((bar) =>
        bar.id === barId ? { ...bar, x: newPosition.x, y: newPosition.y } : bar
      )
    );
  };

  // Transformer for resizing bars (update elements)
  const handleTransformEnd = (e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const selectedBar = bars.find((bar) => bar.id === selectedId);
    if (!selectedBar) return;
    const newWidth = Math.max(50, selectedBar.width * scaleX);
    const newHeight = Math.max(30, selectedBar.height * scaleY);
    const newX = node.x();
    const newY = node.y();
    node.scaleX(1);
    node.scaleY(1);
    const transformedRect = {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };
    const hasOverlap = bars.some((bar) => {
      if (bar.id === selectedId) return false;
      const barRect = {
        x: bar.x,
        y: bar.y,
        width: bar.width,
        height: bar.height,
      };
      return checkOverlap(transformedRect, barRect);
    });
    const isWithinBounds =
      newX >= 0 &&
      newY >= 0 &&
      newX + newWidth <= stageSize.width - 270 &&
      newY + newHeight <= stageSize.height;
    if (hasOverlap) {
      toast.warn("Cannot resize bar - it would overlap with another bar.");
      node.x(selectedBar.x);
      node.y(selectedBar.y);
      node.getStage().batchDraw();
      return;
    }
    if (!isWithinBounds) {
      toast.error("Cannot resize bar - it would go outside the floor area.");
      node.x(selectedBar.x);
      node.y(selectedBar.y);
      node.getStage().batchDraw();
      return;
    }
    setElements((prev) =>
      prev.map((bar) =>
        bar.id === selectedId
          ? {
              ...bar,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
            }
          : bar
      )
    );
  };

  const deleteElement = () =>
    setElements((prev) => prev.filter((el) => el.id !== barId));
  return (
    <Group
      x={position.x}
      y={position.y}
      draggable={userRole === "admin" && selectedId !== barId}
      onClick={() => setSelectedId(barId)}
      onDragEnd={(e) => handleBarDragEnd(e, barId)}
      ref={ref}
      onTransform={handleTransformEnd}
      className="relative"
    >
      {selectedId === barId && (
        <Html>
          <Button
            className="rounded-full bg-destructive size-6 text-white cursor-pointer translate-x-1/2"
            style={{
              position: "absolute",
              top: -12,
              right: 0,
            }}
            onClick={deleteElement}
          >
            <X className="size-4" />
          </Button>
        </Html>
      )}
      <Rect
        width={width}
        height={height}
        fill="#f3f4f9"
        stroke={selectedId === barId ? "#2563eb" : "#4b5563"}
        strokeWidth={selectedId === barId ? 3 : 2}
      />
      <Text
        x={width / 2}
        y={height / 2}
        text={text}
        fontSize={16}
        fill="#4b5563"
        align="center"
        verticalAlign="middle"
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
      />
    </Group>
  );
});

Bar.displayName = "Bar";

export default Bar;
