import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { buildShortUrl } from '../../utils/formatters';

export const QRCodeModal = ({ isOpen, onClose, url }) => {
  const qrRef = useRef(null);

  if (!url) return null;
  const shortUrl = buildShortUrl(url.shortCode);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.drawImage(img, 0, 0, 400, 400);
      URL.revokeObjectURL(svgUrl);
      const link = document.createElement('a');
      link.download = `qr-${url.shortCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = svgUrl;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code" size="sm">
      <div className="flex flex-col items-center gap-6">
        <div
          ref={qrRef}
          className="p-4 bg-white rounded-xl border border-(--border) shadow-md"
        >
          <QRCodeSVG
            value={shortUrl}
            size={200}
            level="H"
            includeMargin={false}
            fgColor="#0f172a"
          />
        </div>

        <div className="w-full text-center space-y-1">
          <p className="text-xs text-(--text-muted)">Short URL</p>
          <p className="text-sm font-medium text-(--color-brand-600) break-all">{shortUrl}</p>
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button onClick={handleDownload} className="flex-1" id="qr-download-btn">
            Download PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
};
