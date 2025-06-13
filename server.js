/// Oscar Jesús Trejo Rocha
/// 367630 - UACH
/// Universidad Autónoma de Chihuahua

const http = require('http');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

// Configuración
const PORT = 3000;
const UPLOADS_DIR = 'uploads';
const PUBLIC_DIR = 'public';

// Crear directorios si no existen
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR);
    // Crear archivo index.html por defecto
    fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), getDefaultHTML());
}

// Función para obtener el HTML por defecto
function getDefaultHTML() {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Servidor Node.js</title>
    </head>
    <body>
        <h1>Servidor funcionando correctamente</h1>
        <p>Modo: ${process.env.SERVER_MODE || 'Desconocido'}</p>
        <h2>Subir archivo</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="archivo" required>
            <button type="submit">Subir</button>
        </form>
    </body>
    </html>`;
}


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
                process.env.SERVER_MODE = "SÍNCRONO";
                startServer(true); // Síncrono
                break;
            case '2':
                process.env.SERVER_MODE = "ASÍNCRONO";
                startServer(false); // Asíncrono
                break;
            case '3':
                executeHolaMundo();
                rl.close();
                break;
            case '4':
                console.log("Saliendo...");
                rl.close();
                process.exit(0);
                break;
            default:
                console.log("Opción no válida. Saliendo...");
                rl.close();
                process.exit(1);
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

// Función para manejar archivos subidos
function handleFileUpload(req, res) {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    });
    
    req.on('end', () => {
        const data = Buffer.concat(body);
        
        // Parsear datos multipart manualmente (solución básica)
        const match = /name="archivo"; filename="(.*?)"\r\nContent-Type: .*?\r\n\r\n([\s\S]*?)\r\n------/.exec(data.toString());
        
        if (match && match[1] && match[2]) {
            const filename = match[1];
            const fileContent = match[2];
            
            fs.writeFile(path.join(UPLOADS_DIR, filename), fileContent, (err) => {
                if (err) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Error al guardar el archivo'
                    }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        filename: filename,
                        size: fileContent.length
                    }));
                }
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Formato de solicitud incorrecto'
            }));
        }
    });
}

// Función para servir archivos estáticos (corregida)
function serveStaticFile(res, filePath, contentType, responseCode = 200) {
    const fullPath = path.join(PUBLIC_DIR, filePath);
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                // Error del servidor
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Error');
            }
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}
// Función para listar archivos
function listFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(UPLOADS_DIR, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            const fileStats = files.map(file => {
                const stats = fs.statSync(path.join(UPLOADS_DIR, file));
                return {
                    name: file,
                    size: stats.size,
                    modified: stats.mtime
                };
            });

            resolve(fileStats);
        });
    });
}

// Función para manejar descarga de archivos (actualizada)
function handleFileDownload(req, res, filename) {
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(UPLOADS_DIR, decodedFilename);
    
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Archivo no encontrado</h1>');
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stats.size,
            'Content-Disposition': `attachment; filename*=UTF-8''${encodeRFC5987ValueChars(decodedFilename)}`
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
}

// Función para manejar eliminación de archivos (actualizada)
function handleFileDelete(req, res, filename) {
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(UPLOADS_DIR, decodedFilename);
    
    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>');
            } else {
                // Error del servidor
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Error al eliminar el archivo</h1>');
            }
            return;
        }

        // Retornar HTML mínimo (será ignorado por AJAX)
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Archivo eliminado con éxito</h1>');
    });
}

// Función auxiliar para codificación RFC5987 de nombres de archivo
function encodeRFC5987ValueChars(str) {
    return encodeURIComponent(str)
        .replace(/['()]/g, escape)
        .replace(/\*/g, '%2A')
        .replace(/%(?:7C|60|5E)/g, unescape);
}
// Modifica la función startServer para incluir las nuevas rutas:
function startServer(isSync) {
    const server = http.createServer(async (req, res) => {
        // Manejar subida de archivos
        if (req.url === '/upload' && req.method === 'POST') {
            handleFileUpload(req, res);
            return;
        }
        
        // Listar archivos (API)
        if (req.url === '/list-files' && req.method === 'GET') {
            try {
                const files = await listFiles();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(files));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al leer archivos' }));
            }
            return;
        }
        
        // Descargar archivos
        if (req.url.startsWith('/download/') && req.method === 'GET') {
            const filename = req.url.split('/')[2];
            handleFileDownload(req, res, filename);
            return;
        }
        
        // Eliminar archivos
        if (req.url.startsWith('/delete/') && req.method === 'GET') {
            const filename = req.url.split('/')[2];
            handleFileDelete(req, res, filename);
            return;
        }
        
        // Servir archivos estáticos
        let filePath = req.url;
        if (filePath === '/') filePath = '/index.html';
        
        // Determinar tipo de contenido
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
        }
        
        serveStaticFile(res, filePath, contentType);
    });

    server.listen(PORT, () => {
        console.log(`\nServidor en modo ${isSync ? 'SÍNCRONO' : 'ASÍNCRONO'} escuchando en http://localhost:${PORT}`);
        console.log("Presiona Ctrl + C para detenerlo\n");
    });

    process.on('SIGINT', () => {
        console.log("\nServidor detenido. Volviendo al menú...\n");
        server.close();
        showMenu();
    });
}
// Iniciar el menú
showMenu();
