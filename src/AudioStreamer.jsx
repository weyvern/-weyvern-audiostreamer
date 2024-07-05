import { useRef, useState } from 'react';

const AudioStreamer = ({
  label,
  loading,
  fetcher,
  containerClassName,
  audioClassName,
  buttonClassName
}) => {
  const ref = useRef(null);
  const [showControls, setShowControls] = useState(false);

  const getAudio = async () => {
    try {
      if (!prompt) throw new Error('Prompt is required');
      const res = await fetcher();
      if (!res.ok) throw new Error(await res.json());
      // Create a new MediaSource and set the audio source to the URL
      const mediaSource = new MediaSource();
      ref.current.src = URL.createObjectURL(mediaSource);
      setShowControls(true);
      // Add an event listener to the MediaSource to handle the sourceopen event
      mediaSource.addEventListener('sourceopen', async () => {
        // Create a new SourceBuffer and set the MIME type to audio/mpeg
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        // Get the reader from the response body
        const reader = res.body.getReader();
        // Create a queue to store the chunks of data. This is because appendBuffer can only be called when the source buffer is not updating
        const queue = [];
        // Create a function to process the queue
        const processQueue = () => {
          // If the source buffer is not updating and the queue is not empty
          if (!sourceBuffer.updating && queue.length > 0) {
            // Shift the first chunk from the queue
            const chunk = queue.shift();
            // Append the chunk to the source buffer
            sourceBuffer.appendBuffer(chunk);
          }
        };
        // After the updateend event is fired, check the queue
        sourceBuffer.addEventListener('updateend', () => processQueue());

        let result;
        // While the reader is not done
        while (!(result = await reader.read()).done) {
          // If the result is done, end the stream
          if (result.done) return mediaSource.endOfStream();
          // Push the next chunk to the queue
          queue.push(result.value);
          // Process the queue
          processQueue();
        }
      });
      // Play the audio
      ref.current.play();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;
  return (
    <div className={containerClassName}>
      <audio ref={ref} controls={showControls} className={audioClassName}></audio>
      <button className={buttonClassName} onClick={getAudio} disabled={showControls}>
        {label}
      </button>
    </div>
  );
};

export default AudioStreamer;
