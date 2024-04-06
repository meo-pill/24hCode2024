import fetch from "node-fetch"
import io from "socket.io-client"
import 'dotenv/config'

class Api {
	canvas_id = 1
	url = `http://149.202.79.34:8085/api/`
	headers = {
		Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
	}
	socket = io('ws://149.202.79.34:8085/api/socket', {
		auth: {
			token: process.env.MDP,
		}
	})

	async listEquipe() { }

	async getEquipeDetails() { }

	async getCanvaData() {
		const response = await fetch(`${this.url}canvas/${this.canvas_id}`, {
			method: "GET",
			headers: this.headers,
		})

		return response.json()
	}

	async getCanvaSettings() { }

	async getWorkerDetails() { }

	async setWorkerPosition() { }
}

const api = new Api()

console.log(await api.getCanvaData())