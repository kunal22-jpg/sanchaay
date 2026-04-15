import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useAuth } from '../context/AuthContext';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Camera, Smile, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [smileScore, setSmileScore] = useState(0);
    const { login } = useAuth();

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("Model loading failed", err);
                setError("Face models not found. Please ensure /public/models is populated.");
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        if (!username.trim() || !password.trim()) {
            setError("Eco-ID and Password are required.");
            return;
        }
        setError(null);
        setIsDetecting(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch(err => {
                setError("Camera access denied. Please allow camera use.");
                setIsDetecting(false);
            });
    };

    const handleDetection = async () => {
        if (!videoRef.current || !isDetecting || isLoggingIn) return;

        try {
            const detections = await faceapi.detectSingleFace(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceExpressions();

            if (detections) {
                const smile = detections.expressions.happy;
                setSmileScore(smile);

                if (smile > 0.7) {
                    setIsLoggingIn(true);
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                    
                    try {
                        await login(username, password);
                    } catch (err) {
                        const msg = err.response?.data?.error || "Auth failed. Check your password.";
                        setError(msg);
                        setIsLoggingIn(false);
                        setIsDetecting(false);
                    }
                }
            }
        } catch (err) {
            console.error("Detection error:", err);
        }

        if (isDetecting && !isLoggingIn) {
            requestAnimationFrame(handleDetection);
        }
    };

    return (
        <div className="min-h-screen bg-neo-green/10 flex items-center justify-center p-6">
            <NeoCard color="white" className="max-w-md w-full !p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-neo-yellow p-4 border-4 border-black rounded-full mb-6 rotate-3">
                        <Smile size={48} className="text-black" />
                    </div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Smile to Login</h1>
                    <p className="font-bold text-gray-500 mb-8">Secure, high-tech access to your eco-journey.</p>

                    {error && (
                        <div className="bg-neo-pink/20 border-2 border-neo-pink p-3 rounded-lg mb-6 flex items-center gap-2 text-sm font-bold w-full text-left">
                            <AlertCircle size={18} className="flex-shrink-0" /> <span>{error}</span>
                        </div>
                    )}

                    {!isDetecting ? (
                        <div className="w-full space-y-6">
                            <div className="text-left space-y-4">
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Your Eco ID (Username)</label>
                                    <input 
                                        className="w-full border-4 border-black rounded-xl p-4 text-xl font-bold focus:outline-none focus:ring-4 ring-neo-blue"
                                        placeholder="Enter your name..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block font-black uppercase text-xs mb-2">Security Key (Password)</label>
                                    <input 
                                        type="password"
                                        className="w-full border-4 border-black rounded-xl p-4 text-xl font-bold focus:outline-none focus:ring-4 ring-neo-pink"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <NeoButton 
                                size="lg" 
                                className="w-full !py-6" 
                                disabled={!modelsLoaded || isLoggingIn}
                                onClick={startVideo}
                            >
                                {isLoggingIn ? <Loader2 className="animate-spin" /> : <Camera size={24} />} 
                                {isLoggingIn ? "Checking Eco-ID..." : "Initialize Scan"}
                            </NeoButton>
                            
                            <div className="pt-2">
                                <button 
                                    onClick={async () => {
                                        setError(null);
                                        setIsLoggingIn(true);
                                        try {
                                            await login(username || 'Eco-Guest', password || 'guest123');
                                        } catch (err) {
                                            setError("Guest Login failed. Try a different username.");
                                            setIsLoggingIn(false);
                                        }
                                    }}
                                    disabled={isLoggingIn}
                                    className="w-full text-xs font-black uppercase text-gray-400 hover:text-neo-blue transition-colors underline underline-offset-8 decoration-2 disabled:opacity-50"
                                >
                                    {isLoggingIn ? "Preparing Demo Access..." : "⚡ Quick Demo Login (Skip Face Scan)"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full space-y-6">
                            <div className="relative rounded-2xl overflow-hidden border-4 border-black shadow-neo">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    muted 
                                    onPlay={handleDetection}
                                    className="w-full aspect-video object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/50 p-4 text-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-black italic uppercase tracking-widest text-neo-pink">Smile Intensity:</span>
                                        <span className="font-mono">{Math.round(smileScore * 100)}%</span>
                                    </div>
                                    <div className="h-4 bg-white/20 rounded-full overflow-hidden border border-white">
                                        <div 
                                            className="h-full bg-neo-green transition-all duration-200"
                                            style={{ width: `${smileScore * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-3 py-4 animate-pulse">
                                <Loader2 className="animate-spin text-neo-blue" />
                                <span className="font-black uppercase italic text-neo-blue">
                                    {isLoggingIn ? "Authenticating with server..." : "Analyzing eco-expressions..."}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-center gap-2 text-xs font-bold text-gray-400">
                        <ShieldCheck size={14} /> Edge Computing Auth - No images shared 
                    </div>
                </div>
            </NeoCard>
        </div>
    );
};
