#!/usr/bin/env node

import('../dist/index.js').catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 