import { useEffect, useRef } from 'react';

export interface ImageCanvasProps {
  /** Ma trận cường độ xám, mỗi phần tử trong [0,1]. pixels[y][x]. */
  pixels: number[][];
  /** Kích thước hiển thị (px) — ảnh gốc được phóng to bằng nearest-neighbor. */
  displaySize?: number;
  label?: string;
}

/**
 * Vẽ một ma trận grayscale lên <canvas> bằng ImageData (tự viết trong thư mục ch6).
 * Ảnh gốc n×n được vẽ đúng độ phân giải rồi phóng to bằng CSS (pixelated).
 */
export default function ImageCanvas({ pixels, displaySize = 224, label }: ImageCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const h = pixels.length;
    const w = h > 0 ? pixels[0].length : 0;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const v = Math.max(0, Math.min(1, pixels[y][x]));
        const g = Math.round(v * 255);
        const idx = (y * w + x) * 4;
        img.data[idx] = g;
        img.data[idx + 1] = g;
        img.data[idx + 2] = g;
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [pixels]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={ref}
        style={{
          width: displaySize,
          height: displaySize,
          maxWidth: '100%',
          imageRendering: 'pixelated',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: '#000',
        }}
      />
      {label && (
        <div className="dim" style={{ fontSize: 12, marginTop: 6 }}>
          {label}
        </div>
      )}
    </div>
  );
}
