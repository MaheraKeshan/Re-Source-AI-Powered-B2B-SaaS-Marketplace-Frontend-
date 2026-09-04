import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react'; // Assuming lucide-react is installed, or use react-icons

export default function ChatbotLauncher() {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const [isScrolling, setIsScrolling] = useState(false);

    // Track drag state
    const isDragging = useRef(false);

    // Detect scrolling to add a subtle "move" effect
    useEffect(() => {
        let timeout;
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsScrolling(false), 200);
        };

        const unsubscribe = scrollY.on("change", handleScroll);
        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [scrollY]);

    return (
        <motion.button
            drag
            dragMomentum={false}
            onDragStart={() => { isDragging.current = true; }}
            onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 100); }}
            onClick={() => { if (!isDragging.current) navigate('/chatbot'); }}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-violet-500/50 transition-shadow duration-300 group cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                y: isScrolling ? -5 : 0,
            }}
            transition={{
                layout: { duration: 0.3 },
                y: { type: "spring", stiffness: 260, damping: 20 },
                default: { type: "spring", stiffness: 260, damping: 20 }
            }}
        >
            {/* Pulse effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-20 animate-ping group-hover:opacity-40"></span>

            <MessageSquare size={28} fill="currentColor" className="relative z-10" />

            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Ask AI (Drag me!)
            </span>
        </motion.button>
    );
}
