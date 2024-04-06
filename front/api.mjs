import fetch from "node-fetch"
import io from "socket.io-client"
import 'dotenv/config'

class Api {
	canvas_id = process.env.CANVAS_ID
	id_equipe = process.env.TEAM_ID
	nom_canvas = "canvas_200x300"
	id_chunk = 5
	url = `http://149.202.79.34:8085/api/`
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

	async infoChunk() {
		const response = await fetch(`${this.url}canvas/${this.canvas_id}/chunks/${this.id_chunk}`, {
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
		const response = await fetch(`${this.url}pixels/${this.nom_canvas}/settings`, {
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

	async setWorkerPosition(id_equipe, id_worker, canvas, chunk, color, pos_x, pos_y) {
		const data = {
			canvas: canvas,
			chunk: chunk,
			color: color,
			pos_x: pos_x,
			pos_y: pos_y
		};

		console.log("ttt")

		const response = await fetch(`${this.url}equipes/${id_equipe}/workers/${id_worker}/pixel`, {
			method: "PUT",
			headers: this.post_headers,
			body: JSON.stringify(data)
		});

		console.log("aaa");

		return response.json()
	}
}

const api = new Api()


