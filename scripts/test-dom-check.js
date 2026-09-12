const fs = require('fs');

const html = fs.readFileSync('e:/MiniInternetProduct/dashboard-dom.html', 'utf8');

console.log('--- DASHBOARD DOM REPORT ---');
console.log('Contains "Please Sign In":', html.includes('Please Sign In'));
console.log('Contains "Hey, Shinnosuke":', html.includes('Hey, Shinnosuke'));
console.log('Contains "Hey,":', html.includes('Hey,'));
console.log('Contains "Log In":', html.includes('Log In'));
console.log('Contains "Sign Up":', html.includes('Sign Up'));
