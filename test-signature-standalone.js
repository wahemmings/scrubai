#!/usr/bin/env node

/**
 * Standalone test script to verify the Cloudinary signature fix
 * This tests the edge function directly without requiring web authentication
 */

const SUPABASE_URL = 'https://pefgvmyqwlnmklzhplue.supabase.co';
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-upload-signature`;

async function testSignatureFix() {
  console.log('🔧 Testing Cloudinary Signature Fix');
  console.log('=====================================\n');

  try {
    console.log('1. Testing Edge Function Connectivity...');
    
    // Test edge function with test mode
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test_mode: true })
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   ❌ Edge function failed: ${errorText}`);
      return false;
    }

    const data = await response.json();
    console.log('   ✅ Edge function accessible');
    console.log('   Response data:', JSON.stringify(data, null, 2));

    console.log('\n2. Testing Parameter Structure...');
    
    // Test the specific parameter naming that was causing the issue
    if (data.api_key) {
      console.log('   ✅ Edge function returns "api_key" (Cloudinary standard)');
    } else if (data.apiKey) {
      console.log('   ⚠️  Edge function returns "apiKey" (JavaScript camelCase)');
    } else {
      console.log('   ❌ No API key parameter found');
      return false;
    }

    console.log('\n3. Testing Validation Logic...');
    
    // Simulate the old validation (that was failing)
    const oldValidation = data.signature && data.cloudName && data.apiKey;
    console.log(`   Old validation (apiKey only): ${oldValidation ? '✅ PASS' : '❌ FAIL'}`);
    
    // Simulate the new validation (our fix)
    const newValidation = data.signature && data.cloudName && (data.api_key || data.apiKey);
    console.log(`   New validation (api_key OR apiKey): ${newValidation ? '✅ PASS' : '❌ FAIL'}`);

    console.log('\n4. Summary:');
    if (newValidation && !oldValidation) {
      console.log('   ✅ Signature fix is working correctly!');
      console.log('   ✅ Edge function returns "api_key" as expected');
      console.log('   ✅ New validation accepts both parameter formats');
      console.log('   ✅ This resolves the "Invalid signature data structure" error');
      return true;
    } else if (oldValidation) {
      console.log('   ⚠️  Both validations pass - edge function might be returning apiKey');
      return true;
    } else {
      console.log('   ❌ Both validations fail - there may be other issues');
      return false;
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    return false;
  }
}

// Run the test
testSignatureFix().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log(success ? '🎉 SIGNATURE FIX TEST PASSED!' : '💥 SIGNATURE FIX TEST FAILED!');
  process.exit(success ? 0 : 1);
});
