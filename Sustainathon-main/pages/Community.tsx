import React, { useState, useEffect } from 'react';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Heart, MessageCircle, Send, Users, Shield, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Comment {
  _id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface Post {
  _id: string;
  user: string;
  content: string;
  likes: string[];       // Array of usernames who liked
  comments: Comment[];   // Array of comment objects
  timestamp: string;
  color: string;
}

export const Community: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
    const { user } = useAuth();

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
            setPosts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch posts');
        }
    };

    useEffect(() => {
        fetchPosts();
        // Poll for new posts every 10 seconds
        const interval = setInterval(fetchPosts, 10000);
        return () => clearInterval(interval);
    }, []);

    const handlePost = async () => {
        if (!newPost.trim() || !user) return;
        
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, {
                user: user.username,
                content: newPost,
            });
            setNewPost('');
            fetchPosts();
        } catch (err) {
            console.error('Post failed');
        }
    };

    const handleLike = async (postId: string) => {
        if (!user) return;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`, {
                username: user.username,
            });
            // Update the specific post in state
            setPosts(prev => prev.map(p => p._id === postId ? res.data : p));
        } catch (err) {
            console.error('Like failed');
        }
    };

    const handleComment = async (postId: string) => {
        const text = commentTexts[postId]?.trim();
        if (!text || !user) return;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comment`, {
                username: user.username,
                text,
            });
            // Update the specific post in state
            setPosts(prev => prev.map(p => p._id === postId ? res.data : p));
            setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            console.error('Comment failed');
        }
    };

    const toggleComments = (postId: string) => {
        setExpandedComments(prev => {
            const next = new Set(prev);
            if (next.has(postId)) {
                next.delete(postId);
            } else {
                next.add(postId);
            }
            return next;
        });
    };

    const isLikedByUser = (post: Post) => {
        return user && Array.isArray(post.likes) && post.likes.includes(user.username);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Community Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-neo-black text-white p-8 rounded-3xl shadow-neo border-4 border-black gap-6">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Eco-Social Hub</h2>
                    <p className="text-gray-400 font-bold">Connect with members worldwide saving the planet.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-neo-green/20 p-4 border-2 border-neo-green rounded-xl text-center min-w-[100px]">
                        <div className="text-2xl font-black text-neo-green">{posts.length}</div>
                        <div className="text-[10px] font-black uppercase text-neo-green/60">Live Posts</div>
                    </div>
                </div>
            </div>

            {/* Post Creation */}
            <NeoCard color="white" className="!p-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-neo-yellow border-4 border-black rounded-full flex items-center justify-center font-black">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea 
                            className="w-full border-4 border-black rounded-2xl p-4 font-bold text-lg focus:outline-none focus:ring-4 ring-neo-blue min-h-[120px]"
                            placeholder="What eco-action did you take today?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 text-gray-500 font-bold text-xs">
                                <Shield size={14} /> Only helpful, scientific tips allowed
                            </div>
                            <NeoButton onClick={handlePost} size="md" className="!px-8">
                                <Send size={18} /> Share Impact
                            </NeoButton>
                        </div>
                    </div>
                </div>
            </NeoCard>

            {/* Social Feed */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="text-neo-pink" />
                    <h3 className="text-2xl font-black uppercase italic">Live Feed</h3>
                </div>

                {loading ? (
                    <div className="p-12 text-center font-black text-gray-400 animate-pulse">Loading the eco-stream...</div>
                ) : posts.map((post) => (
                    <div key={post._id} className="group relative">
                        <div className="absolute inset-0 bg-neo-black rounded-3xl translate-x-3 translate-y-3 group-hover:translate-x-1 group-hover:translate-y-1 transition-all"></div>
                        <div className={`relative ${post.color || 'bg-white'} border-4 border-black rounded-3xl p-6`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 border-2 border-black rounded-full bg-white flex items-center justify-center font-black text-xs">
                                        {post.user?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <div className="font-black text-sm">{post.user}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase">
                                            {new Date(post.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black text-white px-2 py-1 rounded text-[10px] font-black rotate-2">VERIFIED ACTION</div>
                            </div>
                            
                            <p className="text-lg font-bold leading-snug mb-6">{post.content}</p>

                            <div className="flex gap-6 border-t-2 border-black/10 pt-4">
                                <button 
                                    onClick={() => handleLike(post._id)}
                                    className={`flex items-center gap-2 transition-colors cursor-pointer ${
                                        isLikedByUser(post) 
                                            ? 'text-neo-pink' 
                                            : 'hover:text-neo-pink'
                                    }`}
                                >
                                    <Heart 
                                        size={20} 
                                        className="stroke-[3]" 
                                        fill={isLikedByUser(post) ? 'currentColor' : 'none'}
                                    />
                                    <span className="font-black">{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                                </button>
                                <button 
                                    onClick={() => toggleComments(post._id)}
                                    className={`flex items-center gap-2 transition-colors cursor-pointer ${
                                        expandedComments.has(post._id)
                                            ? 'text-neo-blue'
                                            : 'hover:text-neo-blue'
                                    }`}
                                >
                                    <MessageCircle size={20} className="stroke-[3]" />
                                    <span className="font-black">{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                                    {expandedComments.has(post._id) 
                                        ? <ChevronUp size={14} /> 
                                        : <ChevronDown size={14} />
                                    }
                                </button>
                            </div>

                            {/* Comments Section */}
                            {expandedComments.has(post._id) && (
                                <div className="mt-4 border-t-2 border-black/10 pt-4 space-y-3">
                                    {/* Existing comments */}
                                    {Array.isArray(post.comments) && post.comments.length > 0 ? (
                                        post.comments.map((comment) => (
                                            <div key={comment._id} className="flex gap-3 items-start bg-white/60 rounded-xl p-3 border-2 border-black/10">
                                                <div className="w-7 h-7 border-2 border-black rounded-full bg-neo-blue/20 flex items-center justify-center font-black text-[10px] flex-shrink-0">
                                                    {comment.user?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-xs">{comment.user}</span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(comment.timestamp).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold mt-1">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 font-bold text-center py-2">No comments yet. Be the first!</p>
                                    )}

                                    {/* Add comment input */}
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            className="flex-1 border-3 border-black rounded-xl px-4 py-2 font-bold text-sm focus:outline-none focus:ring-2 ring-neo-blue"
                                            placeholder="Write a comment..."
                                            value={commentTexts[post._id] || ''}
                                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleComment(post._id);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => handleComment(post._id)}
                                            className="bg-neo-blue text-white px-4 py-2 rounded-xl font-black text-sm border-2 border-black hover:scale-105 transition-transform cursor-pointer"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
