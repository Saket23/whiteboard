paper.install(window);
window.onload = function () {

    //fetch('http://localhost:5000/').then(r => console.log('request test', r));

    let socket = io.connect("http://localhost:5000/")

    //Getting the name
    let nameZone = document.querySelector(".name-zone")
    let name = document.querySelector(".name-input");
    let nameSendButton = document.querySelector(".name-input-button")

    nameSendButton.addEventListener('click', function () {
        if (name.value) {
            console.log('name', name.value)
            socket.emit("change_username", { username: name.value })
            nameZone.innerHTML = `<div>Hello ${name.value} </div>`;
        }
    })


    //sending the message
    let message = document.querySelector(".send-input")
    let messageSendButton = document.querySelector(".send-input-button")

    messageSendButton.addEventListener('click', function () {
        if (message.value) {
            console.log('message', message.value)
            socket.emit("new_message", { message: message.value })
        }
    })

    //adding the message
    let messageZone = document.querySelector(".message-zone")
    socket.on("new_message", (data) => {
        console.log("new message", data)
        let messageNode = document.createElement("DIV")
        messageNode.className = "message-box";
        let nameMessageNode = document.createElement("DIV")
        nameMessageNode.className = "message-name";
        nameMessageNode.innerHTML = data.username;
        let newMessageNode = document.createElement("DIV")
        newMessageNode.className = "message"
        newMessageNode.innerHTML = data.message
        messageNode.appendChild(nameMessageNode)
        messageNode.appendChild(newMessageNode)
        messageZone.appendChild(messageNode)
    })


    //canvas
    paper.setup('myCanvas');
    // Create a simple drawing tool:
    let tool = new Tool();
    let path;
    let pencil = {}
    let layer = new Layer();
    layer.name = 'paper';
    layer.activate();

    // Define a mousedown and mousedrag handler
    tool.onMouseDown = function (event) {
        path = new Path();
        path.strokeColor = 'black';
        path.add(event.point);
    }

    tool.onMouseDrag = function (event) {
        path.add(event.point);
        pencil.position = event.point
    }

    tool.onMouseUp = function () {
        const { x, y } = pencil.position;
        let positionAtMouseUp = new Point(x, y);

        let pathObj = {
            paperObj: path.exportJSON({ precision: 2 }),
            finalPosition: positionAtMouseUp
        }
        console.log(project)
        socket.emit("add_path", { pathObj })
    }

    //draw from others.
    socket.on("add_path", function (data) {
        project.layers.paper.addChild(project.importJSON(data.data.pathObj.paperObj))
    })
}