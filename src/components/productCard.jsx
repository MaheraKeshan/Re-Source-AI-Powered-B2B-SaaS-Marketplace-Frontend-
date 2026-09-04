import { motion } from 'framer-motion'
import { Package, ShoppingCart, MapPin, Tag, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
	return (
		<Link to={`/product/${product.productId}`} className="block h-full perspective-1000">
			<motion.div
				layout
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95 }}
				whileHover={{ y: -12, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
				transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
				className="group relative bg-neutral-900/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden transition-all duration-500 border border-white/5 hover:border-emerald-500/30 h-full flex flex-col"
			>
				{/* Image Container */}
				<div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden shrink-0">
					{product.image ? (
						<img
							src={product.image[0] || product.image}
							alt={product.name}
							className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out opacity-80 group-hover:opacity-100"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-neutral-950 text-white/10 group-hover:bg-emerald-500/5 group-hover:text-emerald-500/30 transition-colors duration-500">
							<Package size={64} strokeWidth={1} />
						</div>
					)}

					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-10 transition-opacity duration-700"></div>

					{/* Category Badge */}
					{product.category && (
						<div className="absolute top-5 left-5 bg-neutral-900/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-[0.2em] border border-white/10 shadow-2xl z-10 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all duration-300">
							{product.category}
						</div>
					)}

					{/* Floating Action Button */}
					<div className="absolute bottom-5 right-5 translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[var(--ease-spring)] delay-100">
						<button className="bg-emerald-500 text-black p-4 rounded-2xl shadow-2xl hover:bg-emerald-400 hover:scale-110 transition-all transform duration-300">
							<ShoppingCart size={20} />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="p-8 flex flex-col flex-grow relative">
					{/* Status/Badge */}
					<div className="flex items-center gap-2 mb-3">
						<div className="px-2.5 py-1 rounded-full bg-neutral-800 border border-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Verified
                        </div>
						<span className="text-sm font-medium text-emerald-400 truncate max-w-[120px]">{product.producerName || "Eco Producer"}</span>
					</div>

					{/* Title */}
					<h3 className="font-sans font-bold text-2xl text-white mb-3 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2 tracking-tight">
						{product.name}
					</h3>

					{/* Description */}
					<p className="text-sm text-neutral-400 mb-6 line-clamp-2 flex-grow leading-relaxed font-medium">
						{product.description || "Synthesizing industrial waste streams into high-value circular raw materials."}
					</p>

					{/* Footer Price & Location */}
					<div className="mt-auto pt-5 border-t border-white/10 flex justify-between items-end">
						<div>
							<p className="text-xs text-neutral-500 font-medium mb-1 tracking-wide">Pricing</p>
							<div className="text-emerald-400 font-bold text-2xl tracking-tight flex items-baseline gap-1.5">
								{product.price ? (
									<>
										<span className="text-xs text-emerald-500/70 font-bold tracking-tighter">LKR</span>
										{product.price.toLocaleString()}
									</>
								) : (
									<span className="text-neutral-500 text-lg font-medium italic">Negotiable</span>
								)}
							</div>
						</div>

						<div className="text-right">
							<div className="flex items-center justify-end gap-1.5 text-xs text-neutral-400 font-medium bg-neutral-950/50 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-emerald-500/30 group-hover:text-white transition-all duration-300">
								<MapPin size={12} className="text-emerald-500" />
								{product.location ? product.location : "Warehouse"}
							</div>
						</div>
					</div>

					{/* Global Link Hint */}
					<div className="absolute top-8 right-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-emerald-500">
						<ArrowUpRight size={24} />
					</div>
				</div>
			</motion.div>
		</Link>
	);
};

export default ProductCard;