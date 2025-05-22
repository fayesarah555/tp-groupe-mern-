import React, { useState } from 'react';
import { productService } from '../../services/api';
import { validateImageFile } from '../../utils/helpers';

const UploadTest = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const response = await productService.testUpload(selectedFile);
      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const resetTest = () => {
    setSelectedFile(null);
    setResult(null);
    setError('');
    // Reset de l'input file
    const fileInput = document.getElementById('test-file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0',
      backgroundColor: '#f8f9fa'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
        🧪 Test d'Upload d'Image
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="test-file-input" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Sélectionner une image :
        </label>
        <input
          id="test-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          disabled={uploading}
        />
      </div>

      {selectedFile && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
          <strong>Fichier sélectionné :</strong> {selectedFile.name}<br />
          <strong>Taille :</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB<br />
          <strong>Type :</strong> {selectedFile.type}
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #c3e6cb'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>✅ Upload réussi !</h4>
          <p><strong>Message :</strong> {result.message}</p>
          <p><strong>Nom de fichier :</strong> {result.filename}</p>
          <p><strong>URL :</strong> <a href={result.fullUrl} target="_blank" rel="noopener noreferrer">{result.fullUrl}</a></p>
          
          {result.fullUrl && (
            <div style={{ marginTop: '10px' }}>
              <strong>Aperçu :</strong><br />
              <img 
                src={result.fullUrl} 
                alt="Upload test" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '150px', 
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedFile && !uploading ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed'
          }}
        >
          {uploading ? 'Upload en cours...' : 'Tester l\'Upload'}
        </button>

        <button
          onClick={resetTest}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Réinitialiser
        </button>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Formats autorisés :</strong> JPG, PNG, GIF, WebP<br />
        <strong>Taille maximale :</strong> 5 MB
      </div>
    </div>
  );
};

export default UploadTest;