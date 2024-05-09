#
# ---- Base Image ----
# Use to set up defaults
#
ARG BASE_IMAGE_VER=22.2-alpine3.19
ARG BUILD_PLATFORM=linux/amd64
FROM --platform=${BUILD_PLATFORM} node:${BASE_IMAGE_VER} AS base

# see https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app

ENV NODE_PM=pnpm

RUN npm i -g ${NODE_PM}

ENV NODE_ENV=${NODE_ENV:-development}
ENV VITE_PORT=${VITE_PORT:-5173}
ENV VITE_HOST=${VITE_HOST:-0.0.0.0}

COPY ./ ./

#
# ---- Dependencies Image ----
# Use to hold cached node_modules ?and prod_modules separate?
#
FROM base AS deps
RUN ${NODE_PM} i -P --modules-dir ./node_modules_prod/
RUN ${NODE_PM} i -D --modules-dir ./node_modules_dev/
RUN ${NODE_PM} i

#
# ---- Development Image ----
# Use in development
#
FROM base AS dev

COPY --from=deps /app/node_modules/ ./node_modules/

EXPOSE ${VITE_PORT}

CMD ${NODE_PM} dev --mode ${NODE_ENV} --host ${VITE_HOST}

#
# ---- Build Image ----
# Use for production's build
#
FROM base AS build

ENV NODE_ENV=${NODE_ENV:-production}

COPY --from=deps /app/node_modules/ ./node_modules/

RUN ${NODE_PM} build

CMD ${NODE_PM} preview --port ${VITE_PORT} --mode ${NODE_ENV} --host ${VITE_HOST}

#
# ---- Preview Image ----
# Use for production's preview
#
FROM base AS preview

ENV NODE_ENV=${NODE_ENV:-production}

COPY --from=build app/dist/ ./dist/
# TODO: use node_modules_prod, for now is complaining about vite.js
COPY --from=deps app/node_modules/ ./node_modules/

CMD ${NODE_PM} preview --port ${VITE_PORT} --mode ${NODE_ENV} --host ${VITE_HOST}

#
# ---- Production Image ----
# Use for production
#
FROM nginx:1 as prod

COPY --from=build /app/dist/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
