// app/model-upload/page.tsx
'use client'

import { useState, useRef, FormEvent } from 'react'
import { uploadModelToVertexAI, deployModelToEndpoint } from '../actions/model-service'

export default function ModelUploadPage() {
  // Form state
  const [modelName, setModelName] = useState('')
  const [modelDescription, setModelDescription] = useState('')
  const [modelFramework, setModelFramework] = useState('CUSTOM')
  const [modelVersion, setModelVersion] = useState('v1')
  const [machineType, setMachineType] = useState('n1-standard-2')
  const [minReplicas, setMinReplicas] = useState(1)
  const [maxReplicas, setMaxReplicas] = useState(1)
  const [shouldDeploy, setShouldDeploy] = useState(false)

  // File state
  const [mainFile, setMainFile] = useState<File | null>(null)
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const mainFileInputRef = useRef<HTMLInputElement>(null)
  const additionalFilesInputRef = useRef<HTMLInputElement>(null)

  // Status state
  const [isUploading, setIsUploading] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [modelId, setModelId] = useState('')
  const [endpointId, setEndpointId] = useState('')

  // Handle main file selection
  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMainFile(e.target.files[0])
    }
  }

  // Handle additional files selection
  const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAdditionalFiles(Array.from(e.target.files))
    }
  }

  // Clear file selections
  const clearFiles = () => {
    setMainFile(null)
    setAdditionalFiles([])
    if (mainFileInputRef.current) mainFileInputRef.current.value = ''
    if (additionalFilesInputRef.current) additionalFilesInputRef.current.value = ''
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!mainFile) {
      setError('Please select a main Python model file')
      return
    }

    if (!modelName) {
      setError('Please enter a model name')
      return
    }

    setError('')
    setStatus('Uploading model files...')
    setIsUploading(true)

    try {
      // Upload model files
      const result = await uploadModelToVertexAI(
        mainFile,
        additionalFiles,
        modelName,
        modelDescription,
        modelFramework,
        modelVersion,
        { custom_label: 'ui_upload' }
      )

      setModelId(result.modelId)
      setStatus(`Model uploaded successfully! Model ID: ${result.modelId}`)

      // Deploy if requested
      if (shouldDeploy) {
        setStatus('Deploying model to endpoint...')
        setIsDeploying(true)
        
        const endpoint = await deployModelToEndpoint(
          result.modelId,
          `${modelName}-endpoint`,
          machineType,
          minReplicas,
          maxReplicas
        )
        
        setEndpointId(endpoint)
        setStatus(`Model deployed successfully! Endpoint: ${endpoint}`)
        setIsDeploying(false)
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload and Deploy ML Model</h1>
      
      {/* Status and Error messages */}
      {status && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {status}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Model Files</h2>
          
          <div className="border border-gray-300 rounded p-4">
            <label className="block mb-2">
              <span className="font-medium">Main Python Model File:</span>
              <input
                type="file"
                ref={mainFileInputRef}
                onChange={handleMainFileChange}
                accept=".py"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                disabled={isUploading || isDeploying}
              />
            </label>
            
            {mainFile && (
              <div className="text-sm text-gray-600 mt-1">
                Selected: {mainFile.name} ({(mainFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
          
          <div className="border border-gray-300 rounded p-4">
            <label className="block mb-2">
              <span className="font-medium">Additional Files (requirements.txt, etc):</span>
              <input
                type="file"
                ref={additionalFilesInputRef}
                onChange={handleAdditionalFilesChange}
                multiple
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                disabled={isUploading || isDeploying}
              />
            </label>
            
            {additionalFiles.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                Selected {additionalFiles.length} file(s):
                <ul className="list-disc pl-5 mt-1">
                  {additionalFiles.map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={clearFiles}
            className="text-sm text-gray-500 hover:text-gray-700"
            disabled={isUploading || isDeploying}
          >
            Clear selected files
          </button>
        </div>
        
        {/* Model Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Model Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Model Name:</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                disabled={isUploading || isDeploying}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Model Version:</label>
              <input
                type="text"
                value={modelVersion}
                onChange={(e) => setModelVersion(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
                disabled={isUploading || isDeploying}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Framework:</label>
              <select
                value={modelFramework}
                onChange={(e) => setModelFramework(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled={isUploading || isDeploying}
              >
                <option value="CUSTOM">Custom Python</option>
                <option value="TENSORFLOW">TensorFlow</option>
                <option value="PYTORCH">PyTorch</option>
                <option value="SKLEARN">Scikit-learn</option>
                <option value="XGBOOST">XGBoost</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Description:</label>
            <textarea
              value={modelDescription}
              onChange={(e) => setModelDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              disabled={isUploading || isDeploying}
            />
          </div>
        </div>
        
        {/* Deployment Options Section */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shouldDeploy"
              checked={shouldDeploy}
              onChange={(e) => setShouldDeploy(e.target.checked)}
              className="mr-2"
              disabled={isUploading || isDeploying}
            />
            <label htmlFor="shouldDeploy" className="font-medium">
              Deploy model to endpoint after upload
            </label>
          </div>
          
          {shouldDeploy && (
            <div className="border border-gray-300 rounded p-4 space-y-4">
              <h3 className="font-medium">Deployment Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Machine Type:</label>
                  <select
                    value={machineType}
                    onChange={(e) => setMachineType(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    disabled={isUploading || isDeploying}
                  >
                    <option value="n1-standard-2">n1-standard-2 (2 vCPUs)</option>
                    <option value="n1-standard-4">n1-standard-4 (4 vCPUs)</option>
                    <option value="n1-standard-8">n1-standard-8 (8 vCPUs)</option>
                    <option value="n1-highmem-2">n1-highmem-2 (High Memory)</option>
                    <option value="n1-highcpu-4">n1-highcpu-4 (High CPU)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1">Min Replicas:</label>
                  <input
                    type="number"
                    value={minReplicas}
                    onChange={(e) => setMinReplicas(parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    disabled={isUploading || isDeploying}
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Max Replicas:</label>
                  <input
                    type="number"
                    value={maxReplicas}
                    onChange={(e) => setMaxReplicas(parseInt(e.target.value))}
                    min={minReplicas}
                    max="20"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    disabled={isUploading || isDeploying}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 rounded font-medium ${
              isUploading || isDeploying
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={isUploading || isDeploying}
          >
            {isUploading ? 'Uploading...' : isDeploying ? 'Deploying...' : 'Upload Model'}
          </button>
        </div>
      </form>
      
      {/* Results Section (shown after successful upload/deployment) */}
      {modelId && (
        <div className="mt-8 border border-gray-300 rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Model Information</h2>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium">Model ID:</span>
              <code className="ml-2 p-1 bg-gray-100 rounded">{modelId}</code>
            </div>
            
            {endpointId && (
              <div>
                <span className="font-medium">Endpoint ID:</span>
                <code className="ml-2 p-1 bg-gray-100 rounded">{endpointId}</code>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Use these IDs to reference your model in your application code.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}