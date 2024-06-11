# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

#  Set the working directory in the container
WORKDIR /app

# Copy the project's jar file into the container at /app
COPY target/ecommerce-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your application will run on
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "app.jar"]