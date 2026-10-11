import { CameraCard } from "@/components/CameraCard";

export function CameraGrid({
  streams,
  selectedCamera,
  multiview = true,
  onSelectCamera,
}: {
  streams: { id?: string; key?: string; title: string; src: string; isMain?: boolean; enabled?: boolean }[];
  selectedCamera?: string;
  multiview?: boolean;
  onSelectCamera?: (cameraId: string) => void;
}) {
  const visibleStreams = streams.filter((stream) => stream.enabled !== false);

  if (multiview) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleStreams.map((stream, index) => {
          const cameraId = stream.id ?? stream.key ?? `${stream.title}-${index}`;
          const isSelected = selectedCamera ? cameraId === selectedCamera : index === 0;

          return (
            <CameraCard
              key={cameraId}
              title={stream.title}
              src={stream.src}
              cameraNumber={index + 1}
              isSelected={isSelected}
              onSelect={() => onSelectCamera?.(cameraId)}
              isMain={index === 0}
            />
          );
        })}
      </div>
    );
  }

  const activeCamera =
    visibleStreams.find((stream) => (stream.id ?? stream.key) === selectedCamera) ?? visibleStreams[0];

  if (!activeCamera) {
    return null;
  }

  const activeCameraId = activeCamera.id ?? activeCamera.key ?? activeCamera.title;

  return (
    <div className="space-y-5">
      <CameraCard
        title={activeCamera.title}
        src={activeCamera.src}
        cameraNumber={visibleStreams.findIndex((stream) => (stream.id ?? stream.key) === activeCameraId) + 1}
        isMain
        isSelected
        onSelect={() => onSelectCamera?.(activeCameraId)}
      />
      <div className="grid gap-5 md:grid-cols-2">
        {visibleStreams
          .filter((stream) => (stream.id ?? stream.key) !== activeCameraId)
          .map((stream, index) => {
            const cameraId = stream.id ?? stream.key ?? `${stream.title}-${index}`;
            const currentNumber = visibleStreams.findIndex((item) => (item.id ?? item.key) === cameraId) + 1;

            return (
              <CameraCard
                key={cameraId}
                title={stream.title}
                src={stream.src}
                cameraNumber={currentNumber}
                isSelected={selectedCamera === cameraId}
                onSelect={() => onSelectCamera?.(cameraId)}
              />
            );
          })}
      </div>
    </div>
  );
}
