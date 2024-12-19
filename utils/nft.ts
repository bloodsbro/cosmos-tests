import gql from 'graphql-tag';

export const viewNFT = async (collectionAddr, tokenId) => {
  const { clients } = useApollo();

  const query = gql`
    query GetNFTDetails($collectionAddr: String!, $tokenId: String!) {
      token(collectionAddr: $collectionAddr, tokenId: $tokenId) {
        traits {
          name
          value
        }
        owner {
          address
          name {
            name
          }
        }
      }
    }
  `;

  try {
    const response = await clients?.default.query({
      query,
      variables: {
        collectionAddr,
        tokenId,
      },
    });

    return response.data.token;
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    throw new Error('Failed to fetch NFT details');
  }
};
