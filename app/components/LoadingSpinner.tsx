import { motion } from 'framer-motion'



export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full"
      />
    </div>
  )
}

