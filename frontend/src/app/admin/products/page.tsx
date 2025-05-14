'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Trash2, Edit, Image as ImageIcon, Upload, X, Check } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import axios from 'axios'

// Type definitions
type Attribute = {
  id: number
  name: string
}

type Unit = {
  id: number
  name: string
  full_name: string
}

type ProductAttribute = {
  id_attribute: number
  value: string
  id_unit: number | null
}

type Product = {
  id: number
  name: string
  slug: string
  description: string
  is_done: boolean
  id_category: number
  id_city: number
  attributes: ProductAttribute[]
  image?: string
}

type FormData = {
  name: string
  slug: string
  description: string
  is_done: boolean
  id_category: number
  id_city: number
  attributes: ProductAttribute[]
}

type CurrentAttribute = {
  id_attribute: number
  value: string
  id_unit: number | null
}

type NewUnitData = {
  name: string
  full_name: string
}

export default function ProductsAdminPage() {
  // State for products
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // State for deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)

  // State for images
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false)
  const [currentProductId, setCurrentProductId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for form
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list')
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    is_done: true,
    id_category: 0,
    id_city: 0,
    attributes: []
  })

  // State for attributes
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [currentAttribute, setCurrentAttribute] = useState<CurrentAttribute>({
    id_attribute: 0,
    value: '',
    id_unit: null
  })

  // State for creating attributes/units
  const [newAttributeName, setNewAttributeName] = useState<string>('')
  const [newUnitData, setNewUnitData] = useState<NewUnitData>({
    name: '',
    full_name: ''
  })
  const [creatingAttribute, setCreatingAttribute] = useState<boolean>(false)
  const [creatingUnit, setCreatingUnit] = useState<boolean>(false)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Using axios for better error handling
        const [productsRes, attributesRes, unitsRes] = await Promise.all([
          axios.get<Product[]>('http://127.0.0.1:8000/api/products/'),
          axios.get<Attribute[]>('http://127.0.0.1:8000/api/attributes/'),
          axios.get<Unit[]>('http://127.0.0.1:8000/api/units/')
        ])

        setProducts(productsRes.data)
        setAttributes(attributesRes.data)
        setUnits(unitsRes.data)
      } catch (error) {
        toast.error('Failed to load data')
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>('http://127.0.0.1:8000/api/products/')
      setProducts(res.data)
    } catch (error) {
      toast.error('Failed to fetch products')
      console.error('Error fetching products:', error)
    }
  }

  // Create product
  const createProduct = async () => {
    try {
      const res = await axios.post<Product>('http://127.0.0.1:8000/api/products/', formData)
      
      toast.success('Product created successfully')
      setFormMode('list')
      fetchProducts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    }
  }

  // Update product
  const updateProduct = async () => {
    if (!currentProduct) return
    
    try {
      const res = await axios.put<Product>(
        `http://127.0.0.1:8000/api/products/${currentProduct.id}`,
        formData
      )
      
      toast.success('Product updated successfully')
      setFormMode('list')
      fetchProducts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    }
  }

  // Delete product
  const handleDelete = async () => {
    if (!productToDelete) return
    
    setDeleting(true)
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${productToDelete.id}`)

      toast.success('Product deleted successfully')
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  // Update product image
  const handleImageUpdate = async () => {
    if (!currentProductId || !selectedFile) return
  
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const res = await axios.patch<Product>(
        `http://127.0.0.1:8000/api/products/${currentProductId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const updatedProduct = res.data
      
      setProducts(prev => prev.map(p => 
        p.id === currentProductId ? { ...p, image: updatedProduct.image } : p
      ))
      
      toast.success('Image updated successfully')
      setImageDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update image')
    } finally {
      setUploading(false)
    }
  }

  // Create attribute
  const createAttribute = async () => {
    if (!newAttributeName.trim()) return
    
    setCreatingAttribute(true)
    try {
      const res = await axios.post<Attribute>('http://127.0.0.1:8000/api/attributes/', {
        name: newAttributeName
      })

      const newAttr = res.data
      setAttributes(prev => [...prev, newAttr])
      setNewAttributeName('')
      toast.success('Attribute created successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create attribute')
    } finally {
      setCreatingAttribute(false)
    }
  }

  // Create unit
  const createUnit = async () => {
    if (!newUnitData.name.trim() || !newUnitData.full_name.trim()) return
    
    setCreatingUnit(true)
    try {
      const res = await axios.post<Unit>('http://127.0.0.1:8000/api/units/', newUnitData)

      const newUnit = res.data
      setUnits(prev => [...prev, newUnit])
      setNewUnitData({ name: '', full_name: '' })
      toast.success('Unit created successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create unit')
    } finally {
      setCreatingUnit(false)
    }
  }

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddAttribute = () => {
    if (!currentAttribute.id_attribute || !currentAttribute.value) {
      toast.error('Please select attribute and enter value')
      return
    }

    setFormData(prev => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          id_attribute: currentAttribute.id_attribute,
          value: currentAttribute.value,
          id_unit: currentAttribute.id_unit
        }
      ]
    }))

    setCurrentAttribute({
      id_attribute: 0,
      value: '',
      id_unit: null
    })
  }

  const handleRemoveAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formMode === 'create') {
      createProduct()
    } else {
      updateProduct()
    }
  }

  // Helper functions
  const openEditForm = (product: Product) => {
    setCurrentProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      is_done: product.is_done,
      id_category: product.id_category,
      id_city: product.id_city,
      attributes: product.attributes || []
    })
    setFormMode('edit')
  }

  const openCreateForm = () => {
    setCurrentProduct(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_done: true,
      id_category: 0,
      id_city: 0,
      attributes: []
    })
    setFormMode('create')
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image upload dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <DialogTitle>Update Product Image</DialogTitle>
              <DialogDescription>
                Upload a new image for the product
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {previewUrl ? (
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-md object-cover shadow-md"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center justify-center w-full h-40 bg-gray-100 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </motion.div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSelectedFile(file)
                    const reader = new FileReader()
                    reader.onload = () => setPreviewUrl(reader.result as string)
                    reader.readAsDataURL(file)
                  }
                }}
                accept="image/*"
                className="hidden"
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Image
                </Button>
              </motion.div>
            </div>
            
            <DialogFooter className="mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImageUpdate}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? 'Uploading...' : 'Save'}
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Main content */}
      {formMode === 'list' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="space-y-8"
        >
          <motion.div 
            variants={fadeIn}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <motion.h1 
              className="text-3xl font-bold text-gray-900 dark:text-white"
              variants={fadeIn}
            >
              Products Management
            </motion.h1>
            
            <motion.div 
              className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
              variants={fadeIn}
            >
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Button 
                onClick={openCreateForm} 
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </motion.div>
          </motion.div>

          {loading ? (
            <motion.div 
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={fadeIn}
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="p-0 relative group">
                        <motion.div 
                          className="relative aspect-square cursor-pointer"
                          onClick={() => {
                            setCurrentProductId(product.id)
                            setPreviewUrl(product.image ? `http://127.0.0.1:8000/${product.image}` : null)
                            setImageDialogOpen(true)
                          }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          {product.image ? (
                            <Image
                              src={`http://127.0.0.1:8000/${product.image}`}
                              alt={product.name}
                              fill
                              className="object-cover rounded-t-lg"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ImageIcon className="h-8 w-8 text-white" />
                          </div>
                        </motion.div>
                      </CardHeader>
                      
                      <CardContent className="p-6 flex-grow space-y-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {product.name}
                        </CardTitle>
                        
                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={product.is_done ? "default" : "secondary"} 
                            className="text-xs"
                          >
                            {product.is_done ? 'Done' : 'In Progress'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Category: {product.id_category}
                          </Badge>
                        </div>
                        
                        {product.attributes?.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2 text-gray-700">Attributes:</h4>
                            <div className="flex flex-wrap gap-2">
                              {product.attributes.map((attr, index) => {
                                const attribute = attributes.find(a => a.id === attr.id_attribute)
                                const unit = attr.id_unit ? units.find(u => u.id === attr.id_unit) : null
                                
                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                  >
                                    <Badge variant="outline" className="text-xs">
                                      {attribute?.name || 'Unknown'}: {attr.value}
                                      {unit && ` ${unit.name}`}
                                    </Badge>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="flex justify-between p-4 border-t bg-gray-50/50">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditForm(product)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            setProductToDelete(product)
                            setDeleteDialogOpen(true)
                          }}
                          className="hover:bg-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          
          {!loading && filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-500">
                {searchTerm ? 'No products found' : 'No products available'}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Create/Edit form */}
      {(formMode === 'create' || formMode === 'edit') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h2 
              className="text-2xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {formMode === 'create' ? 'Create New Product' : `Edit ${currentProduct?.name}`}
            </motion.h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setFormMode('list')}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Name*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-gray-700">Slug*</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  required
                  className="focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  className="focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_category" className="text-gray-700">Category ID*</Label>
                <Input
                  id="id_category"
                  name="id_category"
                  type="number"
                  value={formData.id_category}
                  onChange={handleFormChange}
                  required
                  className="focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_city" className="text-gray-700">City ID*</Label>
                <Input
                  id="id_city"
                  name="id_city"
                  type="number"
                  value={formData.id_city}
                  onChange={handleFormChange}
                  required
                  className="focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center h-5">
                  <input
                    id="is_done"
                    name="is_done"
                    type="checkbox"
                    checked={formData.is_done}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
                <Label htmlFor="is_done" className="text-gray-700">Is Done</Label>
              </div>
            </motion.div>

            <motion.div 
              className="border-t pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Attributes</h3>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-2">
                  <Label>Attribute</Label>
                  <select
                    value={currentAttribute.id_attribute}
                    onChange={(e) => setCurrentAttribute(prev => ({
                      ...prev,
                      id_attribute: Number(e.target.value)
                    }))}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="0">Select attribute</option>
                    {attributes.map(attr => (
                      <option key={attr.id} value={attr.id}>{attr.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Value*</Label>
                  <Input
                    value={currentAttribute.value}
                    onChange={(e) => setCurrentAttribute(prev => ({
                      ...prev,
                      value: e.target.value
                    }))}
                    placeholder="Enter value"
                    className="focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit</Label>
                  <select
                    value={currentAttribute.id_unit || ''}
                    onChange={(e) => setCurrentAttribute(prev => ({
                      ...prev,
                      id_unit: e.target.value ? Number(e.target.value) : null
                    }))}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="">Select unit</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddAttribute}
                  disabled={!currentAttribute.id_attribute || !currentAttribute.value}
                  className="mb-8 hover:bg-gray-50"
                >
                  Add Attribute
                </Button>
              </motion.div>

              {formData.attributes.length > 0 && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <AnimatePresence>
                    {formData.attributes.map((attr, index) => {
                      const attribute = attributes.find(a => a.id === attr.id_attribute)
                      const unit = attr.id_unit ? units.find(u => u.id === attr.id_unit) : null
                      
                      return (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-gray-800">
                              {attribute?.name || 'Unknown'}: 
                            </span>
                            <span className="ml-2 text-gray-600">
                              {attr.value} {unit && `(${unit.name})`}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAttribute(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="flex justify-end gap-4 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormMode('list')}
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90"
              >
                {formMode === 'create' ? 'Create Product' : 'Save Changes'}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      )}
    </div>
  )
}