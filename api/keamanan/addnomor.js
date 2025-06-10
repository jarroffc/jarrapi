const fs = require('fs').promises;
const path = require('path');
const dbPath = path.join(__dirname, 'nomor.json');

// Fungsi untuk load data
async function loadData() {
  try {
    const file = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(file);
  } catch {
    return [];
  }
}

// Fungsi untuk simpan data
async function saveData(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

module.exports = function (app) {
  app.get('/keamanan/addnomor', async (req, res) => {
    try {
      const { apikey, nomor } = req.query;

      if (!global.apikey || !global.apikey.includes(apikey)) {
        return res.json({ status: false, creator: 'jarrOfficialL', error: 'Apikey invalid' });
      }

      if (!nomor) {
        return res.json({ status: false, creator: 'jarrOfficialL', error: 'Nomor tidak boleh kosong' });
      }

      const data = await loadData();

      // Cek duplikat
      if (data.includes(nomor)) {
        return res.json({ status: false, creator: 'jarrOfficialL', error: 'Nomor sudah ada' });
      }

      data.push(nomor);
      await saveData(data);

      res.json({ status: true, creator: 'jarrOfficialL', message: 'Nomor berhasil ditambahkan', data: nomor });
    } catch (err) {
      console.error('ERROR addnomor:', err.message);
      res.status(500).json({ status: false, creator: 'jarrOfficialL', error: 'Internal server error' });
    }
  });
};