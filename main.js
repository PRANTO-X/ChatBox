let sideBar = document.querySelector('#sidebar');
let container = document.querySelector('.container');
let sidebarBtn = document.querySelector('.sidebar-btn');

let chatInput = document.querySelector('.chat-input');
let sendBtn = document.querySelector('.send-btn');
let chatContainer = document.querySelector('.chat-container');
let chatWrapper  = document.querySelector('.chat-wrapper');
let themeBtn = document.querySelector('.theme-btn');
let header = document.querySelector('.header')

let firsMessageSent = false;
let history = [];

// Sidebar Control
sidebarBtn.addEventListener('click', () => {
    sideBar.classList.toggle('collapse');
    container.classList.toggle('collapse');
});

// Show header and save 
window.addEventListener('load', () => {
    header.style.display = 'block';
    scrollBottom();
    
    // Load stored history from localStorage
    let storedHistory = JSON.parse(localStorage.getItem('History'));
    if (storedHistory) {
        storedHistory.forEach((chat) => {
            history.push(chat);
        });
        storeHistory();  // Call to store the history (optional based on your needs)
    }
});


// Save history
let saveHistory = ()=>{
    localStorage.setItem('History',JSON.stringify(history));
};

// Store history
let storeHistory = () => {
    let historyContainer = document.querySelector('.history-container');
    historyContainer.innerHTML = ''; 

    history.forEach((chat, index) => {
        let chatList = document.createElement('li');

        // Add the slide-in class 
        if (index === history.length - 1 && !chat.rendered) {
            chatList.classList.add('slide-in');
            chat.rendered = true; 
        }

        chatList.innerHTML = `
            <p class="history"></p>
            <div class="options">
                <span class="delete-btn" onclick="deleteChat(this)">
                    <i class="bi bi-trash"></i>
                </span>
                <span class="search-btn" onclick="searchChat(this)">
                    <i class="bi bi-search"></i>
                </span>
            </div>`;

        chatList.querySelector('.history').textContent = chat.text;

        // Append the new chat item at the top
        historyContainer.prepend(chatList);

        // Remove the slide-in class
        if (chatList.classList.contains('slide-in')) {
            setTimeout(() => {
                chatList.classList.remove('slide-in');
            }, 1000); 
        }
    });
};


//  Delete chat
let deleteChat = (btn)=>{
   
    let removeChat = btn.closest('li'); 
    let removeChatText = removeChat.querySelector('.history').textContent;
    let removeChatIndex = history.findIndex(chat =>chat.text===removeChatText);
    if(removeChatIndex!==-1){
        history.splice(removeChatIndex,1);
        saveHistory();
        removeChat.remove();
    }
    
}
 
// search chat
let searchChat = (btn)=>{
    let searchChat = btn.closest('li'); 
    let searchChatText = searchChat.querySelector('.history').textContent;
    outgoingChat(searchChatText);
    let chatIndex = history.findIndex(chat => chat.text === searchChatText);
    if (chatIndex !== -1) {
        history.splice(chatIndex, 1);
        saveHistory(); 
        storeHistory(); 
    }
};
 

// Create new chat
function createElement(html, ...className) {
    let chatDiv = document.createElement('div');
    chatDiv.classList.add("chat", ...className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

// fetch bot response
let getResponse = async (userMessage)=>{
    return userMessage;
}

// Handling incoming chat
let incomingChat = async (userMessage)=>{
    let botResponse = await getResponse(userMessage);

    let loaderDiv = document.querySelector('.loader-container');
    if(loaderDiv){
        loaderDiv.remove();
    }
      // Create the bot's response message
      let html = `<div class="chat-content">
      <div class="chat-detail">
          <p></p>
      </div>
      <div class="copy-icon">
          <i onclick="copyText(this)" class="bi bi-copy"></i>
      </div>
        </div>`;

    let chatIncomingDiv = createElement(html, "incoming");
    chatContainer.appendChild(chatIncomingDiv);
    chatIncomingDiv.querySelector('p').textContent = botResponse;

    scrollBottom();
}

// Handling outgoing chat
let outgoingChat = (message)=>{
    let userMessage = message || chatInput.value.trim();
    if(userMessage == "") return;

    history.push({ text: userMessage, rendered: false });
    if(!firsMessageSent){
        header.style.display = 'none';
        firsMessage = true;
    }

       // Append the outgoing chat
       let html = `<div class="chat-content">
       <div class="edit-icon">
           <i onclick="editMessage(this)" class="bi bi-pen"></i>
       </div>
       <div class="chat-detail">
           <p></p>
       </div>
     </div>`;

     let outgoingChatDiv = createElement(html,'outgoing','slide-top');
     chatContainer.appendChild(outgoingChatDiv);
     outgoingChatDiv.querySelector('p').textContent = userMessage;
     storeHistory();
     saveHistory();
     scrollBottom();

     chatInput.value = '';
    // add loader
    let loaderHtml = `<div class="chat-content">
    <div class="chat-detail">
        <div class="loader"></div>
    </div>
</div>`;

let loaderDiv = createElement(loaderHtml, "incoming", "loader-container");
chatContainer.appendChild(loaderDiv);
scrollBottom();

// Fetch the bot's response after a delay
setTimeout(() => incomingChat(userMessage), 500);
scrollBottom();
}

// function for SendBtn

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    outgoingChat(); 
});

chatInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        outgoingChat();
    }
});

sendBtn.addEventListener('mousedown', (e) => { 
    e.preventDefault();
}); 

//set textarea height and width
chatInput.addEventListener('input', function() { 
    if (this.value.trim() === '') {
        this.style.height = '50px';
    } else {
        this.style.height = '50px'; 
        this.style.height = this.scrollHeight + 'px'; 
    } 
});

//Get root value
let root = document.documentElement;

let normalWidth = getComputedStyle(root).getPropertyValue('--min-width');
let focusWidth = getComputedStyle(root).getPropertyValue('--max-width');

// set input field width
chatInput.addEventListener('focus', function(){
    this.closest('.typing-content').style.maxWidth = focusWidth;
});

chatInput.addEventListener('blur', function(){
    if (this.value.trim() === '') {
        this.closest('.typing-content').style.maxWidth = normalWidth;
    }
});

// function to handle theme

let body =document.querySelector('body');
let themeIcon = themeBtn.querySelector('i');

let currentTheme = localStorage.getItem('theme') || 'light';

if(currentTheme==='dark'){
    body.classList.add('dark-mode');
    themeIcon.classList.remove('bi-brightness-high');
    themeIcon.classList.add('bi-moon');
}else{
    body.classList.add('light-mode');
    themeIcon.classList.remove('bi-moon');
    themeIcon.classList.add('bi-brightness-high');
}

themeBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');

    if(body.classList.contains('dark-mode')){
        themeIcon.classList.remove('bi-brightness-high');
        themeIcon.classList.add('bi-moon');
        localStorage.setItem('theme','dark')
    }else{
        themeIcon.classList.remove('bi-moon');
        themeIcon.classList.add('bi-brightness-high');
        localStorage.setItem('theme','light');
    }
});

// Function to handle edit btn

let editMessage = (btn)=>{
    let chatContent = btn.closest('.chat-content');
    let chatElement = btn.closest('.chat'); 
    let chatDetail = chatContent.querySelector('.chat-detail');
    let paragraph = chatDetail.querySelector('p');
    let currentText = paragraph.textContent;

    // Replace paragraph with textarea
    let textarea = document.createElement('textarea');
    textarea.value = currentText;
    textarea.classList.add('edit-area');
    chatDetail.replaceChild(textarea,paragraph);
    textarea.focus();

    // save changes
    textarea.addEventListener('blur',()=>{
        let updateText = textarea.value.trim();
        if(updateText === ''){
            updateText = currentText;
        }

        let updateParagraph = document.createElement('p');
        updateParagraph.textContent = updateText;
        chatDetail.replaceChild(updateParagraph,textarea);

        // Remove all the chats below current one
        if(updateText !== currentText){
            let chatIndex = Array.from(chatContainer.children).indexOf(chatElement);
            let totalChats = chatContainer.children.length;

            for(i=totalChats-1;i>chatIndex;i--){
                chatContainer.children[i].remove();
            }

            // Fetch a new response for the updated message
            setTimeout(() => {
                incomingChat(updateText); 
            }, 500);

            scrollBottom();
        }
    })
     // Save changes on pressing Enter
     textarea.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            textarea.blur(); 
        }
    });
}

// Function to handle copy btn
let copyText = (btn)=>{
    // Find the paragraph text to copy
    copyResponse = btn.closest('.chat-content').querySelector('p');
    // Copy text
    if(copyResponse){
        navigator.clipboard.writeText(copyResponse.textContent).then(()=>{
            let copyIcon = btn.closest('.copy-icon').querySelector('i');
            if (copyIcon) {
                copyIcon.classList.remove('bi-copy');
                copyIcon.classList.add('bi-check2');

                setTimeout(() => {
                    copyIcon.classList.remove('bi-check2');
                    copyIcon.classList.add('bi-copy');
                }, 1000);
            }
        })
    }
}


let newChatBtn = document.querySelector('.new-chat-btn');

// function to handle newChatBtn
newChatBtn.addEventListener('click', () => {
    chatContainer.innerHTML = '';
    chatInput.value = '';

    chatWrapper.scrollTo({
        top: 0, 
        behavior: "smooth",
    });

    header.style.display = 'block';
    let loaderDiv = document.querySelector('.loader-container');
    if (loaderDiv) {
        loaderDiv.remove();  
    }
    chatInput.style.height = '50px'; 
});


// Function for scroll
let scrollBottom = () => {
    chatWrapper.scrollTo({
        top: chatWrapper.scrollHeight,
        behavior: "smooth",
    });
};