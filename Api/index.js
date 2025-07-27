module.exports = (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};