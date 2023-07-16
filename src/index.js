import * as THREE from 'three';
function Animate() {
    setTimeout(() => {
        requestAnimationFrame( Animate );
    }, 1000 / fps);
    const now = Date.now();
    const dt = now - lastUpdateTime;
    lastUpdateTime = now;
    if(world != undefined){        
        world.Step(dt/1000.0);
        world.Render();
    }
}

function InitScene()
{
    world = new World();
    window.addEventListener( 'resize', onWindowResize, false );
    lastUpdateTime = Date.now();
    Animate();
}

export {InitScene, Animate};