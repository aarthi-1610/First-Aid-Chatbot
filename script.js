function sendMessage() {
    let userInput = document.getElementById("user-input");
    let chatBox = document.getElementById("chat-box");
    let messageText = userInput.value.trim();

    if (messageText !== "") {
        let userMessage = document.createElement("div");
        userMessage.className = "user-message";
        userMessage.textContent = messageText;
        chatBox.appendChild(userMessage);

        fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: messageText })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.response) {
                throw new Error("Invalid server response");
            }

            let botMessage = document.createElement("div");
            botMessage.className = "bot-message";
            botMessage.textContent = data.response;
            chatBox.appendChild(botMessage);

            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            console.error("Error:", error);
            let errorMessage = document.createElement("div");
            errorMessage.className = "bot-message";
            errorMessage.textContent = "Error: Unable to connect to the server.";
            chatBox.appendChild(errorMessage);
        });

        userInput.value = "";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
