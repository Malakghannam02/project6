const apiUrl = 'http://localhost:3000/api';

// Helper function to check file extension
function isJsonFile(fileName) {
  return fileName.toLowerCase().endsWith('.json');
}

// Read file
async function readFile() {
  const fileName = document.getElementById('readFileName').value;
  if (!isJsonFile(fileName)) {
    alert('Only JSON files are allowed!');
    return;
  }
  
  const response = await fetch(`${apiUrl}/read?fileName=${fileName}`);
  const data = await response.json();
  document.getElementById('readContent').textContent = JSON.stringify(data.content, null, 2) || data.error;
}

// Write file
async function writeFile() {
  const fileName = document.getElementById('writeFileName').value;
  let content = document.getElementById('writeContent').value;

  if (!isJsonFile(fileName)) {
    alert('Only JSON files are allowed!');
    return;
  }

  try {
    content = JSON.parse(content); // التأكد من صحة JSON قبل الإرسال
  } catch (error) {
    alert('Invalid JSON format! Please enter a valid JSON object.');
    return;
  }

  await fetch(`${apiUrl}/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content })
  });
}

// Append file
async function appendFile() {
  const fileName = document.getElementById('appendFileName').value;
  const newContent = document.getElementById('appendContent').value;

  if (!isJsonFile(fileName)) return alert('Only JSON files are allowed!');

  await fetch(`${apiUrl}/append`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content: newContent })
  });

  alert('Content appended successfully!');
}


// Delete file
async function deleteFile() {
  const fileName = document.getElementById('deleteFileName').value;
  if (!isJsonFile(fileName)) {
    alert('Only JSON files are allowed!');
    return;
  }

  await fetch(`${apiUrl}/delete?fileName=${fileName}`, { method: 'DELETE' });
}

// Rename file
async function renameFile() {
  const oldName = document.getElementById('oldFileName').value;
  const newName = document.getElementById('newFileName').value;

  if (!isJsonFile(oldName) || !isJsonFile(newName)) {
    alert('Only JSON files are allowed!');
    return;
  }

  await fetch(`${apiUrl}/rename`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName })
  });
}

// Create directory 
async function createDirectory() {
  const dirName = document.getElementById('createDirName').value;
  await fetch(`${apiUrl}/create-dir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dirName })
  });
}

// Delete directory 
async function deleteDirectory() {
  const dirName = document.getElementById('deleteDirName').value;
  await fetch(`${apiUrl}/delete-dir?dirName=${dirName}`, { method: 'DELETE' });
}
