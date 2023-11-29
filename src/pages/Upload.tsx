import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useTypewriter } from 'react-simple-typewriter';
import '../styles/Upload.css';
import { useRef, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

interface UploadProps {}

const Upload: React.FC<UploadProps> = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFileClick = () => {
    // Use optional chaining to avoid potential null/undefined error
    fileInputRef?.current?.click();
  };

  const [text] = useTypewriter({
    words: ['Auto', 'Simple', 'Easy', 'Anytime', 'Generate...'],
    loop: true,
    delaySpeed: 2000,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result instanceof ArrayBuffer) {
          const data = new Uint8Array(result);
          try {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Assuming you're reading the first sheet
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const columns = jsonData[0];

            localStorage.setItem('columns', JSON.stringify(columns));
            localStorage.setItem('sheet', JSON.stringify(jsonData));
          } catch (error) {
            console.error('Error while processing Excel file:', error);
            alert('Could not process the Excel file. Please try again.');
          }
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="upload-container">
      <img src={logo} alt="Logo" className="logo" />
      <div>
        <span className='typing'>
          Excel {text}
        </span>
      </div>
      <div>
        {/* Add any other elements or content as needed */}
      </div>
      <input
        className="link"
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
      />
      <button className='link color' onClick={handleChooseFileClick}>
        Choose File
      </button>
      <button className='btn1' onClick={() => navigate('/chat')}>
        Submit
      </button>
    </div>
  );
};

export default Upload;
