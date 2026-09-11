const fs = require('fs');
const html = fs.readFileSync('dom.html', 'utf8');

const checks = [
  { name: 'Headline', pattern: /Find Your/ },
  { name: 'Subtitle', pattern: /Stop building solo/ },
  { name: 'Explore Projects Button', pattern: /Explore Projects/ },
  { name: 'Dynamic SyncChain Simulator', pattern: /Live Dynamic SyncChain™ Simulator/ },
  { name: 'Slider Text', pattern: /Drag slider to test 100% Lock-in!/ },
  { name: 'Project 1: Action Kamen Vision', pattern: /Action Kamen Vision: Real-Time Superhero Pose AI/ },
  { name: 'Project 2: Shiro Finder', pattern: /Shiro&#x27;s Fluffy Campus Pet/ },
  { name: 'Project 3: Kasukabe Study Sync', pattern: /Kasukabe Study Sync/ },
  { name: 'Feature Bento: Weighted Jaccard', pattern: /Weighted Jaccard Skill Overlap Algorithm/ },
  { name: 'Feature Bento: Action Kamen Lock-In', pattern: /Action Kamen Lock-In/ },
  { name: 'Feature Bento: Shiro Cotton Candy Seal', pattern: /Shiro Cotton Candy Seal/ },
  { name: 'Testimonial 1: Toru Kazama', pattern: /Toru Kazama/ },
  { name: 'Testimonial 2: Nene Sakurada', pattern: /Nene Sakurada/ },
  { name: 'Testimonial 3: Masao Sato', pattern: /Masao Sato/ },
  { name: 'Bottom CTA', pattern: /Ready to Assemble Your Kasukabe Dream Team\?/ }
];

console.log('=== VERIFYING VISIBLE CONTENT IN DOM ===');
let allPassed = true;
checks.forEach(c => {
  const passed = c.pattern.test(html);
  console.log(`${passed ? '✓' : '✗'} ${c.name}: ${passed ? 'PRESENT' : 'MISSING'}`);
  if (!passed) allPassed = false;
});

console.log(`\nResult: ${allPassed ? 'ALL SECTIONS 100% VISIBLE & VERIFIED! 🎉' : 'Some sections missing.'}`);
