const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const pythonPath = '/usr/bin/python3'; // example path

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // preload.js will be loaded here – create it in the same folder as main.js
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development' || true) {
    // Load the React development server (make sure it's running at localhost:3000)
    win.loadURL('http://localhost:3000');
  } else {
    // In production, load the React build from the frontend folder
    win.loadFile(path.join(__dirname, '../frontend/build/index.html'));
  }
}

app.whenReady().then(createWindow);

ipcMain.handle('run-python', async (event, mode) => {
    return new Promise((resolve, reject) => {
      let scriptPath;
      if (mode === "1") {
        // Example: For Instagram Reels; adjust the path to your reels script if you have one
        scriptPath = path.join(__dirname, '../backend/games/reels.py');
      } else if (mode === "2") {
        // For Dinosaur Game
        scriptPath = path.join(__dirname, '../backend/games/dino.py');
      } else {
        return reject('Unknown mode');
      }
  
      // Spawn the Python process
      const pythonProcess = spawn(pythonPath, [scriptPath]);
  
      let output = '';
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
  
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data.toString()}`);
      });
  
      pythonProcess.on('close', (code) => {
        resolve(`Python process exited with code ${code}. Output: ${output}`);
      });
    });
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});