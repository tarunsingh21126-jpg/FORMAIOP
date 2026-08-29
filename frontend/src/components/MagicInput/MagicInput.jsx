import { useState } from 'react';
import { extractFromText } from '../../services/aiService';

/**
 * Free-text -> AI extraction UI. On success, calls onExtracted(data) so the
 * parent can push values into DynamicForm via setValue(). A failure here
 * never blocks the manual form below it.
 */
export default function MagicInput({ formId, onExtracted }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleExtract = async () => {
    if (!text.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const result = await extractFromText(formId, text);
      setStatus('success');
      setMessage('Information extracted successfully');
      onExtracted(result.data);
    } catch (err) {
      setStatus('error');
      setMessage('Unable to extract information. Please fill the form manually.');
    }
  };

  return (
    <div className="magic-input">
      <label htmlFor="magic-textarea" className="magic-input-label">
        ✨ Describe what happened
      </label>
      <textarea
        id="magic-textarea"
        rows={4}
        placeholder="e.g. I hit a deer on I-95 yesterday in my Honda. The windshield shattered."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="magic-input-actions">
        <button
          type="button"
          className="extract-btn"
          onClick={handleExtract}
          disabled={status === 'loading' || !text.trim()}
        >
          {status === 'loading' ? 'Analyzing your description...' : '✨ Extract Information'}
        </button>
      </div>

      {status === 'success' && <p className="magic-status magic-success">✓ {message}</p>}
      {status === 'error' && <p className="magic-status magic-error">{message}</p>}
    </div>
  );
}
