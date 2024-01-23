import { AnimatePresence, motion } from 'framer-motion';

const AnimatedPage = ({ children, keyValue, initial = { opacity: 0 }, animate = { opacity: 1 }, transition = { duration: 1 }, className }) => {
    return (
        <AnimatePresence>
            <motion.div
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}>
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default AnimatedPage;