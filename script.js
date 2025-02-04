let prompt = document.querySelector("#prompt-input");
let ChatContainer = document.querySelector(".chat-container");
let btnsubmit = document.querySelector(".btn-sub");
let imageBtn = document.querySelector("#btn-img");
let img = document.querySelector("#btn-img img");
let imageInput = document.querySelector('#btn-img input')

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD5dyYuoCLVDyuoBwkwndrTIbCKYWUDLKU"

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }

}
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-text")
    let RequestOption = {
        method: "POST",
        Headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [{ "text": user.message },(user.file.data?[{"inline_data":user.file}]:[])
                    ]
                }]

        })
    }
    try {
        let response = await fetch(Api_Url, RequestOption)
        let data = await response.json()
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()

        text.innerHTML = apiResponse;
    }
    catch (e) {
        console.log(e);
    }
    finally {
        ChatContainer.scrollTo({ top: ChatContainer.scrollHeight, behavior: "smooth" })
        img.src= `img.svg`
        img.classList.remove("choose")
        user.file={ }
    }

}

function creatChatBox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}
// userdata
function handleChatResponse(message) {
    user.message = message
    let html = `<img src="image copy.png" alt="" id="UserImg" width="50">
            <div class="user-text">
                ${user.message}
                ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}"
                   class="chooseimg"/>`:" "}
            </div>`
    prompt.value = ""
    let userChatbox = creatChatBox(html, ".user-chat-box")
    ChatContainer.appendChild(userChatbox)

    ChatContainer.scrollTo({ top: ChatContainer.scrollHeight, behavior: "smooth" })

    setTimeout(() => {
        let html = `<img src="image.png" alt="" id="aiImg"width="50">
            <div class="ai-text">
         <img src="loading.webp" class="loadingImg" style="width: 60px;">

            </div>`
        let aiChatBox = creatChatBox(html, '.ai-chat-box')
        ChatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)

    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handleChatResponse(prompt.value)

    }

})
btnsubmit.addEventListener("click", () => {
    handleChatResponse(prompt.value)

})
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0]
    if (!file) return
    let reader = new FileReader()
    reader.onload = (e) => {
       
        let base64string = e.target.result.split(",")[1]
        user.file = {
            mime_type: file.type,
            data: base64string
        }
    
        img.src= `data:${user.file.mime_type};base64,${user.file.data}`
    img.classList.add("choose")
    }
    reader.readAsDataURL(file)
})


imageBtn.addEventListener("click", () => {
    imageBtn.querySelector('input').click()
    
})