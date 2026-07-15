const { spawn, exec } = require('child_process');
const http = require('http');

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;

// Start Next.js development server
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

let opened = false;
const checkServer = () => {
  if (opened) return;
  
  const req = http.get(url, (res) => {
    // Next.js responds with 200 (or redirect/not found page if route config differs) when ready
    opened = true;
    console.log(`\n[Dev Server] Next.js is ready. Opening ${url} in your browser...`);
    const startCmd = process.platform === 'win32' 
      ? `start ${url}` 
      : process.platform === 'darwin' 
        ? `open ${url}` 
        : `xdg-open ${url}`;
    
    exec(startCmd, (err) => {
      if (err) {
        console.error('Failed to open browser automatically:', err.message);
      }
    });
  });

  req.on('error', () => {
    // Server is not ready yet, retry in 500ms
    setTimeout(checkServer, 500);
  });
};

// Start checking after 1 second
setTimeout(checkServer, 1000);

// Ensure next dev process is killed when the script terminates
process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
  process.exit();
});
process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit();
});
