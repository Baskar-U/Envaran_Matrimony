import React from 'react';

export default function ImageTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">QR Code Image Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Test 1: Direct Image</h2>
            <img 
              src="/payment.jpg" 
              alt="QR Code Test" 
              className="w-48 h-48 border-2 border-gray-300 rounded-lg object-contain"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'block';
              }}
            />
            <div className="hidden text-red-500 text-sm mt-2">
              ❌ Image failed to load
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Test 2: With Error Handling</h2>
            <div className="w-48 h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center">
              <img 
                src="/payment.jpg" 
                alt="QR Code Test" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center text-gray-500">
                        <p class="text-sm">❌ Image not found</p>
                        <p class="text-xs">/payment.jpg</p>
                      </div>
                    `;
                  }
                }}
                onLoad={() => {
                  console.log('✅ Image loaded successfully');
                }}
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Image Path Info</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p><strong>Path:</strong> /payment.jpg</p>
              <p><strong>Full URL:</strong> {window.location.origin}/payment.jpg</p>
              <p><strong>Current Location:</strong> {window.location.href}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
