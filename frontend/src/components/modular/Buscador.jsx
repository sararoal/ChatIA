import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import styles from './Buscador.module.css'
import Buscar from '../icons/Buscar.jsx'

gsap.registerPlugin(useGSAP)

const Buscador = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchWrapperRef = useRef(null)
  const inputWrapperRef = useRef(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  useGSAP(() => {}, { scope: searchWrapperRef })

  const handleClick = () => {
    setIsSearchOpen(true)

    gsap
      .timeline()
      .to(
        buttonRef.current,
        {
          pointerEvents: 'none',
          duration: 0.2,
        },
        0
      )
      .to(
        searchWrapperRef.current,
        {
          width: '100%',
          duration: 0.3,
          ease: 'power2.out',
        },
        0
      )
      .to(
        inputWrapperRef.current,
        {
          width: '75%',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => inputRef.current?.focus(),
        },
        '<'
      )
  }

  const handleBlur = () => {
    gsap
      .timeline({
        onComplete: () => setIsSearchOpen(false),
      })
      .to(
        inputWrapperRef.current,
        {
          width: '2.5rem',
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.to(inputWrapperRef.current, {
              opacity: 0,
              duration: 0.1,
            })
          },
        },
        '-<0.5'
      )
      .to(
        searchWrapperRef.current,
        {
          width: '2.5rem',
          duration: 0.3,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        buttonRef.current,
        {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.3,
          ease: 'power2.out',
        },
        '<'
      )
  }

  const handleInput = (e) => {
    setSearchValue(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  return (
    <div className={styles.searchWrapper} ref={searchWrapperRef}>
      <button
        ref={buttonRef}
        className={`${styles.iconButton} cursor-pointer`}
        onClick={handleClick}
      >
        <Buscar />
      </button>

      <div
        ref={inputWrapperRef}
        className={styles.inputWrapper}
        style={{ opacity: 0, width: '2.5rem' }}
      >
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            placeholder={isSearchOpen ? 'Buscar...' : ''}
            className={styles.searchInput}
            onBlur={handleBlur}
            value={searchValue}
            onChange={handleInput}
          />
        </div>
      </div>
    </div>
  )
}

export default Buscador