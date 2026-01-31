import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import api from '../services/api';

interface RatingModalProps {
    tradeId: string;
    revieweeId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ tradeId, revieweeId, onClose, onSuccess }) => {
    const [ratings, setRatings] = useState({ accuracy: 5, honesty: 5, experience: 5 });
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await api.post('/ratings', { tradeId, revieweeId, ...ratings, comment });
            onSuccess();
            onClose();
        } catch (e) {
            alert('Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (key: keyof typeof ratings) => (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={24}
                    className={`cursor-pointer transition ${ratings[key] >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 hover:text-yellow-200'}`}
                    onClick={() => setRatings({ ...ratings, [key]: star })}
                />
            ))}
        </div>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Rate Your Experience</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Item Accuracy</label>
                            {renderStars('accuracy')}
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Seller Honesty</label>
                            {renderStars('honesty')}
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Overall Vibe</label>
                            {renderStars('experience')}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Comment (Optional)</label>
                            <textarea
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 focus:border-yellow-400 focus:outline-none transition-colors"
                                placeholder="How was the trade?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                            disabled={submitting}
                        >
                            {submitting ? 'Sending...' : 'Submit Review'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RatingModal;
