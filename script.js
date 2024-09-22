async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const chatOutput = document.getElementById('chat-output');

    if (userInput.trim() === "") return;

    chatOutput.innerHTML += `<p><strong>Sen:</strong> ${userInput}</p>`;
    
    const loadingElement = document.createElement('p');
    loadingElement.id = 'loading';
    loadingElement.innerHTML = `<strong>Chat:</strong> Yazıyor...`;
    chatOutput.appendChild(loadingElement);

    document.getElementById('user-input').value = "";

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: userInput })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        document.getElementById('loading').remove();

        chatOutput.innerHTML += `<p><strong>Chat:</strong> ${data.response}</p>`;
    } catch (error) {
        console.error("Bir hata oluştu:", error);
        document.getElementById('loading').remove();
        chatOutput.innerHTML += `<p><strong>Hata:</strong> Yanıt alınamadı. Lütfen daha sonra tekrar deneyin.</p>`;
    }

    chatOutput.scrollTop = chatOutput.scrollHeight;
}

document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
