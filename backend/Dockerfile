# ==============================================================================
# Stage 1: Build & Package Spring Boot Application
# ==============================================================================
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package executable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Stage 2: Minimal, Secure Production Runtime
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Create unprivileged system user for container security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy pre-built JAR from builder stage
COPY --from=builder /build/target/*.jar /app/app.jar

# Fix ownership
RUN chown -R spring:spring /app

USER spring:spring

# Default port (can be dynamically overridden by Render/Cloud providers via $PORT)
ENV PORT=8085
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

EXPOSE 8085

# Execute Spring Boot application with container-aware JVM settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8085} -jar /app/app.jar"]
