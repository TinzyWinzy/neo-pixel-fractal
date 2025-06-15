import { h } from 'preact';
import { useState, useRef } from 'preact/hooks';

const defaultCode = `function FractalBox({ depth }) {
  if (depth === 0) return <div className="pixel-box" />;
  return (
    <div className="pixel-box">
      <FractalBox depth={depth - 1} />
    </div>
  );
}

render(<FractalBox depth={3} />);`;

export default function LiveCode({ initial = defaultCode, height = 180 }) {
  const [code, setCode] = useState(initial);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const iframeRef = useRef();

  function runCode() {
    setError('');
    const doc = `<!DOCTYPE html><html><head><style>
      .pixel-box { width: 40px; height: 40px; border: 2px solid #7755aa; margin: 6px; display: flex; align-items: center; justify-content: center; background: #f5f0e6; box-shadow: 0 0 8px 2px #c8e0f433; }
    </style></head><body><div id="root"></div><script crossorigin src="https://unpkg.com/preact@10.19.2/dist/preact.umd.js"></script><script crossorigin src="https://unpkg.com/preact@10.19.2/hooks/dist/hooks.umd.js"></script><script>const { h, render } = preact; const { useState } = preactHooks; try {\n${code}\n} catch(e) { document.body.innerHTML += '<pre style=\'color:#b00\'>' + e + '</pre>'; }</script></body></html>`;
    setOutput(doc);
    setTimeout(() => {
      if (iframeRef.current) iframeRef.current.srcdoc = doc;
    }, 10);
  }

  function resetCode() {
    setCode(initial);
    setOutput(null);
    setError('');
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
  }

  return (
    <div class="glass p-4 rounded border-2 border-mystic my-4">
      <div class="flex flex-col gap-2">
        <textarea
          class="font-mono p-2 rounded border border-mystic bg-beige text-graphite w-full"
          style={{ minHeight: height, fontSize: 14 }}
          value={code}
          onInput={e => setCode(e.target.value)}
          spellCheck={false}
        />
        <div class="flex gap-2 mt-1">
          <button class="px-3 py-1 rounded bg-bytegreen text-beige font-pixel border border-bytegreen hover:bg-amber hover:text-graphite hover:border-amber" onClick={runCode}>Run</button>
          <button class="px-3 py-1 rounded bg-mystic text-graphite font-pixel border border-mystic hover:bg-amber hover:text-graphite hover:border-amber" onClick={resetCode}>Reset</button>
          <button class="px-3 py-1 rounded bg-entropy text-beige font-pixel border border-entropy hover:bg-amber hover:text-graphite hover:border-amber" onClick={copyCode}>Copy</button>
        </div>
      </div>
      <div class="mt-4">
        <div class="font-pixel text-mystic mb-1">Live Preview:</div>
        <iframe
          ref={iframeRef}
          title="Live Preview"
          style={{ width: '100%', minHeight: 120, background: '#f5f0e6', borderRadius: 8, border: '1px solid #c8e0f4' }}
          sandbox="allow-scripts"
          srcDoc={output || ''}
        />
      </div>
      {error && <div class="text-entropy font-mono mt-2">{error}</div>}
    </div>
  );
} 