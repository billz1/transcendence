//calls
//API call for login
document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    console.log(`Logging in with ${username}, ${password}`);

});

//for registration
document.getElementById("register-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const avatar = document.getElementById("register-avatar").files[0];
    console.log(`Registering with ${username}, ${password}, avatar: ${avatar}`);
    
});
