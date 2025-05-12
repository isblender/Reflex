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

export const loginUser = async ({ username, password }) => {
  try {
    const res = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const signupUser = async ({ username, password }) => {
  try {
    const res = await fetch('http://localhost:5001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};