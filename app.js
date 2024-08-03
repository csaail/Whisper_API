const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const results = [];
        for (const file of req.files) {
            const transcription = await transcribeFile(file.path);
            const translate = await translateFile(file.path)
            results.push({ path: file.path, transcription: transcription });
            results.push({ path: file.path, transcription: translate })
            fs.unlinkSync(file.path); // Clean up file after processing
        }
        res.json(results);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error in transcription' });
    }
});


async function translateFile(filePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath), {
    contentType: 'audio/mpeg',
    filename: 'file.mp3'
  });
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'text');
  
  const response = await axios.post('https://api.openai.com/v1/audio/translations', formData, {
      headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
  });
  return response.data;
}


async function transcribeFile(filePath) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      contentType: 'audio/mpeg',
      filename: 'file.mp3'
    });
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'text');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
    });
    return response.data;
  } catch (e) {
    console.error('Failed to transcribe file:', e.response ? e.response.data.error : e.message);
    throw e;
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
