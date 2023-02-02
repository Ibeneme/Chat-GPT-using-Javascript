import bot from './assets/open.png'
import user from './assets/bot.png'

const form = document.getElementById('form')
const chatContainer = document.getElementById('chat_container')

let loadInterval

function loader(e) {
    e.textContent = ''

    loadInterval = setInterval(() => {
        
        e.textContent += '.';

       
        if (e.textContent === '......') {
            e.textContent = '';
        }
    }, 500);
}

function typeText(e, text) {
    let i = 0

    let interval = setInterval(() => {
        if (i < text.length) {
            e.innerHTML += text.charAt(i)
            i++
        } else {
            clearInterval(interval)
        }
    }, 20)
}
function generateUniqueId() {
    const timing = Date.now();
    const randomNum = Math.random();
    const decimalString = randomNum.toString(16);

    return `id-${timing}-${decimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))


    form.reset()


    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    chatContainer.scrollTop = chatContainer.scrollHeight;


    const messageDiv = document.getElementById(uniqueId)


    loader(messageDiv)

    const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})