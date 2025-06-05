import { useLoaderStore } from '@/store/useLoader.store';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Loader = () => {
  const loadingCount = useLoaderStore((state) => state.loadingCount);
  const [visible, setVisible] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (loadingCount > 0) {
      setVisible(true);
      if (loaderRef.current) {
        gsap.to(loaderRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    } else if (visible) {
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => setVisible(false),
        });
      } else {
        setVisible(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCount]);

  if (!visible) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 opacity-0"
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );
};

export default Loader;