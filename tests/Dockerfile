FROM cypress/included:6.0.0
WORKDIR /tests
COPY package.json .
COPY package-lock.json .
ENV CI=1
RUN npm ci
RUN npx cypress verify