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

module.exports = function (app) {
  app.get('/addnomor', (req, res) => {
    try {
      const { apikey, nomor } = req.query;

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: 'Apikey invalid' });
      }

      if (!nomor) {
        return res.json({ status: false, error: 'Parameter nomor wajib diisi' });
      }

      const data = loadData();

      if (data.includes(nomor)) {
        return res.json({ status: false, error: 'Nomor sudah ada' });
      }

      data.push(nomor);
      saveData(data);

      res.json({
        status: true,
        message: 'Nomor berhasil ditambahkan',
        data: nomor
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });
};