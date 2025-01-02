document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navButtons = document.querySelectorAll("nav button");

    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            sections.forEach((section) => section.classList.add("hidden"));
            const target = button.id.replace("nav-", "");
            document.getElementById(`${target}-section`).classList.remove("hidden");
        });
    });
});
