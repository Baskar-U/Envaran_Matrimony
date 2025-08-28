import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  setupLikeCollections, 
  checkCollections, 
  testLikeFunctionality, 
  cleanupTestData 
} from '@/utils/setupLikeCollections';

export default function SetupTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSetup = async () => {
    setLoading(true);
    addResult('Starting setup...');
    
    try {
      await setupLikeCollections();
      addResult('✅ Setup completed successfully!');
    } catch (error) {
      addResult(`❌ Setup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    setLoading(true);
    addResult('Checking collections...');
    
    try {
      await checkCollections();
      addResult('✅ Collection check completed!');
    } catch (error) {
      addResult(`❌ Check failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    addResult('Testing like functionality...');
    
    try {
      await testLikeFunctionality();
      addResult('✅ Test completed successfully!');
    } catch (error) {
      addResult(`❌ Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    setLoading(true);
    addResult('Cleaning up test data...');
    
    try {
      await cleanupTestData();
      addResult('✅ Cleanup completed!');
    } catch (error) {
      addResult(`❌ Cleanup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Like Functionality Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={handleSetup} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Setting up...' : 'Setup Collections'}
              </Button>
              
              <Button 
                onClick={handleCheck} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Checking...' : 'Check Collections'}
              </Button>
              
              <Button 
                onClick={handleTest} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Testing...' : 'Test Functionality'}
              </Button>
              
              <Button 
                onClick={handleCleanup} 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Cleaning...' : 'Cleanup Test Data'}
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Results:</h3>
              <Button 
                onClick={handleClearResults} 
                variant="outline" 
                size="sm"
              >
                Clear Results
              </Button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-500">No results yet. Click a button above to start.</p>
              ) : (
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Click "Setup Collections" to create the required Firebase collections</li>
                <li>2. Click "Check Collections" to verify they exist</li>
                <li>3. Click "Test Functionality" to test the like system</li>
                <li>4. Go to Firebase Console to create indexes and update security rules</li>
                <li>5. Test the like functionality in your profiles page</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
