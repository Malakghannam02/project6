const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const getFilePath = (fileName) => path.join(__dirname, '..', 'storage', path.basename(fileName));
const isValidJsonFile = (fileName) => path.extname(fileName).toLowerCase() === '.json';

router.get('/read', async (req, res) => {
    const fileName = req.query.fileName;
    if (!isValidJsonFile(fileName)) {
        return res.status(400).json({ error: 'Only JSON files are allowed' });
    }
    try {
        const filePath = getFilePath(fileName);
        const data = await fs.readFile(filePath, 'utf-8');
        res.json({ content: JSON.parse(data) });
    } catch (err) {
        res.status(404).json({ error: 'File not found' });
    }
});

router.post('/write', async (req, res) => {
    const { fileName, content } = req.body;
    if (!isValidJsonFile(fileName)) {
        return res.status(400).json({ error: 'Only JSON files are allowed' });
    }
    try {
        const filePath = getFilePath(fileName);
        await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
        res.json({ message: 'File written successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/append', async (req, res) => {
    const { fileName, content } = req.body;
    if (!isValidJsonFile(fileName)) {
        return res.status(400).json({ error: 'Only JSON files are allowed' });
    }
    try {
        const filePath = getFilePath(fileName);
        let data = [];

        try {
            const fileData = await fs.readFile(filePath, 'utf-8');
            data = JSON.parse(fileData);

           
            if (!Array.isArray(data)) {
                return res.status(400).json({ error: 'File content must be a JSON array' });
            }
        } catch (err) {
           
        }

        data.push(content);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        res.json({ message: 'Data appended successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete', async (req, res) => {
    const fileName = req.query.fileName;
    if (!isValidJsonFile(fileName)) {
        return res.status(400).json({ error: 'Only JSON files are allowed' });
    }
    try {
        await fs.unlink(getFilePath(fileName));
        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/rename', async (req, res) => {
    const { oldName, newName } = req.body;
    if (!isValidJsonFile(oldName) || !isValidJsonFile(newName)) {
        return res.status(400).json({ error: 'Only JSON files are allowed' });
    }
    try {
        await fs.rename(getFilePath(oldName), getFilePath(newName));
        res.json({ message: 'File renamed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
