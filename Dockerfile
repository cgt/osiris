FROM maven:3.6.3-adoptopenjdk-15 as builder
WORKDIR /build
COPY backend/pom.xml .
RUN mvn -B dependency:go-offline
COPY backend .
RUN mvn -B package

FROM adoptopenjdk:15-jre-hotspot
WORKDIR /app/backend
COPY --from=builder /build/target/osiris-0.0.1-SNAPSHOT.jar osiris.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/backend/osiris.jar"]