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

async function saveData(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

module.exports = function (app) {
  app.get('/kemanan/addnomor', async (req, res) => {
    try {
      const { apikey, nomor } = req.query;

      if (!apikey || !global.apikey.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      if (!nomor) {
        return res.json({ status: false, error: 'Parameter nomor wajib diisi' });
      }

      if (!/^62\d{6,}$/.test(nomor)) {
        return res.json({ status: false, error: 'Format nomor harus diawali dengan 62' });
      }

      const data = await loadData();

      if (data.includes(nomor)) {
        return res.json({ status: false, error: 'Nomor sudah ada' });
      }

      data.push(nomor);
      await saveData(data);

      res.json({
        status: true,
        message: 'Nomor berhasil ditambahkan',
        data: nomor
      });
    } catch (err) {
      console.error('Error /addnomor:', err);
      res.status(500).json({ status: false, error: 'Internal server error' });
    }
  });
};