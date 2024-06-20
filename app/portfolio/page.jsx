'use client'

import * as THREE from 'three'
import { useLayoutEffect, useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Billboard, Text, Stars } from '@react-three/drei'
import { suspend } from 'suspend-react'
import { easing, geometry } from 'maath'
import portfolioData from '../../public/portfolio.json'

extend(geometry)
const inter = import('@pmndrs/assets/fonts/inter_regular.woff')

export default function Page() {
  return (
    <Canvas dpr={[1, 1.5]}>
      <ScrollControls pages={4} infinite>
        <Scene position={[0, 1.5, 0]} />
      </ScrollControls>
    </Canvas>
  )

  function Scene({ children, ...props }) {
    const ref = useRef()
    const scroll = useScroll()
    const [hovered, setHovered] = useState(null)
    const [selected, setSelected] = useState(null)
    const [isModalBig, setIsModalBig] = useState(false)

    useFrame((state, delta) => {
      ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
      state.events.update() // Raycasts every frame rather than on pointer-move
      easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9], 0.3, delta)
      state.camera.lookAt(0, 0, 0)
    })

    const handlePointerOver = useCallback(
      (index) => {
        if (!isModalBig) setHovered(index)
      },
      [isModalBig],
    )

    const handlePointerOut = useCallback(() => {
      if (!isModalBig) setHovered(null)
    }, [isModalBig])

    const handleClick = useCallback((item) => {
      setSelected(item)
      setIsModalBig(true)
    }, [])

    const handleClickAway = useCallback(() => {
      setIsModalBig(false)
      setSelected(null)
    }, [])

    return (
      <group ref={ref} {...props}>
        <Cards
          category='Recent Projects'
          from={0}
          len={Math.PI / 4}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
          data={portfolioData}
          isModalBig={isModalBig}
        />
        <ActiveCard
          hovered={hovered}
          selected={selected}
          setSelected={setSelected}
          isModalBig={isModalBig}
          setIsModalBig={setIsModalBig}
          onClickAway={handleClickAway}
        />
      </group>
    )
  }

  function Cards({
    category,
    data,
    from = 0,
    len = Math.PI * 2,
    radius = 5.25,
    onPointerOver,
    onPointerOut,
    onClick,
    isModalBig,
    ...props
  }) {
    const [hovered, setHovered] = useState(null)
    const amount = len * 6
    const textPosition = from + (amount / 2 / amount) * len

    return (
      <group {...props}>
        <Billboard position={[Math.sin(textPosition) * radius * 1.4, 0.5, Math.cos(textPosition) * radius * 1.4]}>
          <Text font={suspend(inter).default} fontSize={0.25} anchorX='center' color='black'>
            {category}
          </Text>
        </Billboard>
        {data.map((item, i) => {
          const angle = from + (i / amount) * len
          return (
            <Card
              key={item.id}
              onPointerOver={(e) => (e.stopPropagation(), setHovered(i), onPointerOver(i))}
              onPointerOut={() => (setHovered(null), onPointerOut(null))}
              onClick={() => onClick(item)}
              position={[Math.sin(angle) * radius, isModalBig ? -5 : 0, Math.cos(angle) * radius]}
              rotation={[0, Math.PI / 2 + angle, 0]}
              active={hovered !== null}
              hovered={hovered === i}
              url={item.image}
              isModalBig={isModalBig}
            />
          )
        })}
      </group>
    )
  }

  function Card({ url, active, hovered, onClick, isModalBig, ...props }) {
    const ref = useRef()
    useFrame((state, delta) => {
      easing.damp3(ref.current.position, [0, hovered ? 0.6 : 0, 0], 0.1, delta)

      ref.current.material.opacity = isModalBig ? 0.3 : 1
    })
    return (
      <group {...props} onClick={onClick}>
        <Image ref={ref} transparent radius={0.075} url={url} scale={[1.618, 1, 1]} side={THREE.DoubleSide} />
      </group>
    )
  }

  function ActiveCard({ hovered, selected, setSelected, isModalBig, setIsModalBig, onClickAway, ...props }) {
    const ref = useRef()

    return (
      <Billboard {...props} onClick={isModalBig ? onClickAway : null}>
        {selected && (
          <>
            <Text
              font={suspend(inter).default}
              fontSize={0.5}
              position={[2.15, 3.85, 0.5]}
              anchorX='left'
              color='black'
            >
              {selected.title}
            </Text>
            <Text font={suspend(inter).default} fontSize={0.3} position={[2.15, 3.5, 0.5]} anchorX='left' color='black'>
              {selected.description}
            </Text>
            <Image
              ref={ref}
              transparent
              radius={0.3}
              position={[0, 0, 0]}
              scale={[10, 10, 1]}
              url={selected.image}
              side={THREE.DoubleSide}
              alt={selected.title}
            />
          </>
        )}
      </Billboard>
    )
  }
}
