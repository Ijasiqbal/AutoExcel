import { useEffect, useState } from 'react';
import Industry from '../components/Industry';
import Confirm from '../components/Confirm'; // Import the Confirm component if you have one
import '../styles/Chat.css';
import Fab from '@mui/material/Fab';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { OpenAI } from "openai";
import { config } from "dotenv"
import { set } from 'date-fns';
import giff from '../assets/loading3.gif';
import { BeatLoader } from 'react-spinners';
import * as XLSX from 'xlsx';




export default function Chat() {
  
  const [prompt, setPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPage, setConfirmPage] = useState(false);

  const columns = localStorage.getItem('columns');
  const columnNames = columns ? JSON.parse(columns) : [];


  const [industryPage, setIndustryPage] = useState(true);
  

  

  const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY ,dangerouslyAllowBrowser: true});

  function getStructuredDataExample() {
    const storedData = JSON.parse(localStorage.getItem('sheet') || '[]');
  
    const structuredData = storedData.map(row =>
      Object.fromEntries(
        columnNames.map((column, index) => [column, row[index] || null])
      )
    );
    structuredData.shift();// Remove the first element from the structuredData array

  
    console.log('Structured Data:', structuredData);
    return structuredData;
  }
  

  function download() {
    try {
        const storedData = JSON.parse(localStorage.getItem('sheet') || '[]');
        const ws = XLSX.utils.json_to_sheet(storedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'excel_data.xlsx');
    } catch (error) {
        console.error('Error while downloading Excel file:', error);
        alert('could not download file')        
    }
    
  }


  const handdleSend = async () => {
    setLoading(true);
    let industry = localStorage.getItem('industry');
    const sentData = `You are a text parser which takes unstructred data and return structured data in the form of json object,Given a context ,column names and unstructured data for a  csv file,  return json object for the data as ,\n\n{\n column1: relevant data,\ncolumn2: relevant data,\n......\n}\nif data is not present use null, return only the json object.\n\n Example for  a car dealership the columns are brand , make, manufacturing year,  ownership number, price, km run.\n\nunstructured data: '2017 Sigma 4 auto 4by4 delhi 1st 1.29lac km done, 21.5 lac '.\n\nstructured output: {\nmanufacturing year: 2017,\nkm_run: 129000,\nprice: 2150000,\nownership_no:1st,\nmake: ,\nbrand:\n}\n\n\ngiven context:${industry}, given columns: ${columnNames.join(' & ')},  given unstructured data: '${prompt}'.\ngive json output.`
    try {
        console.log("before await")
        const result = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages:[{role: "system",content: sentData,}]
        });
        console.log("after await");
        const jsonResponse = JSON.parse(result.choices[0].message.content);
        console.log("response", jsonResponse);
        setApiResponse(jsonResponse);
        setConfirmPage(true);
      } catch (e) {
        console.log(e);
        setApiResponse("Something is going wrong, Please try again.");
      }
      setLoading(false);

    console.log(sentData)
  }
  
  useEffect(() => {
  }, [industryPage]);

  return (
    <div className='chat-base'>
        <div className='loading'>
            <BeatLoader  color="#C9ADA7" loading={loading} size={25} />
        </div>
      {industryPage && <Industry onClose={() => setIndustryPage(false)} />}
      {confirmPage && <Confirm onClose={() => setConfirmPage(false)} data = {apiResponse}/>}
      <button className='btn1 position'onClick={download}>Download Updated Excel</button>
      <button onClick={getStructuredDataExample}>structured Data</button>
      <div className='text-area-container'>
        <textarea className='text-area' placeholder='Type your prompt here.' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
        <div className="buttons-container">
            <Fab color='primary' aria-label='voice-recognition' className='voice-icon' onClick={()=>{}}>
              <MicIcon />
            </Fab>
            <Fab color='primary' aria-label='send' className='send-icon' onClick={handdleSend}>
              <SendIcon />
            </Fab>
        </div>
        
      </div>
    </div>
  );
}
