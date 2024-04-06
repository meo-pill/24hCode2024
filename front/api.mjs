import fetch from "node-fetch";

class Api {
	url = `http://149.202.79.34:8085/api/canvas/${canvasId}`;

	socket = io('ws://149.202.79.34:8085/api/socket', {
		auth: {
			token: '%K7%%GG,2U5g-k9'
		}
	});

	async listEquipe() { }

	async getEquipeDetails() { }

	async getCanvaData(canvasId, accessToken) {
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (!response.ok) throw new Error(`Error: ${response.statusText}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Erreur:", error);
			return null;
		}
	}

	async getCanvaSettings() { }

	async getWorkerDetails() { }

	async setWorkerPosition() { }
}
