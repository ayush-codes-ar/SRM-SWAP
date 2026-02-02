import React, { useState } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import FileUpload from '../../components/FileUpload';

const CreateListingPage = () => {
    const { createItem, uploadImages } = useItemStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: 'SELL',
        price: '',
        tags: '',
        marketplace: 'NORMAL',
        allowHybrid: false,
    });
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrls: string[] = [];
            if (images.length > 0) {
                console.log('Starting image upload...');
                try {
                    imageUrls = await uploadImages(images);
                    console.log('Upload successful:', imageUrls);
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    alert('Failed to upload images. Please try again.');
                    setUploading(false);
                    return;
                }
            }

            console.log('Creating item with data:', { ...formData, images: imageUrls });
            await createItem({
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()),
                images: imageUrls
            });
            console.log('Item created successfully');
            navigate('/marketplace');
        } catch (error) {
            console.error('Create item failed:', error);
            alert('Failed to create listing. Check console for details.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-black p-6 flex justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">List Item</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Title</label>
                        <input className="w-full bg-white p-3 rounded-lg border border-gray-200" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Type</label>
                            <select className="w-full bg-white p-3 rounded-lg border border-gray-200" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="SELL">Sell</option>
                                <option value="LEND">Lend</option>
                                <option value="BARTER">Barter</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Price (₹)</label>
                            <input type="number" className="w-full bg-white p-3 rounded-lg border border-gray-200" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Who is this for?</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, marketplace: 'NORMAL' })}
                                className={`py-3 rounded-lg border font-bold transition ${formData.marketplace === 'NORMAL' ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white border-gray-200 text-gray-500'}`}
                            >
                                General Market
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, marketplace: 'FRESHERS' })}
                                className={`py-3 rounded-lg border font-bold transition ${formData.marketplace === 'FRESHERS' ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white border-gray-200 text-gray-500'}`}
                            >
                                Freshers Only
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Category</label>
                        <select className="w-full bg-white p-3 rounded-lg border border-gray-200" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                            <option value="">Select Category</option>
                            {formData.marketplace === 'NORMAL' ? (
                                <>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Books">Books</option>
                                    <option value="Stationery">Stationery</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Other">Other</option>
                                </>
                            ) : (
                                <>
                                    <option value="Pillow">Pillow</option>
                                    <option value="Mattresses">Mattresses</option>
                                    <option value="Stationery">Stationery</option>
                                    <option value="Bathroom Equipments">Bathroom Equipments</option>
                                    <option value="Medicines">Medicines</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Description</label>
                        <textarea className="w-full bg-white p-3 rounded-lg border border-gray-200 h-32" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Tags (comma separated)</label>
                        <input className="w-full bg-white p-3 rounded-lg border border-gray-200" placeholder="cricket, bat, sports" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                    </div>

                    <FileUpload label="Upload Images" onChange={(file) => {
                        if (file) setImages([...images, file]);
                    }} />

                    {images.length > 0 && (
                        <div className="flex gap-2">
                            {images.map((img, i) => (
                                <div key={i} className="text-xs bg-white/10 p-1 rounded">{img.name}</div>
                            ))}
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-black">Hybrid Trade Mode</h3>
                            <p className="text-xs text-gray-500 italic">I am open to partial money + partial barter deals</p>
                        </div>
                        <input
                            type="checkbox"
                            className="w-6 h-6 rounded-md accent-cyan-500 cursor-pointer"
                            checked={formData.allowHybrid}
                            onChange={(e) => setFormData({ ...formData, allowHybrid: e.target.checked })}
                        />
                    </div>

                    <button type="submit" disabled={uploading} className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl font-bold transition">
                        {uploading ? 'Publishing...' : 'Post Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListingPage;
