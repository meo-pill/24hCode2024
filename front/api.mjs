import fetch from "node-fetch"
import io from "socket.io-client"
import 'dotenv/config'

export class Api {
	canvas_id = process.env.CANVAS_ID
	id_equipe = process.env.TEAM_ID
	canvas_name = process.env.CANVAS_NAME
	url = process.env.URL
	headers = {
		Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
	}
	post_headers = {
		Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
		'Content-Type': 'application/json'
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

	async infoChunk(id_chunk) {
		const response = await fetch(`${this.url}canvas/${this.canvas_id}/chunks/${id_chunk}`, {
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

	async getCanvaSettings() {
		const response = await fetch(`${this.url}pixels/${this.canvas_name}/settings`, {
			method: "GET",
			headers: this.headers,
		})

		return response.text()
	}

	async getWorkerDetails(id) {
		const response = await fetch(`${this.url}equipes/${this.id_equipe}/workers/${id}`, {
			method: "GET",
			headers: this.headers,
		})

		return response.json()
	}

	async setWorkerPosition(id_worker, chunk, color, pos_x, pos_y) {
		const data = {
			canvas: this.canvas_name,
			chunk: chunk,
			color: color,
			pos_x: pos_x,
			pos_y: pos_y
		}
		const response = await fetch(`${this.url}equipes/${this.id_equipe}/workers/${id_worker}/pixel`, {
			method: "PUT",
			headers: this.post_headers,
			body: JSON.stringify(data)
		})

		return response.json()
	}
}
