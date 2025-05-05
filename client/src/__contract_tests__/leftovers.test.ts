import { provider } from './pact.helper';
import { GraphQLInteraction } from '@pact-foundation/pact/src/dsl/graphql';
import { GET_LEFTOVERS } from '../graphql/leftovers';
import { print } from 'graphql';

// Sample leftover data that matches your schema
const leftoverExample = {
  id: '1',
  name: 'Lasagna',
  description: 'Homemade beef lasagna',
  portion: 2,
  storageLocation: 'FREEZER',
  storedDate: '2025-05-01T12:00:00Z',
  expiryDate: '2025-05-15T12:00:00Z',
  tags: ['pasta', 'beef'],
  consumed: false,
  consumedDate: null,
  createdAt: '2025-05-01T12:00:00Z',
  updatedAt: '2025-05-01T12:00:00Z'
};

describe('Leftovers API Contract Tests', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  afterEach(() => provider.verify());

  describe('GET_LEFTOVERS Query', () => {
    beforeEach(() => {
      // Create a GraphQL interaction for the GET_LEFTOVERS query
      const interaction = new GraphQLInteraction()
        .uponReceiving('a request for all leftovers')
        .withRequest({
          path: '/graphql',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .withQuery(print(GET_LEFTOVERS)
        )
        .withVariables({
          location: null
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: {
            data: {
              leftovers: [leftoverExample]
            }
          }
        });

      return provider.addInteraction(interaction);
    });

    test('returns the list of leftovers', async () => {
      // This test would typically use your Apollo client to make the query
      // For a contract test, we just need to verify the interaction works
      const response = await fetch(`${provider.mockService.baseUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: print(GET_LEFTOVERS),
          variables: { location: null }
        })
      });

      const result = await response.json();
      expect(response.status).toEqual(200);
      expect(result.data.leftovers[0].name).toEqual('Lasagna');
    });
  });
});