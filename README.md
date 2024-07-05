# Audiostreamer

This simple React component can be used to stream an audio source from the body of a response and into an `<audio>` element.

## Installation

```bash
npm i @weyvern/audiostreamer
```

## Usage

The component needs a prop of `show`, true implies the component will be displayed. The component will render a `<button>` and `<audio>` elements. You can control the text in the button with `label`.
`fetcher` must be a function that returns a `Promise` that resolves to a `Response`, in this example, it's a function that returns a call to `fetch`.

You can customise how the component looks by passing `classNames` to `containerClassName`, `audioClassName` and `buttonClassName`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AudioStreamer
      label='Read it to me'
      show={true}
      fetcher={() =>
        fetch('<example-endpoint>', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json ',
            provider: 'open-ai',
            mode: import.meta.env.VITE_OPENAI_PROXY_MODE
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: 'echo',
            input: m.content
          })
        })
      }
      containerClassName='flex  items-center justify-end gap-5'
      audioClassName='w-full bg-transparent'
      buttonClassName='btn'
    />
  </React.StrictMode>
);
```
