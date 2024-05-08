import "./styles/main.css"

class App {
  id: string

  constructor(id: string) {
    this.id = id
  }

  start(): void {
    const main = document.createElement("div")
    main.id = this.id
    document.body.append(main)
  }
}

const app = new App("app")
app.start()

