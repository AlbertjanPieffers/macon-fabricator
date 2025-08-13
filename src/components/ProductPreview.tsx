import { useEffect, useRef, useState } from 'react';
import { Grid, Maximize, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductPreviewProps {
  profile: string;
  length: string;
  operations?: Array<{
    type: string;
    position: number;
    size?: number;
    angle?: number;
  }>;
}

export const ProductPreview = ({ profile, length, operations = [] }: ProductPreviewProps) => {
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const [view2D, setView2D] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Profile dimensions (simplified for IPE and HEB profiles)
  const getProfileDimensions = (profileName: string) => {
    const profiles: Record<string, { height: number; width: number; thickness: number }> = {
      'IPE240': { height: 240, width: 120, thickness: 9.8 },
      'IPE300': { height: 300, width: 150, thickness: 10.7 },
      'HEB200': { height: 200, width: 200, thickness: 15 },
      'HEB300': { height: 300, width: 300, thickness: 19 },
      'L80x80': { height: 80, width: 80, thickness: 8 },
      'L100x100': { height: 100, width: 100, thickness: 10 }
    };
    return profiles[profileName] || { height: 240, width: 120, thickness: 10 };
  };

  const draw2DProfile = () => {
    const canvas = canvas2DRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Set transform
    ctx.save();
    ctx.translate(width / 2 + view2D.offsetX, height / 2 + view2D.offsetY);
    ctx.scale(view2D.scale, view2D.scale);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, width, height);
    }

    // Draw profile cross-section
    const profileDims = getProfileDimensions(profile);
    drawProfileCrossSection(ctx, profileDims);

    // Draw operations
    operations.forEach((op, index) => {
      if (op.type.includes('Hole')) {
        drawHole(ctx, op.position, op.size || 16, profileDims);
      }
    });

    ctx.restore();
  };

  const draw3DProfile = () => {
    const canvas = canvas3DRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);

    // Draw 3D isometric view
    const profileDims = getProfileDimensions(profile);
    const beamLength = Math.min(400, parseInt(length) / 20); // Scale down for display

    // Draw beam in isometric view
    draw3DBeam(ctx, profileDims, beamLength);

    // Draw operations
    operations.forEach((op) => {
      if (op.type.includes('Hole')) {
        const pos = (op.position / parseInt(length)) * beamLength;
        draw3DHole(ctx, pos - beamLength/2, op.size || 16, profileDims);
      }
    });

    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(0, 119, 170, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 20;
    const centerX = 0;
    const centerY = 0;

    for (let x = -width; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -height);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = -height; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-width, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(0, 119, 170, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width, 0);
    ctx.lineTo(width, 0);
    ctx.moveTo(0, -height);
    ctx.lineTo(0, height);
    ctx.stroke();
  };

  const drawProfileCrossSection = (ctx: CanvasRenderingContext2D, dims: { height: number; width: number; thickness: number }) => {
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 2;

    const scale = 1.5;
    const h = dims.height * scale;
    const w = dims.width * scale;
    const t = dims.thickness * scale;

    if (profile.startsWith('IPE') || profile.startsWith('HEB')) {
      // Draw I-beam cross section
      // Top flange
      ctx.fillRect(-w/2, -h/2, w, t);
      // Web
      ctx.fillRect(-t/2, -h/2, t, h);
      // Bottom flange
      ctx.fillRect(-w/2, h/2 - t, w, t);
    } else if (profile.startsWith('L')) {
      // Draw L-angle cross section
      ctx.fillRect(-w/2, -h/2, w, t);
      ctx.fillRect(-w/2, -h/2, t, h);
    }

    // Add dimension labels
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    ctx.font = '12px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.fillText(`${dims.height}mm`, 0, h/2 + 20);
    ctx.fillText(`${dims.width}mm`, 0, -h/2 - 10);
  };

  const drawHole = (ctx: CanvasRenderingContext2D, position: number, diameter: number, profileDims: any) => {
    const scale = 1.5;
    const radius = (diameter / 2) * scale;
    
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'hsl(var(--destructive))';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Add label
    ctx.fillStyle = 'hsl(var(--destructive))';
    ctx.font = '10px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.fillText(`⌀${diameter}`, 0, radius + 15);
  };

  const draw3DBeam = (ctx: CanvasRenderingContext2D, dims: any, length: number) => {
    const scale = 0.8;
    const h = dims.height * scale;
    const w = dims.width * scale;
    const t = dims.thickness * scale;

    // Isometric angles
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 1;

    // Draw 3D I-beam with isometric projection
    if (profile.startsWith('IPE') || profile.startsWith('HEB')) {
      // Front face
      drawIBeamFace(ctx, 0, 0, h, w, t, 'hsl(var(--primary))');
      
      // Side faces (showing depth)
      const depth = length;
      ctx.fillStyle = 'hsl(var(--primary) / 0.7)';
      
      // Top flange side
      drawQuad(ctx, [
        [-w/2, -h/2],
        [-w/2 + depth * cos30, -h/2 - depth * sin30],
        [w/2 + depth * cos30, -h/2 - depth * sin30],
        [w/2, -h/2]
      ]);
      
      // Web side
      drawQuad(ctx, [
        [t/2, -h/2],
        [t/2 + depth * cos30, -h/2 - depth * sin30],
        [t/2 + depth * cos30, h/2 - depth * sin30],
        [t/2, h/2]
      ]);
    }
  };

  const drawIBeamFace = (ctx: CanvasRenderingContext2D, x: number, y: number, h: number, w: number, t: number, color: string) => {
    ctx.fillStyle = color;
    // Top flange
    ctx.fillRect(x - w/2, y - h/2, w, t);
    // Web
    ctx.fillRect(x - t/2, y - h/2, t, h);
    // Bottom flange
    ctx.fillRect(x - w/2, y + h/2 - t, w, t);
  };

  const draw3DHole = (ctx: CanvasRenderingContext2D, position: number, diameter: number, profileDims: any) => {
    const radius = diameter * 0.8;
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);
    
    ctx.strokeStyle = 'hsl(var(--destructive))';
    ctx.lineWidth = 2;
    
    // Draw hole as ellipse on the face
    ctx.beginPath();
    ctx.ellipse(position * cos30, position * sin30, radius, radius * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const drawQuad = (ctx: CanvasRenderingContext2D, points: number[][]) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const handleZoom = (factor: number) => {
    setView2D(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale * factor))
    }));
  };

  const handleReset = () => {
    setView2D({ scale: 1, offsetX: 0, offsetY: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - view2D.offsetX, y: e.clientY - view2D.offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setView2D(prev => ({
      ...prev,
      offsetX: e.clientX - dragStart.x,
      offsetY: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    draw2DProfile();
  }, [profile, length, operations, view2D, showGrid]);

  useEffect(() => {
    draw3DProfile();
  }, [profile, length, operations]);

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={showGrid ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="gap-2"
          >
            <Grid className="w-4 h-4" />
            Grid
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleZoom(1.2)}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleZoom(0.8)}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {profile} • {length}mm • {operations.length} operations
        </div>
      </div>

      {/* Preview Tabs */}
      <Tabs defaultValue="2d" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="2d" className="macon-tab">2D Cross Section</TabsTrigger>
          <TabsTrigger value="3d" className="macon-tab">3D Isometric</TabsTrigger>
        </TabsList>
        
        <TabsContent value="2d" className="mt-4">
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <canvas
              ref={canvas2DRef}
              width={600}
              height={400}
              className="w-full h-80 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            <Move className="w-3 h-3 inline mr-1" />
            Click and drag to pan • Scroll to zoom
          </div>
        </TabsContent>
        
        <TabsContent value="3d" className="mt-4">
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <canvas
              ref={canvas3DRef}
              width={600}
              height={400}
              className="w-full h-80"
            />
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            Isometric view showing profile and operations
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};