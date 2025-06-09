const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, './nomor.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
    return [];
  }
}

module.exports = function (app, globalApiKey) {
  app.get('/keamanan/listnomor', (req, res) => {
    try {
      const { apikey } = req.query;

      if (!globalApiKey.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      const data = loadData();

      res.json({
        status: true,
        message: 'Daftar nomor',
        data: data
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });
};