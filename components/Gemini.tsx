
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google AI client once. It's safe to do this at the module level
// as the API key is read from environment variables and won't change during the session.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const Gemini: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setResponse('');
        setError('');

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setResponse(result.text);
        } catch (err) {
            console.error(err);
            setError('אירעה שגיאה. נסה שוב.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border border-slate-200 rounded-lg space-y-4 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">צריך עזרה? שאל את Gemini</h3>
            <p className="text-sm text-slate-600">לא בטוח מה לכתוב ללקוח? רוצה רעיונות לסדנה? שאל כל דבר.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="לדוגמה: 'כתוב לי מייל קצר ללקוח עם הצעת המחיר הזו'"
                    className="w-full h-24 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-slate-900"
                    disabled={loading}
                    aria-label="הזן בקשה ל-Gemini"
                />
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'חושב...' : 'שלח ל-Gemini'}
                </button>
            </form>

            {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

            {response && (
                <div>
                    <h4 className="font-bold text-slate-800 mb-2">תשובה מ-Gemini:</h4>
                    <pre className="bg-white p-4 rounded-md border border-slate-200 text-slate-800 whitespace-pre-wrap text-sm leading-relaxed font-sans">
                        {response}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Gemini;
