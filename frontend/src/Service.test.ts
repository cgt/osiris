/**
 * @jest-environment node
 */

import 'isomorphic-fetch';
import { pactWith } from 'jest-pact';

pactWith(
    {
        consumer: 'Frontend',
        provider: 'Backend',
    },
    provider => {
        let service: Service;

        beforeEach(() => {
            service = new Service(provider.mockService.baseUrl);
        });

        describe('Login', () => {
            beforeEach(() =>
                provider.addInteraction({
                    state: 'User test with password test exists',
                    uponReceiving: 'A request to log in user test with the correct password',
                    withRequest: {
                        method: 'POST',
                        path: '/api/login',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    },
                    willRespondWith: {
                        status: 200,
                        body: {
                            'token': 'a-json-web-token',
                        },
                    },
                })
            );

            it('returns an auth token', async () => {
                const response = await service.login({username: 'test', password: 'test'});
                expect(response).toEqual({token: 'a-json-web-token'});
            });
        });
    }
);

interface Credentials {
    readonly username: string;
    readonly password: string;
}

class Service {
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