const fs = require('fs').promises;
const path = require('path');
const dbPath = path.join(__dirname, './nomor.json');

async function loadData() {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(file);
  } catch {
    return [];
  }
}

module.exports = function (app) {
  app.get('/keamanan/listnomor', async (req, res) => {
    try {
      const { apikey } = req.query;

      const apikeyList = Array.isArray(global.apikey) ? global.apikey : [global.apikey];
      if (!apikeyList.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      const data = await loadData();

      res.json({
        status: true,
        message: 'Daftar nomor',
        data: data
      });
    } catch (err) {
      console.error('Error /keamanan/listnomor:', err);
      res.status(500).json({ status: false, error: 'Internal server error' });
    }
  });
};