import "./aboutUs.css";
import { TeamMember } from "../../interfaces/aboutUs/aboutUsInterfaces.ts";

const teamMembers: TeamMember[] = [
  {
    name: "Victoria Tonkovich",
    position: "Frontend-developer",
    description:
      "Victoria holds a background in web design and has experience as an HTML-developer and web -developer. Her leadership and technical skills have been pivotal in guiding the team and ensuring the project's success.",
    imageUrl: "../assets/images/victoria.jpg",
    link: "https://github.com/vicadin",
  },
  {
    name: "Natalya Pirozerskaya",
    position: "Frontend-developer",
    description:
      "Natalia has a technical background in computer maintenance and a nearly completed degree in applied computer science in economics. She has also managed a retail store and her own online clothing business.",
    imageUrl: "../assets/images/natalya.jpg",
    link: "https://github.com/pirnataly",
  },
  {
    name: "Yaroslav Turkov",
    position: "Frontend-developer",
    description:
      "Yaroslav, a trained surgeon, brings a unique perspective to our team. His analytical skills and precision have translated seamlessly into the world of software development.",
    imageUrl: "../assets/images/yaroslav.png",
    link: "https://github.com/Yaroslav888111",
  },
];

export default class AboutUsPage {
  private title: HTMLElement;
  private introductionText: HTMLElement;
  private aboutUsContainer: HTMLElement;
  private teamContainer: HTMLElement;
  private logoContainer: HTMLElement;
  private logoIcon: HTMLImageElement;
  private finalText: HTMLElement;

  constructor() {
    this.title = document.createElement("h1");
    this.title.innerText = "About Us";
    this.title.classList.add("title");

    this.introductionText = this.createHTMLElement(
      "p",
      { class: "text-desc" },
      "We are excited to introduce you to the talented individuals who have contributed to the creation of our successful e-commerce platform for cosmetics.<br><br>Our team's synergy, dedication, and expertise have been instrumental in bringing this project to life. Our team consists of diverse professionals who have each brought their unique skills and experiences to the table. Through effective collaboration and a shared vision, we have developed an innovative and user-friendly online store. Each team member has played a crucial role in our journey, from conceptualization to implementation.",
    );

    this.aboutUsContainer = document.createElement("div");
    this.aboutUsContainer.classList.add("aboutUs-container");

    this.teamContainer = this.createHTMLElement("div", { class: "team-container" });

    this.logoContainer = document.createElement("div");
    this.logoContainer.innerHTML = `with support from <a href="https://rs.school/" target="_blank">The Rolling Scopes School</a>`;
    this.logoIcon = document.createElement("img");
    this.logoIcon.src = "../assets/icons/rss.svg";
    this.logoContainer.appendChild(this.logoIcon);

    this.logoContainer.classList.add("logo-container");

    this.finalText = this.createHTMLElement(
      "p",
      { class: "text-desc" },
      "Our team’s success is a result of exceptional collaboration and communication. Despite our diverse backgrounds, we have come together with a common goal: to create an outstanding e-commerce platform. Regular meetings, code reviews, and brainstorming sessions have allowed us to leverage each other's strengths and overcome obstacles efficiently.",
    );
  }

  public async render(container: HTMLElement): Promise<void> {
    container.appendChild(this.title);
    this.aboutUsContainer.appendChild(this.introductionText);
    this.aboutUsContainer.appendChild(this.teamContainer);
    container.appendChild(this.aboutUsContainer);

    container.appendChild(this.finalText);
    container.appendChild(this.logoContainer);

    this.displayTeamMembers();
  }

  private createHTMLElement(
    tag: string,
    attributes: { [key: string]: string },
    innerHTML?: string,
  ): HTMLElement {
    const element = document.createElement(tag);
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    return element;
  }

  private createTeamMemberElement(member: TeamMember): HTMLElement {
    const memberElement = this.createHTMLElement("div", { class: "team-member" });

    const img = this.createHTMLElement("img", { src: member.imageUrl, alt: member.name });
    memberElement.appendChild(img);

    const name = this.createHTMLElement("h3", {}, member.name);
    memberElement.appendChild(name);

    const position = this.createHTMLElement(
      "p",
      { class: "member-position" },
      `<strong>${member.position}</strong>`,
    );
    memberElement.appendChild(position);

    const description = this.createHTMLElement(
      "p",
      { class: "member-description" },
      member.description,
    );
    memberElement.appendChild(description);

    const link = this.createHTMLElement(
      "a",
      { class: "member-link", href: member.link, target: "_blank" },
      member.link,
    );
    memberElement.appendChild(link);

    return memberElement;
  }

  private displayTeamMembers(): void {
    teamMembers.forEach((member) => {
      const memberElement = this.createTeamMemberElement(member);
      this.teamContainer.appendChild(memberElement);
    });
  }
}
