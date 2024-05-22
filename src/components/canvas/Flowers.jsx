import { Canvas } from '@react-three/fiber'
import { PresentationControls } from '@react-three/drei'
//import { EffectComposer, SSAO, Bloom, DepthOfField, Vignette, BrightnessContrast, HueSaturation } from '@react-three/postprocessing'

//import { MeshBasicMaterial } from 'three'
import { Splat } from '@react-three/drei'

export default function Flowers() {
  return (
    <>
      <ambientLight color={'white'} intensity={10} />
      {/* <Center rotation={[-0.5, -0.25, 0]}>
      <Text3D
          curveSegments={8}
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.1}
          height={0.1}
          lineHeight={0.5}
          letterSpacing={0}
          size={1}
          font="/zenhand.json">
          {`hello\nworld`}
         <meshBasicMaterial color={"black"}/>
        </Text3D></Center> */}
      <PresentationControls
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 1, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <Splat scale={3} rotation={[0, -0.7 * Math.PI, 0]} src='flowers_white.splat' />
      </PresentationControls>

       </>
  )
}
