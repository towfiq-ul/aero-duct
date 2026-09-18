import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Remove use client
content = content.replace(/"use client";\n?/g, '');

// Replace Next Links
content = content.replace(/import Link from "next\/link";/g, 'import { Link } from "react-router-dom";');
content = content.replace(/<Link\s+href=/g, '<Link to=');

// Fix Book buttons
content = content.replace(/href="\/book"/g, 'href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}');
content = content.replace(/to="\/book"/g, 'to={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}');
content = content.replace(/Book in 90 Seconds →/g, 'Call Service Now →');
content = content.replace(/Book Your Service in 90s →/g, 'Call To Schedule →');

// Fix India references
content = content.replace(/ and facility managers in India/g, '');

// Fix Passport references
content = content.replace(/ and deliver a permanent <strong>Digital Health Passport™<\/strong> with before\/after borescope video\./g, '.');
content = content.replace(/<span>Permanent Digital Health Passport™<\/span>/g, '');
content = content.replace(/We text you real-time GPS tracking 30 minutes before arrival\./g, '');
content = content.replace(/title="Digital Health Passport™"/g, 'title="Before & After Documentation"');
content = content.replace(/href="\/passport\/PASS-2026-0842"/g, 'href={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}');
content = content.replace(/to="\/passport\/PASS-2026-0842"/g, 'to={`tel:${import.meta.env.VITE_CONTACT_PHONE}`}');
content = content.replace(/View Sample Passport →/g, 'Call To Schedule →');
content = content.replace(/Open Live Demo Passport ↗/g, 'Call Service Now ↗');
content = content.replace(/Digital Duct Health Passport™/g, 'Before & After Documentation');

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Done");
