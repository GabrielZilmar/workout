export const requestSsoUserMock = {
  successRequest: {
    userId: '387347ba-1382-49b4-af72-3ed103f30905',
    request: {
      size: 0,
      timeout: 0,
      body: {
        id: '387347ba-1382-49b4-af72-3ed103f30905',
        name: 'User',
        email: 'user@email.com',
        isEmailVerified: false,
        isAdmin: false,
        isDeleted: false,
        deleteAt: null,
      },
      ok: true,
      status: 200,
      statusText: 'OK',
    },
  },
  rejectedRequest: {
    userId: 'not-found',
    request: {
      size: 0,
      timeout: 0,
      body: {},
      status: 404,
      statusText: 'NOT_FOUND',
    },
  },
};

export default requestSsoUserMock;
