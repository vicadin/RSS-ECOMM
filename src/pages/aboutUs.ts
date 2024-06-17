import AboutUs from "../components/aboutUs/aboutUs.ts";

export default function AboutUsPage() {
  const basketForm = new AboutUs();
  const container = document.getElementById("content");
  if (container) {
    basketForm.render(container);
  }
}
