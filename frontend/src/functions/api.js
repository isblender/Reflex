// frontend/src/functions/api.js
const startMode = async (mode) => {
  try {
    // Check if the Electron API is available
    if (window.electronAPI && window.electronAPI.runPython) {
      const response = await window.electronAPI.runPython(mode);
      console.log('Python response:', response);
    } else {
      // Fallback: You can perform a fetch request or show an error if not in Electron.
      console.error('Electron API not available');
    }
  } catch (error) {
    console.error("Error starting mode:", error);
  }
};

export { startMode };