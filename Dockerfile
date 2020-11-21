FROM maven:3.6.3-adoptopenjdk-15 as builder
WORKDIR /build
COPY backend/pom.xml .
RUN mvn -B dependency:go-offline
COPY backend .
RUN mvn -B package
WORKDIR /osiris
RUN ["java", "-Djarmode=layertools", "-jar", "/build/target/osiris-0.0.1-SNAPSHOT.jar", "extract"]

FROM node:14 as frontend
WORKDIR /build
COPY frontend/package.json .
COPY frontend/package-lock.json .
RUN npm install
COPY frontend .
RUN CI=true npm test
RUN CI=true npm run build

FROM adoptopenjdk:15-jre-hotspot
WORKDIR /app/backend
COPY --from=builder /osiris/dependencies/ ./
COPY --from=builder /osiris/spring-boot-loader/ ./
COPY --from=builder /osiris/snapshot-dependencies/ ./
COPY --from=builder /osiris/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]