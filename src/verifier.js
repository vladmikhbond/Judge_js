import { spawn } from 'child_process';

export default async function exec(code, timeout = 5000) 
{
  return new Promise((resolve, reject) => 
  {
    // Use the current Node binary (process.execPath) to ensure compatibility
    const child = spawn(process.execPath || 'node', ['-e', code], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });


    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      // Forcefully terminate the child if it exceeds timeout
      try {
        child.kill('SIGKILL');
      } catch (e) { }
    }, timeout);

    child.stderr.on('data', (chunk) => { stderr += String(chunk); });

    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      reject(err);
    });

    child.on('close', (exitCode, signal) => {
      if (timer) 
        clearTimeout(timer);
      // interpret result
      if (timedOut) 
        resolve("Wrong. Exceded timeout.");
      else if (stderr.includes("Error: OK"))
        resolve("OK.");
      else if (stderr.includes("Error: Wrong"))
        resolve("Wrong.");
      else if (stderr.includes("SyntaxError:")) {
        let i = stderr.indexOf("SyntaxError:");
        resolve(stderr.slice(i));
      } else 
        resolve("Error. " + stderr);
    });
  });
}
