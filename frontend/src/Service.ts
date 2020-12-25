interface Credentials {
    readonly username: string;
    readonly password: string;
}

export class Service {
    constructor(private readonly baseUrl: string) {}

    async login(credentials: Credentials): Promise<{ readonly token: string; }> {
        const response = await fetch(`${this.baseUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error(`Something evil happened: ${response.status} ${response.statusText}`); // TODO
        }
        const {token} = await response.json();
        return {token};
    }
}