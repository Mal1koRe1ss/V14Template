const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    var count = 0;
    const eventsPath = path.join(__dirname, '..', 'events');
    
    if (!fs.existsSync(eventsPath)) {
        console.error(`[ERROR] Events directory not found: ${eventsPath}`);
        console.log('[INFO] Creating events directory...');
        fs.mkdirSync(eventsPath, { recursive: true });
        console.log(`[SUCCESS] Created events directory at: ${eventsPath}`);
        return;
    }

    const eventFiles = getAllFiles(eventsPath, '.js');
    
    if (eventFiles.length === 0) {
        console.warn('[WARNING] No event files found in events directory!');
        return;
    }

    console.log(`[INFO] Found ${eventFiles.length} event files to load`);

    eventFiles.forEach(filePath => {
        try {
            const event = require(filePath);
            const relativePath = path.relative(eventsPath, filePath);
            
            if (!event.name || !event.execute) {
                console.warn(`[WARNING] Invalid event structure in: ${relativePath}`);
                console.warn('   Required properties: name and execute');
                return;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
                console.log(`[INFO] Loaded ONCE event: ${event.name} (${relativePath})`);
                count++;
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
                console.log(`[INFO] Loaded event: ${event.name} (${relativePath})`);
                count++;
            }
        } catch (error) {
            console.error(`[ERROR] Error loading event from: ${filePath}`);
            console.error(error);
        }
    });

    console.log(`[INFO] Successfully loaded ${count} events.`);

};

function getAllFiles(dirPath, extension) {
    let results = [];
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(getAllFiles(fullPath, extension));
        } else if (file.endsWith(extension)) {
            results.push(fullPath);
        }
    });

    return results;
}