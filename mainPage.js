document.addEventListener("DOMContentLoaded", () => {
  createHeader();
  createMainContent();
  createFooter();
});

function createHeader() {
  const header = document.createElement("header");
  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  const navLinks = ["Home", "Login", "Register"];
  navLinks.forEach((linkText) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${linkText.toLowerCase()}`;
    a.textContent = linkText;
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  header.appendChild(nav);

  document.body.appendChild(header);
}

function createMainContent() {
  const main = document.createElement("main");
  const section = document.createElement("section");
  section.id = "content";

  const h2 = document.createElement("h2");
  h2.textContent = "Welcome to the Shop!";

  const p = document.createElement("p");
  p.textContent = "Shop Content.";

  section.appendChild(h2);
  section.appendChild(p);
  main.appendChild(section);

  document.body.appendChild(main);
}

function createFooter() {
  const footer = document.createElement("footer");
  const p = document.createElement("p");
  p.textContent = "© Shop Footer";

  footer.appendChild(p);
  document.body.appendChild(footer);
}
