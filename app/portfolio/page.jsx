'use client'

import * as THREE from 'three'
import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Billboard, Text } from '@react-three/drei'
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
    const [hovered, hover] = useState(null)
    const [selected, setSelected] = useState(null)
    useFrame((state, delta) => {
      ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
      state.events.update() // Raycasts every frame rather than on pointer-move
      easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y * 2 + 4.5, 9], 0.3, delta)
      state.camera.lookAt(0, 0, 0)
    })
    return (
      <group ref={ref} {...props}>
        <Cards
          category='jedna'
          from={0}
          len={Math.PI / 4}
          onPointerOver={hover}
          onPointerOut={hover}
          onClick={setSelected}
          data={portfolioData}
        />
        <ActiveCard hovered={hovered} selected={selected} />
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
    ...props
  }) {
    const [hovered, hover] = useState(null)
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
              onPointerOver={(e) => (e.stopPropagation(), hover(i), onPointerOver(i))}
              onPointerOut={() => (hover(null), onPointerOut(null))}
              onClick={() => onClick(item)}
              position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
              rotation={[0, Math.PI / 2 + angle, 0]}
              active={hovered !== null}
              hovered={hovered === i}
              url={item.image}
            />
          )
        })}
      </group>
    )
  }

  function Card({ url, active, hovered, onClick, ...props }) {
    const ref = useRef()
    useFrame((state, delta) => {
      const f = hovered ? 1.4 : active ? 1.25 : 1
      easing.damp3(ref.current.position, [0, hovered ? 0.25 : 0, 0], 0.1, delta)
      easing.damp3(ref.current.scale, [1.618 * f, 1 * f, 1], 0.15, delta)
    })
    return (
      <group {...props} onClick={onClick}>
        <Image ref={ref} transparent radius={0.075} url={url} scale={[1.618, 1, 1]} side={THREE.DoubleSide} />
      </group>
    )
  }

  function ActiveCard({ hovered, selected, ...props }) {
    const ref = useRef()

    useLayoutEffect(() => {
      if (ref.current && ref.current.material) {
        ref.current.material.zoom = 0.8
      }
    }, [hovered])

    useFrame((state, delta) => {
      if (ref.current && ref.current.material) {
        easing.damp(ref.current.material, 'zoom', 1, 0.5, delta)
        easing.damp(ref.current.material, 'opacity', hovered !== null, 0.3, delta)
      }
    })

    return (
      <Billboard {...props}>
        <Text font={suspend(inter).default} fontSize={0.5} position={[2.15, 3.85, 0]} anchorX='left' color='black'>
          {hovered !== null && selected ? `${selected.title}\n${hovered}` : null}
        </Text>
        {selected && (
          <>
            <Text font={suspend(inter).default} fontSize={0.5} position={[2.15, 3.85, 0]} anchorX='left' color='black'>
              {selected.title}
            </Text>
            <Text font={suspend(inter).default} fontSize={0.3} position={[2.15, 3.5, 0]} anchorX='left' color='black'>
              {selected.description}
            </Text>
          </>
        )}
        {selected && (
          <Image
            ref={ref}
            transparent
            radius={0.3}
            position={[0, 1.5, 0]}
            scale={[3.5, 1.618 * 3.5, 0.2, 1]}
            url={selected.image} // Ensure selected is not null
            side={THREE.DoubleSide}
            alt={selected.title}
          />
        )}
      </Billboard>
    )
  }
}
