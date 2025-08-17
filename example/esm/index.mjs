import { KyselyModule } from 'nestjs-kysely';

console.log('Testing ESM import...');

// Test that the module can be imported
if (KyselyModule) {
  console.log('✅ KyselyModule successfully imported via ESM import');
  console.log('Module type:', typeof KyselyModule);
  console.log('Module methods:', Object.getOwnPropertyNames(KyselyModule));
} else {
  console.log('❌ Failed to import KyselyModule');
  process.exit(1);
}

// Test forRoot method exists
if (typeof KyselyModule.forRoot === 'function') {
  console.log('✅ KyselyModule.forRoot method is available');
} else {
  console.log('❌ KyselyModule.forRoot method not found');
  process.exit(1);
}

console.log('🎉 ESM import test passed!');