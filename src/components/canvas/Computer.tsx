import * as THREE from 'three'
import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { useSpring } from '@react-spring/core' /* 
import { EffectComposer, Bloom } from '@react-three/postprocessing' */
import { a as three } from '@react-spring/three'
/* import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
 */
interface ModelProps {
  open: boolean
  hinge: any
  [key: string]: any
}

// Moved this component to enhance code clarity
function LightingControl({ open }: { open: boolean }) {
  const springIntensity = useSpring({
    intensity: open ? 10 : 0,
    config: { tension: 150, friction: 20 },
  })
  const [lightIntensity, setLightIntensity] = useState(0)

  useFrame(() => {
    const currentIntensity = springIntensity.intensity.get()
    setLightIntensity(currentIntensity)
  })

  return <pointLight position={[-3, 5, 0]} intensity={lightIntensity} distance={50} decay={25} />
}

function Model({ open, hinge, ...props }: ModelProps) {
  const groupie = useRef<THREE.Group | null>(null)
  const { nodes, materials } = useGLTF('/mac-draco.glb') as any
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

  useFrame((state) => {
    if (groupie.current) {
      const t = state.clock.getElapsedTime()
      const { current } = groupie
      current.rotation.x = THREE.MathUtils.lerp(current.rotation.x, open ? Math.cos(t / 10) / 10 + 0.25 : 0, 0.1)
      current.rotation.y = THREE.MathUtils.lerp(current.rotation.y, open ? Math.sin(t / 10) / 4 : 0, 0.1)
      current.rotation.z = THREE.MathUtils.lerp(current.rotation.z, open ? Math.sin(t / 10) / 10 : 0, 0.1)
      current.position.y = THREE.MathUtils.lerp(current.position.y, open ? (-2 + Math.sin(t)) / 3 : -4.3, 0.1)
    }
  })

  // Simplified and separated the JSX for clarity
  return (
    <group
      ref={groupie}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      dispose={null}
    >
      <three.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={materials.aluminium} geometry={nodes['Cube008'].geometry} />
          <mesh material={materials['matte.001']} geometry={nodes['Cube008_1'].geometry} />
          <mesh geometry={nodes['Cube008_2'].geometry} scale={[1, 1, -1]} position={[0, -0.01, -0.18]}>
            <meshBasicMaterial attach='material'>
              <videoTexture attach='map' args={[video]} colorSpace={THREE.SRGBColorSpace} />
            </meshBasicMaterial>
          </mesh>
        </group>
      </three.group>
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
  const { bloomIntensity, luminanceThreshold, luminanceSmoothing } = useControls({
    bloomIntensity: 10,
    luminanceThreshold: 0.5,
    luminanceSmoothing: 20,
  })
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyX') {
        setDebugMode((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
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
      <group rotation={[0, Math.PI, 0]} onClick={() => setOpen(!open)}>
        <LightingControl open={open} />
        <Model open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
      </group>

      <pointLight color={'#fffaea'} position={[0, 5, 0]} intensity={0.1} />
      {/*  <Environment files={'/flatway2k.hdr'} background blur={0.04} /> */}
      {/* <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={1.75} far={4.5} />*/}
      <OrbitControls
        minDistance={10}
        maxDistance={20}
        enablePan={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
      {debugMode &&
        {
          /* <Perf position={'bottom-left'} /> */
        }}
      {/*       <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={luminanceThreshold}
          luminanceSmoothing={luminanceSmoothing}
          height={300}
        />
      </EffectComposer> */}
    </>
  )
}
