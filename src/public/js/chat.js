const socket = io();

        document.getElementById('form').addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('m').value;

            // Enviar el mensaje con el nombre y correo del usuario
            socket.emit('chat message', { user: username, correoDelUsuario: email, message });
            document.getElementById('m').value = '';
        });

        socket.on('chat message', function (msg) {
            const listItem = document.createElement('li');
            listItem.textContent = `${msg.user} (${msg.correoDelUsuario}): ${msg.message}`;
            document.getElementById('messages').appendChild(listItem);
        });