import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const outputDirectory = fileURLToPath(new URL('../public/img/stats/', import.meta.url));

const icons = [
    {
        name: 'overview',
        colors: ['#7c6cf2', '#aa8cff'],
        drawing: `
            <rect x="34" y="34" width="24" height="24" rx="7" fill="white"/>
            <rect x="70" y="34" width="24" height="24" rx="7" fill="white" opacity=".78"/>
            <rect x="34" y="70" width="24" height="24" rx="7" fill="white" opacity=".78"/>
            <rect x="70" y="70" width="24" height="24" rx="7" fill="white"/>
        `
    },
    {
        name: 'article',
        colors: ['#3488f3', '#63b3ff'],
        drawing: `
            <path d="M42 28h31l17 17v50a7 7 0 0 1-7 7H42a7 7 0 0 1-7-7V35a7 7 0 0 1 7-7Z" fill="white"/>
            <path d="M73 28v17h17" fill="none" stroke="#3488f3" stroke-width="6" stroke-linejoin="round"/>
            <path d="M49 62h27M49 76h30M49 90h20" fill="none" stroke="#3488f3" stroke-width="6" stroke-linecap="round"/>
        `
    },
    {
        name: 'comment',
        colors: ['#20a884', '#51d3a6'],
        drawing: `
            <path d="M31 38a9 9 0 0 1 9-9h48a9 9 0 0 1 9 9v38a9 9 0 0 1-9 9H59L42 99V85h-2a9 9 0 0 1-9-9V38Z" fill="white"/>
            <circle cx="49" cy="57" r="5" fill="#20a884"/>
            <circle cx="64" cy="57" r="5" fill="#20a884"/>
            <circle cx="79" cy="57" r="5" fill="#20a884"/>
        `
    },
    {
        name: 'views',
        colors: ['#f59b24', '#ffc75c'],
        drawing: `
            <path d="M24 64s14-25 40-25 40 25 40 25-14 25-40 25-40-25-40-25Z" fill="white"/>
            <circle cx="64" cy="64" r="15" fill="#f59b24"/>
            <circle cx="64" cy="64" r="7" fill="white"/>
        `
    },
    {
        name: 'likes',
        colors: ['#ef5f7c', '#ff8fa5'],
        drawing: `
            <path d="M64 99 31 68c-19-18 6-46 27-28l6 6 6-6c21-18 46 10 27 28L64 99Z" fill="white"/>
        `
    }
];

function renderSvg({ colors, drawing }) {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
            <defs>
                <linearGradient id="background" x1="16" y1="12" x2="112" y2="116" gradientUnits="userSpaceOnUse">
                    <stop stop-color="${colors[0]}"/>
                    <stop offset="1" stop-color="${colors[1]}"/>
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#1f2937" flood-opacity=".2"/>
                </filter>
            </defs>
            <rect x="6" y="6" width="116" height="116" rx="30" fill="url(#background)" filter="url(#shadow)"/>
            ${drawing}
        </svg>
    `;
}

await mkdir(outputDirectory, { recursive: true });

await Promise.all(
    icons.map((icon) =>
        sharp(Buffer.from(renderSvg(icon)))
            .resize(200, 200)
            .webp({ quality: 92, alphaQuality: 100 })
            .toFile(`${outputDirectory}${icon.name}.webp`)
    )
);

console.log(`Generated ${icons.length} statistics icons in ${outputDirectory}`);
