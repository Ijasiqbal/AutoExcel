// Chat.tsx
import { useEffect, useState } from 'react';
import Industry from '../components/Industry';
import Confirm from '../components/Confirm';
import '../styles/Chat.css';
import Fab from '@mui/material/Fab';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { OpenAI } from 'openai';
import { BeatLoader } from 'react-spinners';
import * as XLSX from 'xlsx';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPage, setConfirmPage] = useState(false);
  const [industryPage, setIndustryPage] = useState(true);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  function download() {
    try {
      const storedData = JSON.parse(localStorage.getItem('sheet') || '[]');
      const ws = XLSX.utils.json_to_sheet(storedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'excel_data.xlsx');
    } catch (error) {
      console.error('Error while downloading Excel file:', error);
      alert('Could not download file');
    }
  }

  const handdleSend = async () => {
    setLoading(true);
    const sentData = `Your prompt here...`; // Update with your prompt

    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: sentData }],
      });
      const jsonResponse = result.choices[0]?.message?.content ? JSON.parse(result.choices[0].message.content) : null;
      setApiResponse(jsonResponse);
      setConfirmPage(true);
    } catch (error) {
      console.error('Error during API call:', error);
      setApiResponse('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Add any necessary side effects or cleanup
  }, [industryPage]);

  return (
    <div className="chat-base">
      <div className="loading">
        <BeatLoader color="#C9ADA7" loading={loading} size={25} />
      </div>
      {industryPage && <Industry onClose={() => setIndustryPage(false)} onSave={(value) => setIndustryPage(value)} />}
      {confirmPage && <Confirm onClose={() => setConfirmPage(false)} data={apiResponse} />}
      <button className="btn1 position" onClick={download}>
        Download Updated Excel
      </button>
      <div className="text-area-container">
        <textarea
          className="text-area"
          placeholder="Type your prompt here."
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
        <div className="buttons-container">
          <Fab color="primary" aria-label="voice-recognition" className="voice-icon" onClick={() => {}}>
            <MicIcon />
          </Fab>
          <Fab color="primary" aria-label="send" className="send-icon" onClick={handdleSend}>
            <SendIcon />
          </Fab>
        </div>
      </div>
    </div>
  );
}
