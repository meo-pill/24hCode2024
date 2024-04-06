import fetch from "node-fetch"
import io from "socket.io-client"
import 'dotenv/config'

class Api {
	canvas_id = 1
	id_equipe = 7
	id_worker = 1
	url = `http://149.202.79.34:8085/api/`
	headers = {
		Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
	}
	socket = io('ws://149.202.79.34:8085/api/socket', {
		auth: {
			token: process.env.MDP,
		}
	})

	async listEquipe() {
		const response = await fetch(`${this.url}equipes/`, {
			method: "GET",
			headers: this.headers,
		})

		return response.json()
	}

	async getEquipeDetails() {
		const response = await fetch(`${this.url}equipes/${this.id_equipe}`, {
			method: "GET",
			headers: this.headers,
		})

		return response.json()
	}

	async getCanvaData() {
		const response = await fetch(`${this.url}canvas/${this.canvas_id}`, {
			method: "GET",
			headers: this.headers,
		})

		return response.json()
	}

	async getCanvaSettings() { }

	async getWorkerDetails() {
		const response = await fetch(`${this.url}equipes/${this.id_equipe}/workers/${this.id_worker}`, {
			method: "GET",
			headers: this.headers,
		})

		return response.json()
	}

	async setWorkerPosition() { }
}

const api = new Api()

console.log(await api.getCanvaData())
console.log(await api.listEquipe())
//console.log(await api.getEquipeDetails())
//console.log(await api.getWorkerDetails())