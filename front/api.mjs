import fetch from "node-fetch"
import io from "socket.io-client"
import 'dotenv/config'

export class Api {
	canvas_id = process.env.CANVAS_ID
	id_equipe = process.env.TEAM_ID
	canvas_name = process.env.CANVAS_NAME
	api_url = "http://" + process.env.API_URL
	token_url = "http://" + process.env.TOKEN_URL + "realms/codelemans/protocol/openid-connect/token"

	async init() {
		this.access_token = (await this.getToken()).access_token
	}

	async getToken() {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				'grant_type': 'password',
				'client_id': `${process.env.CLIENT_ID}`,
				'username': `${process.env.CLIENT_USERNAME}`,
				'password': `${process.env.MDP}`,
			})
		};
		const response = await fetch(this.token_url, options)

		return response.json()
	}

	async listEquipe() {
		const response = await fetch(`${this.api_url}equipes/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		})

		return response.json()
	}

	async infoChunk(id_chunk) {
		const response = await fetch(`${this.api_url}canvas/${this.canvas_id}/chunks/${id_chunk}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		})

		return response.json()
	}

	async getEquipeDetails() {
		const response = await fetch(`${this.api_url}equipes/${this.id_equipe}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		})

		return response.json()
	}

	async getCanvaData() {
		const response = await fetch(`${this.api_url}canvas/${this.canvas_id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		})

		return response.json()
	}

	async getCanvaSettings() {
		const response = await fetch(`${this.api_url}pixels/${this.canvas_name}/settings`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
		})

		return response.text()
	}

	async getWorkerDetails(id) {
		const response = await fetch(`${this.api_url}equipes/${this.id_equipe}/workers/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.access_token}`,
			},
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
		const response = await fetch(`${this.api_url}equipes/${this.id_equipe}/workers/${id_worker}/pixel`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${this.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})

		return response.json()
	}
}