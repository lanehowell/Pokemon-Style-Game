const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let offset = {x: -375, y: -505}

const collisionsMap = []
for(let i = 0; i < collisions.length; i+=70){ // iterator should be the width of your map in tiles
    collisionsMap.push(collisions.slice(i, i + 70))
}

const battleZonesMap = []
for(let i = 0; i < battleZonesData.length; i+=70){ // iterator should be the width of your map in tiles
    battleZonesMap.push(battleZonesData.slice(i, i + 70))
}

const boundaries = []
collisionsMap.forEach((row, i)=>{
    row.forEach((symbol, j)=>{
        if(symbol === 1025){
            boundaries.push(new Boundary({position:{x: j*Boundary.width + offset.x, y: i*Boundary.height + offset.y}}))
        }
    })
})

const battleZones = []
battleZonesMap.forEach((row, i)=>{
    row.forEach((symbol, j)=>{
        if(symbol === 1025){
            battleZones.push(new Boundary({position:{x: j*Boundary.width + offset.x, y: i*Boundary.height + offset.y}}))
        }
    })
})

console.log(battleZones)

// Create Map
const image = new Image()
image.src = './img/Pellet Town.png'

// Create Foreground
const foregroundImage = new Image()
foregroundImage.src = './img/Pellet Town Foreground.png'

//Create Player
const playerDownImage = new Image()
playerDownImage.src = './img/player/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/player/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/player/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/player/playerRight.png'

const player = new Sprite({
    position: {x: canvas.width/2 - (192/4)/2, y: canvas.height/2 - 68/2},
    image: playerDownImage,
    frames: {max: 4},
    sprites: {up: playerUpImage, left: playerLeftImage, right: playerRightImage, down: playerDownImage}
})

const background = new Sprite({
    position: {x: offset.x, y: offset.y},
    image: image
})

const foreground = new Sprite({
    position: {x: offset.x, y: offset.y},
    image: foregroundImage
})

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2. position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone =>{
        battleZone.draw()
    })
    player.draw()
    foreground.draw()

    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        for(let i = 0; i<battleZones.length; i++){
            const battleZone = battleZones[i]
            if(rectangularCollision({rectangle1: player, rectangle2: battleZone})){
                console.log('in battlezone')
                break
            }
        }
    }

    let moving = true
    player.moving = false
    if(keys.w.pressed && lastKey === 'w'){
        player.moving = true
        player.image = player.sprites.up
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i]
            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {x: boundary.position.x, y:boundary.position.y + 1}}})){
                moving = false
                break
            }
        }
        if(moving) movables.forEach(movable =>{movable.position.y += 1})
    }
    else if(keys.s.pressed && lastKey === 's'){
        player.moving = true
        player.image = player.sprites.down
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i]
            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {x: boundary.position.x, y:boundary.position.y - 1}}})){
                moving = false
                break
            }
        }
        if(moving) movables.forEach(movable =>{movable.position.y -= 1})
    } 
    else if(keys.a.pressed && lastKey === 'a'){
        player.moving = true
        player.image = player.sprites.left
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i]
            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {x: boundary.position.x + 1, y:boundary.position.y}}})){
                moving = false
                break
            }
        }
        if(moving) movables.forEach(movable =>{movable.position.x += 1})
    } 
    else if(keys.d.pressed && lastKey === 'd'){
        player.moving = true
        player.image = player.sprites.right
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i]
            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {x: boundary.position.x - 1, y:boundary.position.y}}})){
                moving = false
                break
            }
        }
        if(moving) movables.forEach(movable =>{movable.position.x -= 1})
    } 
}

animate()

window.addEventListener('keydown', (e)=>{
    if(e.key === 'w'){
        keys.w.pressed = true
        lastKey = 'w'
    }
    if(e.key === 'a'){
        keys.a.pressed = true
        lastKey = 'a'
    }
    if(e.key === 's'){
        keys.s.pressed = true
        lastKey = 's'
    }
    if(e.key === 'd'){
        keys.d.pressed = true
        lastKey = 'd'
    }
})

window.addEventListener('keyup', (e)=>{
    if(e.key === 'w'){
        keys.w.pressed = false
    }
    if(e.key === 'a'){
        keys.a.pressed = false
    }
    if(e.key === 's'){
        keys.s.pressed = false
    }
    if(e.key === 'd'){
        keys.d.pressed = false
    }
})

