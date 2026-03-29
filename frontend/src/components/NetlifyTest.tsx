import { useState } from 'react';

/**
 * Netlify Functions test komponenti
 * Bu komponentni App.tsx ga qo'shib test qilishingiz mumkin
 */
export const NetlifyTest = () => {
  const [helloResult, setHelloResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHelloFunction = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/hello');
      const data = await response.json();
      setHelloResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setHelloResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">🧪 Netlify Functions Test</h3>
      
      <button
        onClick={testHelloFunction}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Hello Function'}
      </button>

      {helloResult && (
        <pre className="mt-3 p-3 bg-white rounded border text-sm overflow-auto">
          {helloResult}
        </pre>
      )}

      <p className="mt-3 text-sm text-gray-600">
        ℹ️ Bu test faqat Netlify da deploy qilingandan keyin ishlaydi.
        Local da test qilish uchun: <code className="bg-gray-200 px-1">netlify dev</code>
      </p>
    </div>
  );
};
