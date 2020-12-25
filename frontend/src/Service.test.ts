/**
 * @jest-environment node
 */

import 'isomorphic-fetch';
import { pactWith } from 'jest-pact';
import { Service } from './Service';

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