document.addEventListener("DOMContentLoaded", () => {
    createHeader();
    createMain();
    createFooter();
});

function createHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <nav>
            <ul class="navLinks">
                <li><a href="#home">Home</a></li>
                <li><a href="#login">Login</a></li>
                <li><a href="#register">Register</a></li>
            </ul>
        </nav>
    `;
    document.body.appendChild(header);
}

function createMain() {
    const main = document.createElement('main');
    main.innerHTML = `
        <section id="content">
            <h2>Welcome to the Shop</h2>
        </section>
    `;
    document.body.appendChild(main);
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <p>My shop</p>
    `;
    document.body.appendChild(footer);
}