'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Upload, Trash, Edit, Save, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, ColorVariant } from '@/lib/products';

const STANDARD_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#000080' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Grey', hex: '#808080' },
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    category: 't-shirts',
    image: '',
    images: [''],
    checkoutUrl: '',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [] as string[],
    colorVariants: [] as ColorVariant[],
    condition: 'Neu',
    brand: 'Zaro Fashion',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [colorInput, setColorInput] = useState('');
  const [uploading, setUpload] = useState(false);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      ...product,
      price: product.price.toString(),
      images: product.images.length > 0 ? product.images : [''],
      colors: product.colors || [],
      colorVariants: product.colorVariants || [],
    });
    setEditingId(product.id);
    setActiveTab('edit');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      alert('Fehler beim Löschen');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      alert('Bitte Name und Preis ausfüllen');
      return;
    }

    // Ensure colors list matches variants
    const uniqueColors = Array.from(new Set([
      ...formData.colors,
      ...formData.colorVariants.map(v => v.color)
    ]));

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      images: formData.images.filter(img => img !== ''),
      colors: uniqueColors,
      colorVariants: formData.colorVariants,
    };

    try {
      if (activeTab === 'edit' && editingId) {
        await fetch(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      alert('Gespeichert!');
      fetchProducts();
      setActiveTab('list');
      resetForm();
    } catch (error) {
      alert('Fehler beim Speichern');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: { type: 'main' } | { type: 'gallery', index: number } | { type: 'variant', variantIndex: number, imgIndex: number }) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      
      setUpload(true);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
        const json = await res.json();
        
        if (json.url) {
          if (target.type === 'main') {
            setFormData(prev => ({ ...prev, image: json.url }));
          } else if (target.type === 'gallery') {
            const newImages = [...formData.images];
            newImages[target.index] = json.url;
            setFormData(prev => ({ ...prev, images: newImages }));
          } else if (target.type === 'variant') {
            const newVariants = [...formData.colorVariants];
            newVariants[target.variantIndex].images[target.imgIndex] = json.url;
            setFormData(prev => ({ ...prev, colorVariants: newVariants }));
          }
        }
      } catch (error) {
        alert('Upload fehlgeschlagen');
      } finally {
        setUpload(false);
      }
    }
  };

  // Variant Logic
  const addVariant = (colorName: string) => {
    if (formData.colorVariants.find(v => v.color === colorName)) return;
    
    setFormData({
      ...formData,
      colorVariants: [...formData.colorVariants, { color: colorName, images: [''], checkoutUrl: '' }],
      colors: [...formData.colors, colorName]
    });
  };

  const removeVariant = (index: number) => {
    const variantToRemove = formData.colorVariants[index];
    setFormData({
      ...formData,
      colorVariants: formData.colorVariants.filter((_, i) => i !== index),
      colors: formData.colors.filter(c => c !== variantToRemove.color)
    });
  };

  const addVariantImage = (variantIndex: number) => {
    const newVariants = [...formData.colorVariants];
    newVariants[variantIndex].images.push('');
    setFormData({ ...formData, colorVariants: newVariants });
  };

  const removeVariantImage = (variantIndex: number, imgIndex: number) => {
    const newVariants = [...formData.colorVariants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imgIndex);
    setFormData({ ...formData, colorVariants: newVariants });
  };

  const updateVariantImage = (variantIndex: number, imgIndex: number, value: string) => {
    const newVariants = [...formData.colorVariants];
    newVariants[variantIndex].images[imgIndex] = value;
    setFormData({ ...formData, colorVariants: newVariants });
  };

  const updateVariantCheckoutUrl = (variantIndex: number, value: string) => {
    const newVariants = [...formData.colorVariants];
    newVariants[variantIndex].checkoutUrl = value;
    setFormData({ ...formData, colorVariants: newVariants });
  };

  const toggleSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Zaro Fashion Admin</h1>
          <button onClick={() => { resetForm(); setActiveTab('create'); }} className="bg-black text-white px-4 py-2 rounded-lg flex gap-2">
            <Plus /> Neues Produkt
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg min-h-[500px]">
          <div className="flex gap-4 mb-8 border-b pb-4">
            <button 
              onClick={() => setActiveTab('list')}
              className={`pb-2 font-bold ${activeTab === 'list' ? 'border-b-2 border-black' : 'text-gray-400'}`}
            >
              Alle Produkte
            </button>
            {(activeTab === 'create' || activeTab === 'edit') && (
              <button 
                className="pb-2 font-bold border-b-2 border-black"
              >
                {activeTab === 'edit' ? 'Bearbeiten' : 'Erstellen'}
              </button>
            )}
          </div>

          {activeTab === 'list' ? (
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 justify-between group">
                  <div className="flex items-center gap-4">
                    <img src={p.image} className="w-16 h-16 object-cover rounded bg-gray-100" />
                    <div>
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.price} EUR • {p.category}</p>
                      <div className="flex gap-1 mt-1">
                        {p.colorVariants?.map(v => (
                          <span key={v.color} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: STANDARD_COLORS.find(sc => sc.name === v.color)?.hex || 'gray' }} title={v.color} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 text-red-600 rounded">
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-center text-gray-500">Keine Produkte gefunden.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN: Main Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Beschreibung</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-3 rounded-lg h-24" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Preis</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-3 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Kategorie</label>
                    <input list="categories" name="category" value={formData.category} onChange={handleChange} className="w-full border p-3 rounded-lg" />
                    <datalist id="categories">
                      <option value="t-shirts" />
                      <option value="jackets" />
                      <option value="pants" />
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Marke</label>
                  <input name="brand" value={formData.brand} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="z.B. Parajumpers" />
                </div>

                {/* Main Images (Fallback) */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <label className="block text-sm font-bold mb-2">Standard Bilder (Wenn keine Farbe gewählt)</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input name="image" value={formData.image} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Hauptbild URL" />
                      <label className="cursor-pointer bg-black text-white p-2 rounded w-10 flex justify-center items-center">
                        <Upload size={16} />
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, { type: 'main' })} />
                      </label>
                    </div>
                    {formData.images.map((img, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={img} onChange={(e) => {
                          const newImgs = [...formData.images];
                          newImgs[i] = e.target.value;
                          setFormData({...formData, images: newImgs});
                        }} className="w-full border p-2 rounded" placeholder={`Bild ${i+2}`} />
                        <label className="cursor-pointer bg-gray-200 p-2 rounded w-10 flex justify-center items-center">
                          <Upload size={16} />
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, { type: 'gallery', index: i })} />
                        </label>
                        <button onClick={() => removeImageField(i)} className="text-red-500"><X /></button>
                      </div>
                    ))}
                    <button onClick={addImageField} className="text-sm text-blue-600 flex items-center gap-1"><Plus size={14}/> Mehr Bilder</button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Variants & Colors */}
              <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                  <h3 className="font-bold mb-4 text-blue-900">Farb-Varianten (Bilder & Checkout pro Farbe)</h3>
                  
                  {/* Color Selector */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {STANDARD_COLORS.map(color => (
                      <button 
                        key={color.name}
                        onClick={() => addVariant(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 relative ${formData.colorVariants.some(v => v.color === color.name) ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200'}`}
                        style={{ backgroundColor: color.hex }}
                        title={`Füge ${color.name} hinzu`}
                      >
                        {formData.colorVariants.some(v => v.color === color.name) && <Check size={14} className={`absolute inset-0 m-auto ${color.name === 'White' || color.name === 'Beige' ? 'text-black' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                  
                  {/* Manual Color Input */}
                  <div className="flex gap-2 mb-6">
                    <input 
                      value={colorInput} 
                      onChange={(e) => setColorInput(e.target.value)} 
                      className="border p-2 rounded flex-1" 
                      placeholder="Andere Farbe (z.B. Gold)" 
                    />
                    <button onClick={() => { if(colorInput) { addVariant(colorInput); setColorInput(''); } }} className="bg-blue-600 text-white px-3 rounded font-bold">Add</button>
                  </div>

                  {/* Active Variants List */}
                  <div className="space-y-4">
                    {formData.colorVariants.map((variant, vIndex) => (
                      <div key={vIndex} className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: STANDARD_COLORS.find(c => c.name === variant.color)?.hex || 'gray' }}></span>
                            {variant.color}
                          </span>
                          <button onClick={() => removeVariant(vIndex)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash size={16}/></button>
                        </div>

                        {/* Checkout URL for this Variant */}
                        <div className="mb-4">
                           <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Checkout URL für {variant.color}</label>
                           <input 
                             value={variant.checkoutUrl || ''} 
                             onChange={(e) => updateVariantCheckoutUrl(vIndex, e.target.value)}
                             className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white" 
                             placeholder={`https://buy.stripe.com/... (für ${variant.color})`} 
                           />
                        </div>
                        
                        {/* Variant Images */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Bilder</label>
                          {variant.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="flex gap-2">
                              <input 
                                value={img} 
                                onChange={(e) => updateVariantImage(vIndex, imgIndex, e.target.value)}
                                className="w-full border p-2 rounded text-sm" 
                                placeholder={`Bild für ${variant.color}`} 
                              />
                              <label className="cursor-pointer bg-gray-100 p-2 rounded w-10 flex justify-center items-center hover:bg-gray-200">
                                <Upload size={14} />
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, { type: 'variant', variantIndex: vIndex, imgIndex })} />
                              </label>
                              <button onClick={() => removeVariantImage(vIndex, imgIndex)} className="text-red-400"><X size={16}/></button>
                            </div>
                          ))}
                          <button onClick={() => addVariantImage(vIndex)} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                            <Plus size={12}/> Bild hinzufügen
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.colorVariants.length === 0 && <p className="text-sm text-gray-400 italic">Wähle oben eine Farbe, um spezielle Bilder und Links dafür hinzuzufügen.</p>}
                  </div>
                </div>

                {/* Sizes */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <label className="block text-sm font-bold mb-2">Größen</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button key={size} onClick={() => toggleSize(size)} className={`px-3 py-1 rounded border text-sm font-bold ${formData.sizes.includes(size) ? 'bg-black text-white' : 'bg-white'}`}>{size}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Checkout URL (Standard / Fallback)</label>
                  <input name="checkoutUrl" value={formData.checkoutUrl} onChange={handleChange} className="w-full border p-3 rounded-lg" />
                </div>

                <div className="pt-4 border-t">
                  <button onClick={handleSubmit} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 flex justify-center items-center gap-2">
                    <Save /> {activeTab === 'edit' ? 'Änderungen Speichern' : 'Produkt Erstellen'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
