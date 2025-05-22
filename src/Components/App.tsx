import { useState } from 'react';
import './App.css';

type ApiResponse = {
  data?: string;
  error?: string;
};

const App = () => {
  const [jsCode, setJsCode] = useState<string>('');
  const [transformedJsCode, setTransformedJsCode] = useState<string>('');
  const [isReceived, setIsReceived] = useState<boolean>(false);

  const MAX_TEXTAREA_LENGTH: number = 10_000;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        'http://localhost/JS%20minifier/backend/minify.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jsCode }),
        }
      );

      const data: ApiResponse = await response.json();

      if (response.ok) {
        setIsReceived(true);
        setTransformedJsCode(data?.data ?? '');
      } else {
        alert('Textarea must not be empty and must be js code');
      }
    } catch {
      alert('Textarea must not be empty and must be js code');
    }
  };

  const handleChangeTextAreaValue = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setJsCode(event.target.value);
  };

  const handleClear = (): void => {
    setIsReceived(false);
    setJsCode('');
    setTransformedJsCode('');
  };

  const handleCopyToClipboard = (): void => {
    navigator.clipboard.writeText(transformedJsCode);
    alert('Copied!');
  };

  return (
    <main>
      <h1>
        Online JavaScript Minifier Tool and Compressor, with Fast and Simple API
      </h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="js-code">Input JavaScript</label>
        <textarea
          name="jsCode"
          id="js-code"
          cols={30}
          rows={10}
          onChange={handleChangeTextAreaValue}
          value={jsCode}
          autoFocus={true}
        ></textarea>
        <div>
          <button type="submit">Minify</button>
        </div>
      </form>

      <div className="result-container">
        <label>Transformed output</label>
        <div className="result">
          {transformedJsCode.length > MAX_TEXTAREA_LENGTH
            ? 'Code to long - preview unavailable'
            : isReceived && transformedJsCode}
        </div>
        <div>
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleCopyToClipboard}>Copy to clipboard</button>
        </div>
      </div>
    </main>
  );
};

export default App;
