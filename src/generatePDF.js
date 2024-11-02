import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export async function generatePDF(articles, artPiece) {
    const htmlContent = generateHTML(articles, artPiece);

    const previewPath = path.join(process.cwd(), 'live-preview.html');
    fs.writeFileSync(previewPath, htmlContent, 'utf8');
    console.log(`Live preview available at: ${previewPath}`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Adjust path to locate 'styles.css' correctly
        const stylesPath = path.join(process.cwd(), 'src', 'styles.css');
        await page.addStyleTag({ path: stylesPath });

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: 'top-stories.pdf',
            format: 'A4',
            printBackground: true
        });
    } finally {
        await browser.close();
    }
}

function generateHTML(articles, artPiece) {
    const templatePath = path.join('src', 'template.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    const articleHtml = articles.map(article => `
        <article>
            <h3>${article.title}</h3>
            <p><strong>Byline:</strong> ${article.byline || 'N/A'}</p>
            <p>${article.abstract || 'No abstract available.'}</p>
        </article>
    `).join('');

    html = html
        .replace('{{date}}', new Date().toLocaleDateString())
        .replace('{{paintingImageUrl}}', artPiece.image)
        .replace('{{paintingTitle}}', artPiece.title)
        .replace('{{paintingArtist}}', artPiece.artist || 'Unknown')
        .replace('{{paintingMedium}}', artPiece.medium || 'Unknown')
        .replace('{{topStories}}', articleHtml)
        .replace('{{quote}}', '"Your inspirational quote here."')
        .replace('{{highTemp}}', '75')
        .replace('{{lowTemp}}', '60');

    return html;
}
