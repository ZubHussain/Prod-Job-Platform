FROM apache/kafka:4.0.0

COPY --chown=appuser:appuser start-kafka.sh /etc/kafka/docker/start-kafka.sh
RUN chmod +x /etc/kafka/docker/start-kafka.sh

USER appuser
EXPOSE 9092
CMD ["/etc/kafka/docker/start-kafka.sh"]
