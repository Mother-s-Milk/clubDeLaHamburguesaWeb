document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".sidebar");
    const toggleButton = document.getElementById("toggle-button");

    toggleButton.addEventListener("click", () => {
        navbar.classList.toggle('collapsed');
    });
});