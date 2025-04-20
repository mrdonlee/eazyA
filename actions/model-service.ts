// app/actions/model-service.ts
'use server'

// Import all the functions from your model service file
import {
  uploadModelToVertexAI as uploadModel,
  deployModelToEndpoint as deployModel,
  deleteVertexModel,
  registerModelInVertexAI
} from './deploy-models' // Update the path to match your actual file structure

// Re-export the functions for use in client components
export const uploadModelToVertexAI = uploadModel
export const deployModelToEndpoint = deployModel
export const deleteModel = deleteVertexModel
export const registerModel = registerModelInVertexAI