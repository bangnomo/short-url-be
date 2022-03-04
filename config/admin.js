module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f1b02118a96be41c2a3ac4881c912afc'),
  },
});
