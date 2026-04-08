type Props = {
  screenshot: string;
};

export default function ScreenshotPreview({ screenshot }: Props) {
  return (
    <div className="bg-white/10 p-4 rounded">
      <img src={`data:image/png;base64,${screenshot}`} className="rounded" />
    </div>
  );
}
