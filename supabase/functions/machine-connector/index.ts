import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MACONGeneralSettings {
  _id?: string
  settingName: string
  value: any
  lastUpdated: Date
}

interface MACONProduct {
  _id?: string
  productId: string
  name: string
  profile: string
  length_mm: number
  operations: any[]
  created_at: Date
}

interface MACONBatch {
  _id?: string
  batchId: string
  name: string
  status: string
  priority: string
  operator: string
  products: string[]
  progress: number
  created_at: Date
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    
    // Get MongoDB connection string from environment
    const mongoUrl = Deno.env.get('MONGODB_URL') || 'mongodb://localhost:27017'
    const client = new MongoClient()
    
    await client.connect(mongoUrl)
    console.log('Connected to MongoDB')

    const maconGeneral = client.database('MACON_General')
    const maconProduction = client.database('MACON_Production')

    let result: any = {}

    switch (action) {
      case 'getGeneralSettings':
        const settings = maconGeneral.collection<MACONGeneralSettings>('GeneralSettings')
        result = await settings.find({}).toArray()
        break

      case 'getProducts':
        const products = maconProduction.collection<MACONProduct>('Products')
        result = await products.find({}).toArray()
        break

      case 'getBatches':
        const batches = maconProduction.collection<MACONBatch>('Batches')
        result = await batches.find({}).toArray()
        break

      case 'getAutomaticList':
        const automaticList = maconProduction.collection('AutomaticList')
        result = await automaticList.find({}).toArray()
        break

      case 'getCurrentMaterialData':
        const currentMaterial = maconProduction.collection('CurrentMaterialData')
        result = await currentMaterial.findOne({})
        break

      case 'getGeneralProductionData':
        const productionData = maconProduction.collection('GeneralProductionData')
        result = await productionData.findOne({})
        break

      case 'syncProduct':
        if (data?.product) {
          const products = maconProduction.collection<MACONProduct>('Products')
          const existingProduct = await products.findOne({ productId: data.product.productId })
          
          if (existingProduct) {
            await products.updateOne(
              { productId: data.product.productId },
              { $set: { ...data.product, lastUpdated: new Date() } }
            )
          } else {
            await products.insertOne({ ...data.product, created_at: new Date() })
          }
          result = { success: true, message: 'Product synced successfully' }
        }
        break

      case 'syncBatch':
        if (data?.batch) {
          const batches = maconProduction.collection<MACONBatch>('Batches')
          const existingBatch = await batches.findOne({ batchId: data.batch.batchId })
          
          if (existingBatch) {
            await batches.updateOne(
              { batchId: data.batch.batchId },
              { $set: { ...data.batch, lastUpdated: new Date() } }
            )
          } else {
            await batches.insertOne({ ...data.batch, created_at: new Date() })
          }
          result = { success: true, message: 'Batch synced successfully' }
        }
        break

      case 'updateMachineStatus':
        if (data?.machineId && data?.status) {
          const productionData = maconProduction.collection('GeneralProductionData')
          await productionData.updateOne(
            { machineId: data.machineId },
            { 
              $set: { 
                status: data.status, 
                lastUpdated: new Date(),
                ...(data.currentBatchId && { currentBatchId: data.currentBatchId })
              } 
            },
            { upsert: true }
          )
          result = { success: true, message: 'Machine status updated' }
        }
        break

      default:
        result = { error: 'Unknown action' }
    }

    await client.close()

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Machine connector error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})