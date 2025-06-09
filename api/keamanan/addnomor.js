const fs = require('fs').promises;
const path = require('path');

// Sesuaikan path file nomor.json sesuai lokasi kamu
const dbPath = path.join(__dirname, 'nomor.json');

async function loadData() {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(file);
  } catch (err) {
    // Kalau file belum ada, buat array kosong
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveData(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

module.exports = function (app) {
  app.get('/keamanan/addnomor', async (req, res) => {
    try {
      const { apikey, nomor } = req.query;

      // Validasi apikey
      if (!global.apikey || !Array.isArray(global.apikey) || !global.apikey.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      // Validasi nomor
      if (!nomor) {
        return res.json({ status: false, error: 'Parameter nomor wajib diisi' });
      }

      if (!/^62\d{6,}$/.test(nomor)) {
        return res.json({ status: false, error: 'Format nomor harus diawali dengan 62 dan minimal 8 digit' });
      }

      // Load data dari file
      const data = await loadData();

      // Cek nomor sudah ada
      if (data.includes(nomor)) {
        return res.json({ status: false, error: 'Nomor sudah ada' });
      }

      // Tambah nomor dan simpan
      data.push(nomor);
      await saveData(data);

      res.json({
        status: true,
        message: 'Nomor berhasil ditambahkan',
        data: nomor
      });
    } catch (err) {
      console.error('ERROR addnomor:', err);
      res.status(500).json({ status: false, error: 'Internal server error' });
    }
  });
};