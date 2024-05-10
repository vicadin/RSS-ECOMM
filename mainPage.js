document.addEventListener("DOMContentLoaded", () => {
    createHeader();
    createMain();
    createFooter();
});

function createHeader() {
    const header = document.createElement("header");

    const nav = document.createElement("nav");

    const ul = document.createElement("ul");

    const navLinks = ["Home", "Login", "Register"];
    navLinks.forEach(linkText => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${linkText.toLowerCase()}`;
        a.textContent = linkText;
        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    header.appendChild(h1);
    header.appendChild(nav);

    document.body.appendChild(header);
}

function createMainContent() {
    const main = document.createElement("main");

    const mainSection = document.createElement("section");

    mainSection.id = "content";

    const p = document.createElement("p");
    p.textContent = "Shop Main";

    mainSection.appendChild(p);
    main.appendChild(mainSection);

    document.body.appendChild(main);
}

function createFooter() {
    const footer = document.createElement("footer");

    const p = document.createElement("p");
    p.textContent = "Shop Footer";

    footer.appendChild(p);
    document.body.appendChild(footer);
}