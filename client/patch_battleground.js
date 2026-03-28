const fs = require('fs');
let c = fs.readFileSync('src/pages/BattleGround.jsx', 'utf8');
c = c.replace(
  '{amount}\n                             </button>',
  '{amount === 0 ? "Free" : amount}\n                             </button>'
);
c = c.replace(
  'Set Coin Wager</label>',
  'Set Coin Wager</label>\n                       <p className="text-center text-xs text-amber-400 font-bold mb-2">Balance: {user?.coins ?? 0} Coins</p>'
);
fs.writeFileSync('src/pages/BattleGround.jsx', c, 'utf8');
console.log('Done. Has Free:', c.includes('Free'));
