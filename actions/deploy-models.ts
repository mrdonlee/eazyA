'use server'
import { Storage } from '@google-cloud/storage'
import { v1 } from '@google-cloud/aiplatform'
import { Buffer } from 'buffer';

// Configuration
const PROJECT_ID = 'ai-env-polkadot'
const LOCATION = 'us-central1' // Change to your preferred region
const BUCKET_NAME = 'polkadot-dataset-bucket'

// Authentication for Google Cloud
const auth = {
  credentials: {
    client_email: `gcp-user@ai-env-polkadot.iam.gserviceaccount.com`,
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDP2SvUYtUptGa0\nhrKUDDrhq8aVLN8iztR6BxrQsRj6QfE9CTf+sI6p48PuNq79dzn6wRv+9GFuFQnS\nW1hyjoFmpo9+AtrwweoEICzMHi99cDl7r1DLYvZQ3StO38sN/P2vHSx28VafgHE7\nex6cKhZE6DeTVFkqHQBvQMBC81MmCRf/ZDoqccDajXCPdyBPUJfMx7hItZegEzZb\nhRniuY/V6uAPfJJvQBGrQ8fr2tVSEnIzxIIXO2+3L06PlWcwWByTuqZlmCPddiSw\nSDt+n03SAGSBFmr7HmzQ31xPG3yJ3ml5UrEYZGi/mbhbfH03rylK6n7+Y6xaTEDg\nzz48I7UXAgMBAAECggEACn1X2G6qemHX4xl/LriVSilcqs+qbTvJ/mSYZlrhu1OT\npLRv5oMrmAheLYoF99XKD80qKApWVnNqXPruMk3d2vvh9waW3Rq0QEQNbrnBRM/i\nnsrgxXr3mmonEuJ5gXm4pdtPkKsqZ39Yd5uFlnULTav4jg9uNpFjIbo/WcGk+yDY\nAm+GDK1ofo8IJbhXFgky50FZpr925nvbmFHM9tLF8fIotNVWEe91Ibg04gYwl1z/\njbwYZueGk+TOWk4bUb+Iuko8QdW3iDboYLNxSRMsFw8FKYog+xtxAnwsAtezlkml\nX/Scdk2SUyo1ZU/qLh85x22CPBe6SlkxwWjAnOiH1QKBgQD5Lf6NdpCxV7dUkmNQ\n0F0/Y2WULmlwXMI/4YColocEr3++vVKsL5aJMSIfm++6rWG52OD3pG6fLmqBFTKt\nTo8Kq8L3ZcSsKtNEjU4389bUJ5sswreAbJ6q8HrIn+li6BQteqKF1DiX/k/sE/Me\n+Tig/yznegdkLX2vtb+L9Dx17QKBgQDViZFKY6hQLmQfQjJISbdTk+Ub2h/AyiB3\nN7GaT1o6mTusGXcJLHcGRt3Y5sPaeYhwoEQp+DRMsJmYLf7BKzXlYEnXAnWrVCyj\n31fS0UwycJuc3KZ4h0SnS53GktnUvzj7ID34zuhj6Zxq6Ki3NlfjxUZYRgSO6aAA\nxVGP3Tw2kwKBgFKsX/ivjfJJGBqHN0xo1YdigyFXBMSzAgAP4ZAN4V48nDW8uuFG\nKLv8AUZbhn55aCMxQfLoK4vE6rFJRzcZCXyQ4G8U5Nv6mX31JC6MSIq7WVDQifGi\nGEK+5v4JkHWwaoFsXt/oOZ60UfAR7mgoaBGCmHN0mV8zeLADrTnSHv1BAoGAMt1p\nEXo5rpfOW6/OAHAmzi7NhVvo8mhzYVKP6Lz8NjcoAq+yLio8U+9viuo1PwZyHLng\nYsrv0lDC1YAnTeY4GWJdVG0OkHglhgd+iQY4C0/NkYjx0oYOMXeOpq12W/oM3azp\ndin7K0mLa9/tyG6Wcvgb8I0FKvG1nlliO02suScCgYEAhrtAWn+AuTxNb6vacUfW\nwAwinZlspjtYT9XQc+HzNA0eze2X/nncnN9pj3FS3PQARMEph9gSB2w9P7/XLn2C\noNYfrJiSVp+AH/xAkD9i7/35mG+MikwAImaA8+tbdDr74UmdjfeTx/QUMBKNy1BI\n5BvRmcUFYvmK5/gFFuziEAI=\n-----END PRIVATE KEY-----\n`.replace(/\\n/g, '\n'),
  }
}

// Initialize clients
const storage = new Storage({
  projectId: PROJECT_ID,
  credentials: auth.credentials
})

// Initialize Vertex AI clients
const modelServiceClient = new v1.ModelServiceClient({
  projectId: PROJECT_ID,
  credentials: auth.credentials
})

const datasetServiceClient = new v1.DatasetServiceClient({
  projectId: PROJECT_ID,
  credentials: auth.credentials
})

// Generate a secure random key
const generateSecretKey = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Upload Python model file to Cloud Storage and register in Vertex AI
 */
export const uploadModelToVertexAI = async (
  pythonFile: File,
  additionalFiles: File[] = [], // For requirements.txt, additional modules, etc.
  modelDisplayName: string,
  modelDescription: string = "Model uploaded via API",
  modelFramework: string = "CUSTOM", // For Python files, typically use CUSTOM
  modelVersionId: string = "v1",
  modelLabels: Record<string, string> = {}
): Promise<{
  modelId: string,
  secretKey: string
}> => {
  try {
    // Generate unique folder name for model artifacts
    const folderName = `models/${modelDisplayName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const bucket = storage.bucket(BUCKET_NAME);
    const secretKey = generateSecretKey();
    
    // Upload Python model file
    const pythonFileBlob = bucket.file(`${folderName}/${pythonFile.name}`);
    const pythonFileBuffer = await pythonFile.arrayBuffer();
    await pythonFileBlob.save(Buffer.from(pythonFileBuffer));
    
    // Upload additional files if provided
    for (const file of additionalFiles) {
      const fileBlob = bucket.file(`${folderName}/${file.name}`);
      const fileBuffer = await file.arrayBuffer();
      await fileBlob.save(Buffer.from(fileBuffer));
    }
    
    // Create a manifest.json file to describe the model structure
    const manifestContent = JSON.stringify({
      mainPythonFile: pythonFile.name,
      modelFramework: modelFramework,
      pythonVersion: "3.9", // Specify Python version
      additionalFiles: additionalFiles.map(file => file.name),
      createdAt: new Date().toISOString()
    }, null, 2);
    
    const manifestBlob = bucket.file(`${folderName}/manifest.json`);
    await manifestBlob.save(manifestContent);
    
    // Register model in Vertex AI
    const modelUri = `gs://${BUCKET_NAME}/${folderName}`;
    const modelId = await registerModelInVertexAI(
      modelDisplayName,
      modelDescription,
      "", // No dataset ID required for direct model upload
      modelUri,
      modelFramework,
      modelVersionId,
      modelLabels
    );
    
    // Return the relevant information
    return {
      modelId: modelId,
      secretKey: secretKey
    };
  } catch (error) {
    console.error('Error in Vertex AI model upload process:', error);
    throw new Error(`Failed to upload and register model: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Register a model in Vertex AI Model Registry
 */
export const registerModelInVertexAI = async (
  modelDisplayName: string,
  modelDescription: string,
  datasetId: string,
  modelArtifactUri: string = "",
  modelFramework: string = "TENSORFLOW", // Options: TENSORFLOW, PYTORCH, SKLEARN, XGBOOST, CUSTOM
  modelVersionId: string = "v1",
  modelLabels: Record<string, string> = {}
): Promise<string> => {
  try {
    const parentResource = `projects/${PROJECT_ID}/locations/${LOCATION}`
    
    // If no model artifact URI is provided but dataset ID is, use the dataset as the artifact
    if (!modelArtifactUri && datasetId) {
      modelArtifactUri = datasetId
    }
    
    // Define the model resource
    const modelResource = {
      displayName: modelDisplayName,
      description: modelDescription,
      metadataSchemaUri: `gs://google-cloud-aiplatform/schema/model/metadata/${modelFramework.toLowerCase()}-1.0.0.yaml`,
      artifactUri: modelArtifactUri,
      containerSpec: {
        imageUri: getContainerImage(modelFramework),
        command: modelFramework === 'CUSTOM' ? ['python', 'predict.py'] : [], // Python file entry point for custom models
        args: modelFramework === 'CUSTOM' ? ['--model_path=$(AIP_MODEL_DIR)'] : [],
      },
      labels: {
        ...modelLabels,
        created_by: 'api',
        framework: modelFramework.toLowerCase(),
      },
      versionId: modelVersionId,
      supportedDeploymentResourcesTypes: [
        'AUTOMATIC',
        'DEDICATED_RESOURCES'
      ],
      supportedInputStorageFormats: ['JSON'],
      supportedOutputStorageFormats: ['JSON'],
    }
    
    // Register model in Vertex AI Model Registry
    const [modelResponse] = await modelServiceClient.uploadModel({
      parent: parentResource,
      model: modelResource as any
    })
    
    // Wait for the operation to complete
    const model = await modelResponse.promise()
    console.log('Model registered successfully:', model)

    // Return the model ID (name)
    return "Model Registered Successfully: ";
  } catch (error) {
    console.error('Error registering model in Vertex AI:', error)
    throw new Error(`Failed to register model: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Deploy a model to an endpoint
 */
export const deployModelToEndpoint = async (
  modelId: string,
  endpointDisplayName: string = "",
  machineType: string = "n1-standard-2",
  minReplicaCount: number = 1,
  maxReplicaCount: number = 1
): Promise<string> => {
  try {
    const endpointServiceClient = new v1.EndpointServiceClient({
      projectId: PROJECT_ID,
      credentials: auth.credentials
    });
    
    // Create endpoint if no specific name is provided
    if (!endpointDisplayName) {
      endpointDisplayName = `endpoint-${Date.now()}`;
    }
    
    // Create endpoint
    const [createEndpointResponse] = await endpointServiceClient.createEndpoint({
      parent: `projects/${PROJECT_ID}/locations/${LOCATION}`,
      endpoint: {
        displayName: endpointDisplayName,
      }
    });
    
    // Wait for endpoint creation to complete
    const [endpoint] = await createEndpointResponse.promise();
    
    // Deploy model to endpoint
    const deployResponse = await endpointServiceClient.deployModel({
      endpoint: endpoint.name,
      deployedModel: {
        model: modelId,
        displayName: `${endpointDisplayName}-deployment`,
        automaticResources: {
          minReplicaCount: minReplicaCount,
          maxReplicaCount: maxReplicaCount,
        },
        dedicatedResources: {
          machineSpec: {
            machineType: machineType,
          },
          minReplicaCount: minReplicaCount,
          maxReplicaCount: maxReplicaCount,
        }
      },
      trafficSplit: {
        "0": 100 // 100% traffic to this newly deployed model
      }
    });

    // Wait for deployment to complete
    await deployResponse[0].promise();
    
    // Wait for deployment to complete
    await deployResponse[0].promise();
    
    if (!endpoint.name) {
        throw new Error('Endpoint name is undefined or null');
    }
    return endpoint.name;
  } catch (error) {
    console.error('Error deploying model to endpoint:', error);
    throw new Error(`Failed to deploy model: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a serving function file for custom Python models
 */
export const createServingFunction = async (
  pythonFile: File,
  requirements: string[] = ["tensorflow", "numpy", "scikit-learn"]
): Promise<File> => {
  // Template for a serving function (predict.py)
  const servingTemplate = `
import os
import json
import numpy as np
import importlib.util
import sys

# Import the user's model file dynamically
spec = importlib.util.spec_from_file_location("user_model", "${pythonFile.name}")
user_model = importlib.util.module_from_spec(spec)
spec.loader.exec_module(user_model)

# Check if the user's model has necessary functions
if not hasattr(user_model, 'predict'):
    # If not, create a wrapper for common ML frameworks
    try:
        import joblib
        model_path = os.path.join(os.environ.get('AIP_MODEL_DIR', ''), 'model.joblib')
        if os.path.exists(model_path):
            loaded_model = joblib.load(model_path)
            
            def predict(instances):
                return loaded_model.predict(instances)
    except:
        pass
        
    try:
        import tensorflow as tf
        model_path = os.path.join(os.environ.get('AIP_MODEL_DIR', ''), 'model')
        if os.path.exists(model_path):
            loaded_model = tf.saved_model.load(model_path)
            
            def predict(instances):
                return loaded_model(instances).numpy().tolist()
    except:
        pass
else:
    predict = user_model.predict

def preprocess(request):
    """Preprocess the request body into desired format"""
    instances = request.get("instances", [])
    return instances

def postprocess(predictions):
    """Convert predictions to the expected format"""
    return {"predictions": predictions}

def handler(request):
    """Handle the prediction request"""
    try:
        # Parse request
        request_json = request
        instances = preprocess(request_json)
        
        # Get predictions
        predictions = predict(instances)
        
        # Format response
        response = postprocess(predictions)
        return response
    except Exception as e:
        return {"error": str(e)}
  `;
  
  // Create a requirements.txt file content
  const requirementsContent = requirements.join('\n');
  
  // Create the files
  const predictFile = new File([servingTemplate], "predict.py", { type: "text/plain" });
  const requirementsFile = new File([requirementsContent], "requirements.txt", { type: "text/plain" });
  
  return predictFile;
}

/**
 * Helper function to create a dataset in Vertex AI
 */
async function createVertexDataset(
  displayName: string,
  description: string,
  gcsDataPath: string,
  datasetType: string
): Promise<any> {
  const parentResource = `projects/${PROJECT_ID}/locations/${LOCATION}`
  
  // Choose metadata schema based on dataset type
  const metadataSchema = getMetadataSchema(datasetType)
  
  // Create dataset
  const [createDatasetResponse] = await datasetServiceClient.createDataset({
    parent: parentResource,
    dataset: {
      displayName,
      description,
      metadataSchemaUri: metadataSchema,
      labels: {
        source: 'cloud_storage',
        created_by: 'api'
      }
    }
  })
  
  // Wait for dataset creation to complete
  const [dataset] = await createDatasetResponse.promise()
  
  // Import data from GCS
  const importDataResponse = await datasetServiceClient.importData({
    name: dataset.name,
    importConfigs: [
      {
        gcsSource: {
          uris: [gcsDataPath]
        },
        importSchemaUri: metadataSchema
      }
    ]
  })
  
  // Wait for data import to complete
  await importDataResponse[0].promise()
  
  return dataset
}

/**
 * Detect dataset type based on file extension or name
 */
function detectDatasetType(filename: string): string {
  const lowerFilename = filename.toLowerCase()
  
  if (lowerFilename.includes('image') || /\.(jpg|jpeg|png|gif|bmp|tiff)$/.test(lowerFilename)) {
    return 'IMAGE'
  }
  
  if (lowerFilename.includes('text') || lowerFilename.includes('nlp') || /\.(txt|csv|tsv)$/.test(lowerFilename)) {
    return 'TEXT'
  }
  
  if (lowerFilename.includes('table') || lowerFilename.includes('tabular') || /\.(csv|xlsx|parquet)$/.test(lowerFilename)) {
    return 'TABULAR'
  }
  
  if (lowerFilename.includes('video') || /\.(mp4|avi|mov|wmv)$/.test(lowerFilename)) {
    return 'VIDEO'
  }
  
  // Default to TABULAR as the most common type
  return 'TABULAR'
}

/**
 * Get metadata schema URI based on dataset type
 */
function getMetadataSchema(datasetType: string): string {
  switch (datasetType) {
    case 'IMAGE':
      return 'gs://google-cloud-aiplatform/schema/dataset/metadata/image_1.0.0.yaml'
    case 'TEXT':
      return 'gs://google-cloud-aiplatform/schema/dataset/metadata/text_1.0.0.yaml'
    case 'TABULAR':
      return 'gs://google-cloud-aiplatform/schema/dataset/metadata/tabular_1.0.0.yaml'
    case 'VIDEO':
      return 'gs://google-cloud-aiplatform/schema/dataset/metadata/video_1.0.0.yaml'
    default:
      return 'gs://google-cloud-aiplatform/schema/dataset/metadata/tabular_1.0.0.yaml'
  }
}

/**
 * Get appropriate container image for model framework
 */
function getContainerImage(framework: string): string {
  switch (framework.toUpperCase()) {
    case 'TENSORFLOW':
      return 'gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-8:latest'
    case 'PYTORCH':
      return 'gcr.io/cloud-aiplatform/prediction/pytorch-cpu.1-11:latest'
    case 'SKLEARN':
      return 'gcr.io/cloud-aiplatform/prediction/sklearn-cpu.1-0:latest'
    case 'XGBOOST':
      return 'gcr.io/cloud-aiplatform/prediction/xgboost-cpu.1-4:latest'
    case 'CUSTOM':
      return 'gcr.io/cloud-aiplatform/prediction/tf-cpu.1-15:latest' // Basic image that can run Python
    default:
      return 'gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-8:latest'
  }
}

/**
 * Delete a dataset from Vertex AI
 */
export const deleteVertexDataset = async (datasetId: string): Promise<void> => {
  try {
    const [operation] = await datasetServiceClient.deleteDataset({
      name: datasetId
    })
    
    // Wait for deletion to complete
    await operation.promise()
    
  } catch (error) {
    console.error('Error deleting dataset:', error)
    throw new Error(`Failed to delete dataset: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Delete a model from Vertex AI
 */
export const deleteVertexModel = async (modelId: string): Promise<void> => {
  try {
    const [operation] = await modelServiceClient.deleteModel({
      name: modelId
    })
    
    // Wait for deletion to complete
    await operation.promise()
    
  } catch (error) {
    console.error('Error deleting model:', error)
    throw new Error(`Failed to delete model: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}