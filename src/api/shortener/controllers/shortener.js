"use strict";

/**
 *  shortener controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::shortener.shortener",
  ({ strapi }) => ({
    async find(ctx) {
      let { query } = ctx;
      const user = ctx.state.user;
      let entity;
      if (user) {
        query = { user: { $eq: user.id } };
        entity = await strapi
          .service("api::shortener.shortener")
          .find({ filters: query });
      } else {
        query = { alias: { $eq: query.alias } };
        console.log(query);
        entity = await strapi
          .service("api::shortener.shortener")
          .find({ filters: query });
        //If found we also increment the visit field in the shortner collection to track the visit.
        if (entity.results.length !== 0) {
          let id = entity.results[0].id;
          let visit = Number(entity.results[0].visit) + 1;
          await strapi
            .service("api::shortener.shortener")
            .update(id, { data: { visit } });
        }
      }
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
    async create(ctx) {
      const data = ctx.request.body;
      const user = ctx.state.user;

      let entity;
      data.user = user.id;
      entity = await strapi
        .service("api::shortener.shortener")
        .create({ data });
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
  })
);
