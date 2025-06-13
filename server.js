/// Oscar Jesús Trejo Rocha
/// 367630 - UACH
/// Universidad Autónoma de Chihuahua

const http = require('http');
const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');

// Configuración
const PORT = 3000;
const FILE_NAME = 'archivo.txt';

// Menú interactivo
function showMenu() {
  console.log("=== Modo de Ejecución del Servidor ===");
  console.log("1. Modo Síncrono (bloqueante)");
  console.log("2. Modo Asíncrono (no bloqueante)");
  console.log("3. Ejecutar Hola Mundo");
  console.log("4. Salir");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Selecciona el modo (1-4): ", (opcion) => {
    switch (opcion) {
      case '1':
        startServer(true); // Síncrono
        break;
      case '2':
        startServer(false); // Asíncrono
        break;
      case '3':
        executeHolaMundo();
        rl.close();
        break;
      case '4':
        console.log("Saliendo...");
        rl.close();
        break;
      default:
        console.log("Opción no válida. Saliendo...");
        rl.close();
    }
  });
}

// Función para ejecutar Hola Mundo internamente
function executeHolaMundo() {
  console.log("\n=== ¡Hola Mundo! ===");
  
  
  // Esperar entrada para volver al menú
  console.log("Presiona cualquier tecla para volver al menú...");
  process.stdin.resume();
  process.stdin.once('data', () => {
    showMenu();
  });
}

// Inicia el servidor en modo síncrono o asíncrono
function startServer(isSync) {
  const server = http.createServer((req, res) => {
    if (isSync) {
      // Modo SÍNCRONO (bloqueante)
      try {
        const data = fs.readFileSync(FILE_NAME, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`[SÍNCRONO] Contenido del archivo:\n${data}`);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("[SÍNCRONO] Error al leer el archivo\n");
      }
    } else {
      // Modo ASÍNCRONO (no bloqueante)
      fs.readFile(FILE_NAME, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end("[ASÍNCRONO] Error al leer el archivo\n");
        } else {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`[ASÍNCRONO] Contenido del archivo:\n${data}`);
        }
      });
    }
  });

  server.listen(PORT, () => {
    console.log(`\nServidor en modo ${isSync ? 'SÍNCRONO' : 'ASÍNCRONO'} escuchando en http://localhost:${PORT}`);
    console.log("Presiona Ctrl + C para detenerlo\n");
  });

  // Manejar Ctrl + C para cerrar el servidor
  process.on('SIGINT', () => {
    console.log("\nServidor detenido. Volviendo al menú...\n");
    server.close();
    showMenu();
  });
}

// Iniciar el menú
showMenu();
