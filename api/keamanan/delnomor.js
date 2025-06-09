const fs = require('fs').promises;
const path = require('path');
const dbPath = path.join(__dirname, 'nomor.json');

async function loadData() {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(file);
  } catch {
    return [];
  }
}

async function saveData(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

module.exports = function (app) {
  app.get('/keamanan/delnomor', async (req, res) => {
    try {
      const { apikey, nomor } = req.query;

      if (!global.apikey || !global.apikey.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      if (!nomor) {
        return res.json({ status: false, error: 'Parameter nomor wajib diisi' });
      }

      const data = await loadData();

      if (!data.includes(nomor)) {
        return res.json({ status: false, error: 'Nomor tidak ditemukan dalam database' });
      }

      const newData = data.filter(n => n !== nomor);
      await saveData(newData);

      res.json({
        status: true,
        message: 'Nomor berhasil dihapus',
        sisa_data: newData
      });
    } catch (err) {
      console.error('ERROR delnomor:', err.message);
      res.status(500).json({ status: false, error: 'Internal server error' });
    }
  });
};