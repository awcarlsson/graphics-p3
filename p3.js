window.onload = function() {

    var canvas = document.getElementById('p3Canvas')

    var speed = document.getElementById('speed')

    var context = canvas.getContext('2d')

    var stack = [mat3.create()]

    var shipsAngle = 0
    var radarAngle = 0
    var plane1Angle = 0
    var plane2Angle = 0
    var plane3Angle = 0
    var plane4Angle = 0
    var plane5Angle = 0

    function moveToTx(x,y) {
        var res=vec2.create()
        vec2.transformMat3(res,[x,y],stack[0])
        context.moveTo(res[0],res[1])
    }

	function lineToTx(x,y){
        var res=vec2.create()
        vec2.transformMat3(res,[x,y],stack[0])
        context.lineTo(res[0],res[1])
    }

    function draw() {

        s = parseInt(speed.value)
        s = s/100

        shipsAngle = (shipsAngle - 0.001*s) % (2*Math.PI)
        radarAngle = (radarAngle - 0.009*s) % (2*Math.PI)
        plane1Angle = (plane1Angle - 0.008*s) % (2*Math.PI)
        plane2Angle = (plane2Angle - 0.02*s) % (2*Math.PI)
        plane3Angle = (plane3Angle - 0.02*s) % (2*Math.PI)
        plane4Angle = (plane4Angle - 0.007*s) % (2*Math.PI)
        plane5Angle = (plane5Angle - 0.005*s) % (2*Math.PI)

        // clear old frame
        canvas.width = canvas.width
        context.fillStyle = "#79b0fc";
        var grd = context.createLinearGradient(0, 0, 1000, 200);
        grd.addColorStop(0, "#6eabff");
        grd.addColorStop(0.4, "#4f9bff");
        grd.addColorStop(0.8, "#c2dcff");
        grd.addColorStop(1, "#549dff");
        context.fillStyle = grd
        context.fillRect(0, 0, canvas.width, canvas.height);

        // draws battleships and planes

        // nested:
        // origin
        // -> boat1
        // -> -> plane1
        // -> -> -> plane3
        // -> -> plane2
        // -> boat2
        // -> -> plane4
        // -> plane5
        // -> plane6
        // -> -> plane7

        // TRANSLATES ORIGIN TO CENTER OF CANVAS
        stack.unshift(mat3.clone(stack[0]))
        var Torigin_to_canvas = mat3.create()
        mat3.fromTranslation(Torigin_to_canvas,[600,400]) // sets origin at center of canvas
        mat3.multiply(stack[0],stack[0],Torigin_to_canvas)

        // ROTATES AROUND ORIGIN
        stack.unshift(mat3.clone(stack[0]))
        var Trotate_to_origin = mat3.create()
        mat3.rotate(Trotate_to_origin, Trotate_to_origin, shipsAngle) // rotates ships around center
        mat3.multiply(stack[0],stack[0],Trotate_to_origin)
        drawBoat(0,-200) // boat 1

        // REVERSES DIRECTION OF BOAT 2
        stack.unshift(mat3.clone(stack[0]))
        var Treversed_to_rotate = mat3.create()
        mat3.scale(Treversed_to_rotate,Treversed_to_rotate,[-1,1])
        mat3.multiply(stack[0],stack[0],Treversed_to_rotate)
        drawBoat(0, 200)
        
        // CENTERS ON BOAT 2 AND ROTATES PLANE AROUND
        stack.unshift(mat3.clone(stack[0]))
        var Tplane1_to_reversed = mat3.create()
        mat3.fromTranslation(Tplane1_to_reversed,[0,200])
        mat3.rotate(Tplane1_to_reversed,Tplane1_to_reversed,plane1Angle)
        mat3.multiply(stack[0],stack[0],Tplane1_to_reversed)
        drawPlane1(100)
        
        // RETURNS TO ROTATED CANVAS AT CENTER
        stack.shift()
        stack.shift()

        // TRANSLATES ORIGIN TO BOAT 1
        stack.unshift(mat3.clone(stack[0]))
        var Tboat1_to_rotate = mat3.create()
        mat3.fromTranslation(Tboat1_to_rotate,[0,-250]) // translates to boat 1 as origin
        mat3.multiply(stack[0],stack[0],Tboat1_to_rotate)

        // ROTATES PLANES AROUND BOAT 1
        stack.unshift(mat3.clone(stack[0]))
        var Tplane1_to_boat1 = mat3.create()
        mat3.rotate(Tplane1_to_boat1,Tplane1_to_boat1,plane1Angle) // rotates plane 1 around boat 1
        mat3.multiply(stack[0],stack[0],Tplane1_to_boat1)
        drawPlane1(300)

        stack.unshift(mat3.clone(stack[0]))
        var Tplane3_to_plane1 = mat3.create()
        mat3.fromTranslation(Tplane3_to_plane1,[0,300])
        mat3.rotate(Tplane3_to_plane1,Tplane3_to_plane1,plane3Angle) // rotates plane 3 around plane 1
        mat3.multiply(stack[0],stack[0],Tplane3_to_plane1)
        drawPlane2(100)

        stack.shift()
        stack.shift()

        stack.unshift(mat3.clone(stack[0]))
        var Tplane2_to_boat1 = mat3.create()
        mat3.rotate(Tplane2_to_boat1,Tplane2_to_boat1,plane2Angle) // rotates plane 2 around boat 1
        mat3.multiply(stack[0],stack[0],Tplane2_to_boat1)
        drawPlane2(60)

        // RETURNS TO STILL CANVAS AT ORIGIN (CENTER)
        stack.shift()
        stack.shift()
        stack.shift()

        // ROTATES PLANE 4 AROUND ORIGIN
        stack.unshift(mat3.clone(stack[0]))
        var Tplane4_to_origin = mat3.create()
        mat3.rotate(Tplane4_to_origin,Tplane4_to_origin,plane4Angle)
        mat3.multiply(stack[0],stack[0],Tplane4_to_origin)
        drawPlane1(400)
        stack.shift()

        // ROTATES PLANE 5 AROUND ORIGIN
        stack.unshift(mat3.clone(stack[0]))
        var Tplane5_to_origin = mat3.create()
        mat3.rotate(Tplane5_to_origin,Tplane5_to_origin,plane5Angle)
        mat3.multiply(stack[0],stack[0],Tplane5_to_origin)
        drawPlane2(300)

        // ROTATES PLANE 6 AROUND PLANE 5
        stack.unshift(mat3.clone(stack[0]))
        var Tplane6_to_plane5 = mat3.create()
        mat3.fromTranslation(Tplane6_to_plane5,[0,300])
        mat3.rotate(Tplane6_to_plane5,Tplane6_to_plane5,-plane2Angle)
        mat3.scale(Tplane6_to_plane5,Tplane6_to_plane5,[-1,1])
        mat3.multiply(stack[0],stack[0],Tplane6_to_plane5)
        drawPlane2(90)

        // RETURNS TO INITIAL CANVAS
        stack.shift()
        stack.shift()
        stack.shift()

        window.requestAnimationFrame(draw);
    }

    function drawBoat(shipX, shipY) {

        stack.unshift(mat3.clone(stack[0])) // saves initial canvas

        // battleship shadow
        context.lineWidth = 10
        context.strokeStyle = "#404f63"
        var shadowOffset = 10

        var Tship_to_curr = mat3.create()
        mat3.fromTranslation(Tship_to_curr,[shipX,shipY]) // translates to ship location
        mat3.multiply(stack[0],stack[0],Tship_to_curr)

        context.beginPath()
        moveToTx(-110+shadowOffset, -25+shadowOffset)
        lineToTx(-10+shadowOffset, -30+shadowOffset)
        lineToTx(shadowOffset, -40+shadowOffset)
        lineToTx(110+shadowOffset, -30+shadowOffset)
        lineToTx(110+shadowOffset, 25+shadowOffset)
        lineToTx(shadowOffset, 40+shadowOffset)
        lineToTx(-10+shadowOffset, 30+shadowOffset)
        lineToTx(-110+shadowOffset, 25+shadowOffset)
        context.closePath()
        context.fillStyle="#404f63";
        context.fill()

        // battleship body
        context.lineWidth = 10
        context.strokeStyle = "#7a8187"
        context.beginPath()
        moveToTx(-110, -25)
        lineToTx(-10, -30)
        lineToTx(0, -40)
        lineToTx(110, -30)
        lineToTx(110, 25)
        lineToTx(0, 40)
        lineToTx(-10, 30)
        lineToTx(-110,25)
        context.closePath()
        context.fillStyle="#989b9e";
        context.fill()
        context.stroke()

        // runway
        context.lineWidth = 4
        context.strokeStyle = "white"
        context.beginPath()
        moveToTx(-105, -15)
        lineToTx(10, -15)
        moveToTx(-105, 15)
        lineToTx(10, 15)
        moveToTx(-105, 0)
        for (i = 5; i < 120; i+=10) {
            lineToTx(i-110, 0)
            moveToTx(i-105, 0)
        }
        context.closePath()
        context.stroke()

        // bridge
        context.strokeStyle = "#545557"
        context.beginPath()
        moveToTx(50, -35)
        lineToTx(100, -31)
        lineToTx(99, -10)
        lineToTx(48, -14)
        context.closePath()
        context.fillStyle="#696969";
        context.fill()
        context.stroke()

        // rotating radar
        stack.unshift(mat3.clone(stack[0]))
        var Tradar_to_ship = mat3.create()
        mat3.fromTranslation(Tradar_to_ship,[74,-23]) // translates to center of radar
        mat3.rotate(Tradar_to_ship,Tradar_to_ship,radarAngle)
        mat3.multiply(stack[0],stack[0],Tradar_to_ship)
        drawRadar()

        stack.shift() // restores to ship location
        stack.shift() // restores to canvas
    }

    function drawRadar() {
        context.strokeStyle = "#4e5052"
        context.lineWidth = 10
        context.beginPath()
        moveToTx(-20,0)
        lineToTx(20,0)
        context.stroke()
    }

    function drawPlane1(distanceFromShip1) {

        // main wings
        context.strokeStyle = "#363d35"
        context.beginPath()
        moveToTx(10,distanceFromShip1-5)
        lineToTx(-8,distanceFromShip1-55)
        lineToTx(2,distanceFromShip1-55)
        lineToTx(30,distanceFromShip1-5)
        lineToTx(30,distanceFromShip1+7)
        lineToTx(2,distanceFromShip1+57)
        lineToTx(-8,distanceFromShip1+57)
        lineToTx(10,distanceFromShip1+7)
        context.closePath()
        context.fillStyle="#363d35"
        context.fill()

        // tail fins
        context.beginPath()
        moveToTx(-32,distanceFromShip1)
        lineToTx(-42, distanceFromShip1-20)
        lineToTx(-38,distanceFromShip1-20)
        lineToTx(-26, distanceFromShip1)
        lineToTx(-26, distanceFromShip1+2)
        lineToTx(-38,distanceFromShip1+22)
        lineToTx(-42, distanceFromShip1+22)
        lineToTx(-32,distanceFromShip1+2)
        context.closePath()
        context.fillStyle="#363d35"
        context.fill()
        context.stroke()

        // plane body
        context.strokeStyle = "#4f5c4d"
        context.beginPath()
        moveToTx(-40,distanceFromShip1)
        lineToTx(-20,distanceFromShip1-5)
        lineToTx(50,distanceFromShip1-5)
        //arcToTx(50, distanceFromShip1+1, 6, 3 * Math.PI/2, Math.PI/2)
        lineToTx(56, distanceFromShip1+1)
        lineToTx(50,distanceFromShip1+7)
        lineToTx(-20, distanceFromShip1+7)
        lineToTx(-40,distanceFromShip1+2)
        context.closePath()
        context.fillStyle="#4f5c4d"
        context.fill()
    }

    function drawPlane2(distanceFromObject) {

        context.lineWidth = 2
        context.strokeStyle="#4d637a"
        context.beginPath()
        moveToTx(-20,distanceFromObject)
        lineToTx(-18, distanceFromObject-8)
        lineToTx(-12, distanceFromObject-8)
        lineToTx(-6, distanceFromObject)
        lineToTx(-2, distanceFromObject-20)
        lineToTx(4, distanceFromObject-20)
        lineToTx(16, distanceFromObject)
        lineToTx(32, distanceFromObject+2)
        lineToTx(36, distanceFromObject+6)
        lineToTx(50, distanceFromObject+10) // point
        lineToTx(36, distanceFromObject+14)
        lineToTx(32, distanceFromObject+18)
        lineToTx(16, distanceFromObject+20)
        lineToTx(4, distanceFromObject+40)
        lineToTx(-2, distanceFromObject+40)
        lineToTx(-6, distanceFromObject+20)
        lineToTx(-12, distanceFromObject+28)
        lineToTx(-18, distanceFromObject+28)
        lineToTx(-20,distanceFromObject+20)
        lineToTx(-14,distanceFromObject+14)
        lineToTx(-14,distanceFromObject+6)
        context.closePath()
        context.fillStyle="#697f96"
        context.fill()
        context.stroke()

        context.beginPath()
        context.strokeStyle="#091e33"
        context.fillStyle="#091e33"
        moveToTx(24,distanceFromObject+6)
        lineToTx(32,distanceFromObject+10)
        lineToTx(24,distanceFromObject+14)
        lineToTx(16,distanceFromObject+10)
        //ellipseToTx(24, distanceFromObject+10, 8, 4, 0, 0, 2*Math.PI)
        context.closePath()
        context.fill()
    }

    window.requestAnimationFrame(draw);
    draw()
}