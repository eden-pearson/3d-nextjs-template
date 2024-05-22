import * as THREE from 'three'
import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { a } from '@react-spring/three'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'

// Moved this component to enhance code clarity

function Computer({ open, hinge, ...props }) {
  const groupie = useRef(null)
  const { nodes, materials } = useGLTF('/mac-draco.glb')
  const [hovered, setHovered] = useState(false)

  useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered])

  const video = useMemo(() => {
    const vid = document.createElement('video')
    vid.src = '/reel_480.mp4'
    vid.crossOrigin = 'Anonymous'
    vid.loop = true
    vid.muted = true

    vid.play()
    return vid
  }, [])

  // Simplified and separated the JSX for clarity
  return (
    <group
      ref={groupie}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      dispose={null}
    >
      <a.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
          <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
          <mesh geometry={nodes['Cube008_2'].geometry} scale={[1, 1, -1]} position={[0, -0.01, -0.18]}>
            <meshBasicMaterial attach='material'>
              <videoTexture attach='map' args={[video]} colorSpace={THREE.SRGBColorSpace} />
            </meshBasicMaterial>
          </mesh>
        </group>
      </a.group>
      <mesh material={materials.keys} geometry={nodes.keyboard.geometry} position={[1.79, 0, 3.45]} />
      <group position={[0, -0.1, 3.39]}>
        <mesh material={materials.aluminium} geometry={nodes['Cube002'].geometry} />
        <mesh material={materials.trackpad} geometry={nodes['Cube002_1'].geometry} />
      </group>
      <mesh material={materials.touchbar} geometry={nodes.touchbar.geometry} position={[0, -0.03, 1.2]} />
    </group>
  )
}

export default function HomePage() {
  const [open, setOpen] = useState(false)
  const props = useSpring({ open: Number(open) })

  const [debugMode, setDebugMode] = useState(false)
  const { bloomIntensity, luminanceThreshold, luminanceSmoothing } = useState({
    bloomIntensity: 10,
    luminanceThreshold: 0.5,
    luminanceSmoothing: 20,
  })
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyX') {
        setDebugMode((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    const handleKey = (event) => {
      // Trigger when the 'A' key is pressed.
      if (event.code === 'KeyA') {
        setOpen((prevOpen) => !prevOpen)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <Canvas>
        <group rotation={[0.1, 1.8 * Math.PI, 0]} onClick={() => setOpen(!open)}>
          <Computer open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
        </group>

        <pointLight color={'#fffaea'} position={[0, 5, 0]} intensity={50} />
        {/* <Environment files={'/flatway2k.hdr'} background blur={0.04} /> */}
        {/* <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={1.75} far={4.5} />*/}
        <OrbitControls
          minDistance={10}
          maxDistance={20}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
        {debugMode && <Perf position={'bottom-left'} />}
      </Canvas>
    </>
  )
}
