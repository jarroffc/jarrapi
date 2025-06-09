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

function saveData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = function (app, globalApiKey) {
  app.get('/keamanan/delnomor', (req, res) => {
    try {
      const { apikey, nomor } = req.query;

      if (!globalApiKey.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      if (!nomor) {
        return res.json({ status: false, error: 'Parameter nomor wajib diisi' });
      }

      if (!/^62\d{6,}$/.test(nomor)) {
        return res.json({ status: false, error: 'Format nomor tidak valid' });
      }

      const data = loadData();

      if (!data.includes(nomor)) {
        return res.json({ status: false, error: 'Nomor tidak ditemukan dalam database' });
      }

      const newData = data.filter(n => n !== nomor);
      saveData(newData);

      res.json({
        status: true,
        message: 'Nomor berhasil dihapus',
        sisa_data: newData
      });
    } catch (err) {
      console.error('Error /delnomor:', err);
      res.status(500).json({ status: false, error: 'Internal server error' });
    }
  });
};