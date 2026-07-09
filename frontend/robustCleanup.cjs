const fs = require('fs');

async function checkUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.status === 404) return false;
        if (res.status === 405 || res.status === 403) {
            const resGet = await fetch(url);
            if (resGet.status === 404) return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

async function run() {
    const mockDataPath = './src/data/mockProducts.js';
    let content = fs.readFileSync(mockDataPath, 'utf8');

    const urlRegex = /["']([^"']+)["']/g;
    let match;
    const urls = new Set();
    while ((match = urlRegex.exec(content)) !== null) {
        const url = match[1];
        if (url.startsWith('http')) {
            urls.add(url);
        }
    }

    const deadUrls = [];
    const urlList = Array.from(urls);
    for (let i = 0; i < urlList.length; i += 10) {
        const batch = urlList.slice(i, i + 10);
        const results = await Promise.all(batch.map(async u => {
            const alive = await checkUrl(u);
            if (!alive) {
                return u;
            }
            return null;
        }));
        results.forEach(res => {
            if (res) deadUrls.push(res);
        });
    }

    if (deadUrls.length > 0) {
        console.log('Dead URLs:', deadUrls);
        let lines = content.split('\n');
        lines = lines.filter(line => {
            return !deadUrls.some(dead => line.includes(dead));
        });
        fs.writeFileSync(mockDataPath, lines.join('\n'));
        console.log(`Removed ${deadUrls.length} dead URLs successfully!`);
    } else {
        console.log('No dead URLs found.');
    }
}

run();
